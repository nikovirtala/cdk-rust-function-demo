import { AwsCdkTypeScriptAppProject } from "@nikovirtala/projen-constructs";
import { Homebrew } from "@nikovirtala/projen-constructs/lib/components/homebrew";

const project = new AwsCdkTypeScriptAppProject({
  cdkVersion: "2.165.0",
  defaultReleaseBranch: "main",
  name: "cdk-rust-function-demo",
  deps: ["cargo-lambda-cdk"],
});

// Add Rust build tools via Homebrew
const homebrew = Homebrew.of(project);
if (homebrew) {
  homebrew.addPackage("rustup");
  homebrew.addPackage("zig");
  homebrew.addPackage("cargo-lambda/tap/cargo-lambda");
}

project.gitignore.addPatterns("/target/");

project.synth();
