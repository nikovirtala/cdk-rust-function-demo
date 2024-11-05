import { awscdk } from "projen";
const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: "2.165.0",
  defaultReleaseBranch: "main",
  deps: ["cargo-lambda-cdk"],
  depsUpgradeOptions: {
    workflowOptions: {
      labels: ["auto-approve", "auto-merge"],
    },
  },
  devDeps: ["@ziglang/cli"],
  autoApproveOptions: {
    secret: "GITHUB_TOKEN",
    allowedUsernames: ["nikovirtala"],
  },
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

project.projectBuild.preCompileTask.prependSpawn(
  project.addTask("rustup", {
    steps: [
      { exec: "brew install rustup zig" },
      { exec: "rustup target add x86_64-unknown-linux-gnu" },
      { exec: "cargo install cargo-lambda" },
    ],
  }),
);

project.addGitIgnore("/target/");
project.addGitIgnore("/.build/");

project.synth();
