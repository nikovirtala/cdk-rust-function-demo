import { App } from "aws-cdk-lib";
import { Match, Template } from "aws-cdk-lib/assertions";
import { beforeAll, describe, expect, test } from "vitest";

describe("MyStack", () => {
    let template: Template;

    beforeAll(async () => {
        /* Skip bundling: building the Rust function needs cargo-lambda or Docker, and the asset
         * hash depends on the build environment, so the tests check the resources instead.
         * src/main.ts synthesizes the app when it's imported, so the context has to be in place
         * before the import, which is why it goes through CDK_CONTEXT_JSON (read by every App). */
        process.env.CDK_CONTEXT_JSON = JSON.stringify({ "aws:cdk:bundling-stacks": [] });
        const { MyStack } = await import("../src/main");

        template = Template.fromStack(new MyStack(new App(), "test"));
    });

    test("creates a bucket", () => {
        template.resourceCountIs("AWS::S3::Bucket", 1);
    });

    test("creates the Rust function with the bucket name in its environment", () => {
        template.resourceCountIs("AWS::Lambda::Function", 1);
        template.hasResourceProperties("AWS::Lambda::Function", {
            Handler: "bootstrap",
            Runtime: "provided.al2023",
            Environment: {
                Variables: {
                    BUCKET_NAME: { Ref: Match.stringLikeRegexp("^Bucket") },
                },
            },
        });
    });

    test("grants the function read and write access to the bucket", () => {
        const policies = template.findResources("AWS::IAM::Policy");
        const actions = Object.values(policies).flatMap((policy) =>
            policy.Properties.PolicyDocument.Statement.flatMap((statement: { Action: string | string[] }) =>
                ([] as string[]).concat(statement.Action),
            ),
        );

        expect(actions).toEqual(expect.arrayContaining(["s3:GetObject*", "s3:PutObject", "s3:DeleteObject*"]));
    });
});
