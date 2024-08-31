import * as cdk from 'aws-cdk-lib';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns';
import {Construct} from 'constructs';

export class CloudmixCdkStack extends cdk.Stack {
	constructor(scope: Construct, id: string, props?: cdk.StackProps) {
		super(scope, id, props);

		const vpc = new ec2.Vpc(this, 'CloudmixVPC', {
			maxAzs: 2,
			natGateways: 0,
			subnetConfiguration: [
				{
					name: 'public',
					subnetType: ec2.SubnetType.PUBLIC,
					cidrMask: 26,
				},
			],
		});

		const dbSecurityGroup = new ec2.SecurityGroup(this, 'DatabaseSecurityGroup', {
			vpc,
			description: 'Allow database access from anywhere',
			allowAllOutbound: true,
		});

		dbSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(5432));

		const dbSecret = new secretsmanager.Secret(this, 'CloudmixDatabaseSecret', {
			secretName: 'cloudmix-database-secret',
			generateSecretString: {
				secretStringTemplate: JSON.stringify({
					username: 'nurma'
				}),
				generateStringKey: 'password',
				excludePunctuation: true,
				passwordLength: 16,
			}
		});

		const database = new rds.DatabaseInstance(this, 'CloudmixDatabase', {
			engine: rds.DatabaseInstanceEngine.postgres({
				version: rds.PostgresEngineVersion.VER_16
			}),
			instanceType: ec2.InstanceType.of(ec2.InstanceClass.BURSTABLE3, ec2.InstanceSize.MICRO),
			vpc,
			vpcSubnets: {
				subnetType: ec2.SubnetType.PUBLIC
			},
			databaseName: 'cloudmix',
			removalPolicy: cdk.RemovalPolicy.DESTROY,
			deletionProtection: false,
			publiclyAccessible: true,
			securityGroups: [dbSecurityGroup],
			credentials: rds.Credentials.fromSecret(dbSecret),
			backupRetention: cdk.Duration.days(0),
		});

		const dbUrl = `jdbc:postgresql://${database.dbInstanceEndpointAddress}:${database.dbInstanceEndpointPort}/cloudmix`;
		const dbUsername = dbSecret.secretValueFromJson('username').unsafeUnwrap().toString();
		const dbPassword = dbSecret.secretValueFromJson('password').unsafeUnwrap().toString();
		console.log(`DB URL: ${dbUrl}`);
		console.log(`DB Username: ${dbUsername}`);
		console.log(`DB Password: ${dbPassword}`);

		const fargateService = new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'CloudmixFargateService', {
			vpc,
			cpu: 512,
			memoryLimitMiB: 1024,
			taskImageOptions: {
				image: ecs.ContainerImage.fromRegistry('public.ecr.aws/l7j1e1p3/cloudmix:latest'),
				environment: {
					DB_URL: dbUrl,
					DB_USERNAME: dbUsername,
					DB_PASSWORD: dbPassword,
				},
				containerPort: 8080,
			},
			assignPublicIp: true,
			publicLoadBalancer: true,
			desiredCount: 1,
		});

		fargateService.targetGroup.configureHealthCheck({
			path: '/health',
			healthyHttpCodes: '200',
		});

		dbSecurityGroup.connections.allowFrom(fargateService.service, ec2.Port.tcp(5432));

		new cdk.CfnOutput(this, 'FargateServiceUrl', {
			value: fargateService.loadBalancer.loadBalancerDnsName,
			description: 'URL of the Fargate service',
		});

		new cdk.CfnOutput(this, 'DatabaseEndpoint', {
			value: database.dbInstanceEndpointAddress,
			description: 'Endpoint of the RDS database',
		});

		new cdk.CfnOutput(this, 'DatabasePort', {
			value: database.dbInstanceEndpointPort,
			description: 'Port of the RDS database',
		});
	}
}
