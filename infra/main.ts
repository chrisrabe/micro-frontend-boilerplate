import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Bucket, BucketAccessControl } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source } from 'aws-cdk-lib/aws-s3-deployment';
import * as path from 'path';
import { Distribution, OriginAccessIdentity } from 'aws-cdk-lib/aws-cloudfront';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';

const appName = 'micro-fe'; // TODO: CHANGE ME

class MicroUIStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    const bucket = new Bucket(this, `${appName}-bucket`, {
      accessControl: BucketAccessControl.PRIVATE
    });

    new BucketDeployment(this, `${appName}-deployment`, {
      destinationBucket: bucket,
      sources: [Source.asset(path.resolve(__dirname, '../dist'))]
    });

    const oai = new OriginAccessIdentity(this, `${appName}-oai`);
    bucket.grantRead(oai);

    new Distribution(this, `${appName}-distribution`, {
      defaultRootObject: 'micro-ui.js',
      defaultBehavior: {
        origin: new S3Origin(bucket, { originAccessIdentity: oai })
      }
    });
  }
}

const app = new cdk.App();
new MicroUIStack(app, appName, {});
