import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as iam from '@aws-cdk/aws-iam';

// The components in this template are copy/paste ready and the idea is that you can refer to props that you need.
// This template does not work out of the box due to overlapping configurations 


export class Ec2Stack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

// VPC configuration new
    const vpc = new ec2.Vpc(this, 'Vpc', {
      natGateways: 0,
      cidr: '10.0.0.0/16',
      maxAzs: 2,
      enableDnsSupport: true,
      enableDnsHostnames: true,
      subnetConfiguration: [
        {
          subnetType: ec2.SubnetType.ISOLATED,
          name: 'Isolated',
          cidrMask: 24
        },
        {
          subnetType: ec2.SubnetType.PUBLIC,
          name: 'Public',
          cidrMask: 24
        }
      ]
    });

// SecurityGroup new and imported
    // const securityGroup = SecurityGroup.fromSecurityGroupId(this, 'SG', 'sg-12345', {
    //   mutable: false
    // });
    const securityGroup = new ec2.SecurityGroup(this, 'sg', {
      vpc: vpc
    })
  
// // userData example Windows
//     const userData = ec2.UserData.forWindows();
//     userData.addCommands('command1', 'command2');

// userData example Linux
    const userDataLinux = ec2.UserData.forLinux();
    userDataLinux.addCommands('sudo yum install -y httpd');

// // IAM role
    const ec2Role = new iam.Role(this, 'EC2Role', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com')
    });

// EC2 Instance
    const ec2Instance = new ec2.Instance(this, 'ec2Instance', {
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
      machineImage: new ec2.AmazonLinuxImage(),
// Latest Windows Server image
      // machineImage: new ec2.WindowsImage(
      //   ec2.WindowsVersion.WINDOWS_SERVER_2019_ENGLISH_CORE_BASE
      // ),
      vpc: vpc,
      allowAllOutbound: true,
      blockDevices: [{
        deviceName: '/dev/sdh',
        mappingEnabled: true,
        volume: ec2.BlockDeviceVolume.ebs(20, {
          deleteOnTermination: true,
          encrypted: true,
          volumeType: ec2.EbsDeviceVolumeType.GP2,
        }),
      }],
      instanceName: 'ec2Instance',
      // keyName: 'yourKeyName',
      securityGroup: securityGroup,
      userData: userDataLinux,
      role: ec2Role,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC }
    })
  }
}
