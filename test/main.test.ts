import { App } from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import { expect, test } from "vitest";
import { MyStack } from "../src/main";

test("Snapshot", () => {
    const app = new App();
    const stack = new MyStack(app, "test");

    const template = Template.fromStack(stack);
    expect(template.toJSON()).toMatchSnapshot();
});
