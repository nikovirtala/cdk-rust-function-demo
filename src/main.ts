import * as path from "path";
import { App, Stack, StackProps, aws_s3 } from "aws-cdk-lib";
import { Construct } from "constructs";
import { RustFunction } from "rust.aws-cdk-lambda";

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    const bucket = new aws_s3.Bucket(this, "Bucket");

    const f = new RustFunction(this, "Function", {
      directory: path.dirname("./Cargo.toml"),
      bin: "lambda",
      environment: {
        BUCKET_NAME: bucket.bucketName,
      },
    });

    bucket.grantReadWrite(f);
  }
}

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new MyStack(app, "cdk-rust-function-demo-dev", { env: devEnv });

app.synth();
