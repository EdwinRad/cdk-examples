# AWS CDK Copy and Paste Examples

Figuring out how some properties of CDK components work are a pain in the ass.
Take the EBS volume config for an EC2 instance:
```
blockDevices: [{
                deviceName: '/dev/sdh',
                mappingEnabled: true,
                volume: ec2.BlockDeviceVolume.ebs(20, {
                    deleteOnTermination: true,
                    encrypted: true,
                    volumeType: ec2.EbsDeviceVolumeType.GENERAL_PURPOSE_SSD,
                }),
            }],
```
It takes me personally ages to find out how all of this object is constructed.
This repo contains simple configuration examples of AWS CDK components to help you work faster.

They are not meant as stand alone run out of the box but more a reference to figure out how the config works.
The templates don't necessarily follow best practices.


