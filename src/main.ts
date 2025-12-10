import * as path from "node:path";
import { fileURLToPath } from "node:url";
import { App, aws_s3, Stack, type StackProps } from "aws-cdk-lib";
import { RustFunction } from "cargo-lambda-cdk";
import type { Construct } from "constructs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class MyStack extends Stack {
    constructor(scope: Construct, id: string, props: StackProps = {}) {
        super(scope, id, props);

        const bucket = new aws_s3.Bucket(this, "Bucket");

        // TODO: figure out how to build for arm architecture

        const f = new RustFunction(this, "DemoFunction", {
            // architecture: Architecture.ARM_64,
            manifestPath: path.join(__dirname, "../demo-function/Cargo.toml"),
            bundling: {
                // cargoLambdaFlags: ["--target", "aarch64-unknown-linux-gnu"],
            },
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
