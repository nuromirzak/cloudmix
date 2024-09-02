import * as cdk from 'aws-cdk-lib';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as elbv2 from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as s3assets from 'aws-cdk-lib/aws-s3-assets';
import * as targets from 'aws-cdk-lib/aws-elasticloadbalancingv2-targets';
import {Construct} from 'constructs';

export class CloudmixCdkStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		const vpc = new ec2.Vpc(this, 'CloudmixVPC', {
			maxAzs: 2,
			natGateways: 0,
			subnetConfiguration: [{name: 'public', subnetType: ec2.SubnetType.PUBLIC, cidrMask: 26}],
		});

		const {database, dbSecret, databaseName} = this.createDatabase(vpc);

		// this.createApp(vpc, database, dbSecret, databaseName);
	}

	createDatabase(vpc: ec2.Vpc): {
		database: rds.DatabaseInstance,
		dbSecret: secretsmanager.Secret,
		databaseName: string
	} {
		const dbSecurityGroup = new ec2.SecurityGroup(this, 'DatabaseSecurityGroup', {vpc});
		dbSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(5432));

		const dbSecret = new secretsmanager.Secret(this, 'CloudmixDatabaseSecret', {
			generateSecretString: {
				secretStringTemplate: JSON.stringify({username: 'nurma'}),
				generateStringKey: 'password',
				excludePunctuation: true,
			}
		});

		const databaseName = 'cloudmix';
		const database = new rds.DatabaseInstance(this, 'CloudmixDatabase', {
			databaseName: databaseName,
			engine: rds.DatabaseInstanceEngine.postgres({version: rds.PostgresEngineVersion.VER_16}),
			instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
			vpc,
			vpcSubnets: {subnetType: ec2.SubnetType.PUBLIC},
			removalPolicy: cdk.RemovalPolicy.DESTROY,
			deletionProtection: false,
			publiclyAccessible: true,
			securityGroups: [dbSecurityGroup],
			credentials: rds.Credentials.fromSecret(dbSecret),
			backupRetention: cdk.Duration.days(0),
		});

		new cdk.CfnOutput(this, 'DatabaseEndpoint', {value: database.dbInstanceEndpointAddress});
		new cdk.CfnOutput(this, 'DatabasePort', {value: database.dbInstanceEndpointPort});

		return {database, dbSecret, databaseName};
	}

	createApp(vpc: ec2.Vpc, database: rds.DatabaseInstance, dbSecret: secretsmanager.Secret, databaseName: string): ec2.Instance {
		const dbUrl = `jdbc:postgresql://${database.dbInstanceEndpointAddress}:${database.dbInstanceEndpointPort}/${databaseName}`;
		console.log(`DB URL: ${dbUrl}`);

		const springBootJarAsset = new s3assets.Asset(this, 'SpringBootJarAsset', {
			path: '../backend/build/libs/cloudmix-0.0.1-SNAPSHOT.jar',
		});

		const certificateArn = 'arn:aws:acm:eu-central-1:730335517500:certificate/21c17246-3ad1-4378-8afe-d4d53a099de9';
		const certificate = acm.Certificate.fromCertificateArn(this, 'CloudmixCertificate', certificateArn);

		const internalPort = 8000;
		const ec2SecurityGroup = new ec2.SecurityGroup(this, 'EC2SecurityGroup', {
			vpc,
			description: 'Security group for EC2 instance',
			allowAllOutbound: true,
		});
		ec2SecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(internalPort));
		ec2SecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22));

		const role = new iam.Role(this, 'EC2Role', {
			assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
			managedPolicies: [
				iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore'),
				iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3ReadOnlyAccess'),
			],
		});
		dbSecret.grantRead(role);

		const instance = new ec2.Instance(this, 'AppInstance', {
			vpc,
			vpcSubnets: {subnetType: ec2.SubnetType.PUBLIC},
			instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
			machineImage: ec2.MachineImage.latestAmazonLinux2023(),
			securityGroup: ec2SecurityGroup,
			role,
		});

		const userData = ec2.UserData.forLinux();
		userData.addCommands(
			'dnf update -y',
			`dnf install -y java-21-amazon-corretto-headless`,
			`aws s3 cp s3://${springBootJarAsset.s3BucketName}/${springBootJarAsset.s3ObjectKey} /home/ec2-user/app.jar`,
			'echo "[Unit]" > /etc/systemd/system/myapp.service',
			'echo "Description=My Java Application" >> /etc/systemd/system/myapp.service',
			'echo "After=network.target" >> /etc/systemd/system/myapp.service',
			'echo "" >> /etc/systemd/system/myapp.service',
			'echo "[Service]" >> /etc/systemd/system/myapp.service',
			'echo "User=ec2-user" >> /etc/systemd/system/myapp.service',
			`echo "Environment=DB_URL=${dbUrl}" >> /etc/systemd/system/myapp.service`,
			`SECRET=$(aws secretsmanager get-secret-value --secret-id ${dbSecret.secretArn} --query SecretString --output text)`,
			`echo "Environment=DB_USERNAME=$(echo $SECRET | jq -r .username)" >> /etc/systemd/system/myapp.service`,
			`echo "Environment=DB_PASSWORD=$(echo $SECRET | jq -r .password)" >> /etc/systemd/system/myapp.service`,
			`echo "Environment=PORT=${internalPort}" >> /etc/systemd/system/myapp.service`,
			'echo "ExecStart=/usr/bin/java -jar /home/ec2-user/app.jar" >> /etc/systemd/system/myapp.service',
			'echo "" >> /etc/systemd/system/myapp.service',
			'echo "[Install]" >> /etc/systemd/system/myapp.service',
			'echo "WantedBy=multi-user.target" >> /etc/systemd/system/myapp.service',
			'systemctl daemon-reload',
			'systemctl enable myapp.service',
			'systemctl start myapp.service'
		);
		instance.addUserData(userData.render());

		const albSecurityGroup = new ec2.SecurityGroup(this, 'ALBSecurityGroup', {
			vpc,
			description: 'Security group for Application Load Balancer',
			allowAllOutbound: false,
		});

		albSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80));
		albSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443));

		albSecurityGroup.addEgressRule(ec2SecurityGroup, ec2.Port.tcp(internalPort));

		const lb = new elbv2.ApplicationLoadBalancer(this, 'LB', {
			vpc,
			internetFacing: true,
			securityGroup: albSecurityGroup
		});
		const listener = lb.addListener('Listener', {
			port: 443,
			certificates: [certificate],
			sslPolicy: elbv2.SslPolicy.RECOMMENDED,
		});
		lb.addRedirect({sourcePort: 80, targetPort: 443});

		listener.addTargets('AppTarget', {
			port: internalPort,
			targets: [new targets.InstanceTarget(instance)],
			healthCheck: {path: '/health', interval: cdk.Duration.seconds(60)},
			protocol: elbv2.ApplicationProtocol.HTTP,
		});

		ec2SecurityGroup.addIngressRule(albSecurityGroup, ec2.Port.tcp(internalPort));

		new cdk.CfnOutput(this, 'LoadBalancerDNS', {value: lb.loadBalancerDnsName});

		return instance;
	}
}
