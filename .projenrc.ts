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

// add rust build tools and cargo-lambda binary release to github actions `build` workflow
project.github?.tryFindWorkflow("build")?.file?.patch(
  JsonPatch.add("/jobs/build/steps/1", {
    name: "install cargo-lambda",
    uses: "jaxxstorm/action-install-gh-release@v1",
    with: {
      arch: "x86_64",
      platform: "linux",
      repo: "cargo-lambda/cargo-lambda",
    },
  }),
);

project.github?.tryFindWorkflow("build")?.file?.patch(
  JsonPatch.add("/jobs/build/steps/1", {
    name: "install zig",
    uses: "mlugg/setup-zig@v1",
  }),
);

project.github?.tryFindWorkflow("build")?.file?.patch(
  JsonPatch.add("/jobs/build/steps/1", {
    name: "install rust toolchain",
    uses: "actions-rust-lang/setup-rust-toolchain@v1",
    with: {
      cache: true,
      toolchain: "stable",
    },
  }),
);

// when running locally, install rust build tools and cargo-lambda
project.projectBuild.preCompileTask.prependSpawn(
  project.addTask("rust-deps", {
    steps: [
      { exec: "brew install rustup zig", condition: '[ -z "$CI" ]' },
      { exec: "cargo install cargo-lambda", condition: '[ -z "$CI" ]' },
    ],
  }),
);

project.synth();
