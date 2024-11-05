import { awscdk, JsonPatch } from "projen";
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

project.github?.tryFindWorkflow("build")?.file?.patch(
  JsonPatch.add("/jobs/build/steps/1", {
    uses: "mlugg/setup-zig@v1",
  }),
);

project.github?.tryFindWorkflow("build")?.file?.patch(
  JsonPatch.add("/jobs/build/steps/1", {
    uses: "actions-rust-lang/setup-rust-toolchain@v1",
    with: {
      cache: true,
      toolchain: "stable",
    },
  }),
);

project.projectBuild.preCompileTask.prependSpawn(
  project.addTask("rustup", {
    steps: [{ exec: "cargo install cargo-lambda" }],
  }),
);

project.addGitIgnore("/target/");
project.addGitIgnore("/.build/");

project.synth();
