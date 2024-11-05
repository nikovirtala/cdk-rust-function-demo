import * as path from "path";
import { App, Stack, StackProps, aws_s3 } from "aws-cdk-lib";
import { Architecture } from "aws-cdk-lib/aws-lambda";
import { RustFunction } from "cargo-lambda-cdk";
import { Construct } from "constructs";

export class MyStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    const bucket = new aws_s3.Bucket(this, "Bucket");

    const f = new RustFunction(this, "Function", {
      architecture: Architecture.ARM_64,
      manifestPath: path.join(__dirname, "../Cargo.toml"),
      bundling: {
        cargoLambdaFlags: ["--target", "aarch64-unknown-linux-gnu"],
        environment: {
          BUCKET_NAME: bucket.bucketName,
        },
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
