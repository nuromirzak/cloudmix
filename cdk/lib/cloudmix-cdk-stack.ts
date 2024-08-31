import * as cdk from 'aws-cdk-lib';
import * as apprunner from 'aws-cdk-lib/aws-apprunner';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';
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
		});

		dbSecret.grantRead(new iam.AccountPrincipal(this.account));

		const vpcConnector = new apprunner.CfnVpcConnector(this, 'VpcConnector', {
			subnets: vpc.selectSubnets({subnetType: ec2.SubnetType.PUBLIC}).subnetIds,
			securityGroups: [dbSecurityGroup.securityGroupId],
		});

		const dbUrl = `jdbc:postgresql://${database.dbInstanceEndpointAddress}:${database.dbInstanceEndpointPort}/cloudmix`;
		const dbUsername = dbSecret.secretValueFromJson('username').unsafeUnwrap().toString();
		const dbPassword = dbSecret.secretValueFromJson('password').unsafeUnwrap().toString();
		console.log(`DB URL: ${dbUrl}`);
		console.log(`DB Username: ${dbUsername}`);
		console.log(`DB Password: ${dbPassword}`);

		const appRunnerService = new apprunner.CfnService(this, 'AppRunnerService', {
			sourceConfiguration: {
				autoDeploymentsEnabled: false,
				imageRepository: {
					imageIdentifier: 'public.ecr.aws/l7j1e1p3/cloudmix:latest',
					imageRepositoryType: 'ECR_PUBLIC',
					imageConfiguration: {
						port: '8080',
						runtimeEnvironmentVariables: [
							{
								name: 'DB_URL',
								value: dbUrl,
							},
							{
								name: 'DB_USERNAME',
								value: dbUsername,
							},
							{
								name: 'DB_PASSWORD',
								value: dbPassword,
							},
						],
					},
				},
			},
			instanceConfiguration: {
				cpu: '0.25 vCPU',
				memory: '1 GB',
			},
			networkConfiguration: {
				egressConfiguration: {
					egressType: 'VPC',
					vpcConnectorArn: vpcConnector.attrVpcConnectorArn,
				},
			},
		});

		new cdk.CfnOutput(this, 'AppRunnerServiceUrl', {
			value: `https://${appRunnerService.attrServiceUrl}`,
			description: 'URL of the App Runner service',
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
