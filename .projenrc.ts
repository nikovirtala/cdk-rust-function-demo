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
      {
        exec: '/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"',
        condition: '[ -n "$CI" ]',
      },
      { exec: "/home/linuxbrew/.linuxbrew/bin/brew shellenv > ${HOME}/brewenv", condition: '[ -n "$CI" ]' },
      { exec: "cat ${HOME}/brewenv", condition: '[ -n "$CI" ]' },
      { exec: ". ${HOME}/brewenv", condition: '[ -n "$CI" ]' },
      { exec: "brew install rustup zig", condition: '[ -n "$CI" ]' },
      { exec: "rustup target add x86_64-unknown-linux-gnu" },
      { exec: "cargo install cargo-lambda" },
    ],
  }),
);

project.addGitIgnore("/target/");
project.addGitIgnore("/.build/");

project.synth();
