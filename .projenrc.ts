import { awscdk } from "projen";
const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: "2.114.1",
  defaultReleaseBranch: "main",
  deps: ["rust.aws-cdk-lambda"],
  jest: false,
  name: "cdk-rust-function-demo",
  prettier: true,
  prettierOptions: {
    settings: {
      printWidth: 120,
      semi: true,
      singleQuote: false,
    },
  },
  projenrcTs: true,
});

project.addGitIgnore("/target/");
project.addGitIgnore("/.build/");

project.synth();
