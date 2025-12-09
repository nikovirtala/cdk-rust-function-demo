import * as path from "node:path";
import { App, aws_s3, Stack, type StackProps } from "aws-cdk-lib";
import { RustFunction } from "cargo-lambda-cdk";
import type { Construct } from "constructs";

export class MyStack extends Stack {
    constructor(scope: Construct, id: string, props: StackProps = {}) {
        super(scope, id, props);

        const bucket = new aws_s3.Bucket(this, "Bucket");

        const f = new RustFunction(this, "DemoFunction", {
            manifestPath: path.join(import.meta.dirname, "../demo-function/Cargo.toml"),
            bundling: {},
            environment: {
                BUCKET_NAME: bucket.bucketName,
            },
        });

        bucket.grantReadWrite(f);
    }
}

const devEnv = {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new MyStack(app, "cdk-rust-function-demo-dev", { env: devEnv });

app.synth();
