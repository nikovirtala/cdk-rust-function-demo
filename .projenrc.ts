import { AwsCdkTypeScriptAppProject, Homebrew } from "@nikovirtala/projen-constructs";

const project = new AwsCdkTypeScriptAppProject({
    cdkVersion: "2.232.1",
    defaultReleaseBranch: "main",
    deps: ["cargo-lambda-cdk"],
    devDeps: ["@nikovirtala/projen-constructs"],
    name: "cdk-rust-function-demo",
});

// Configure Homebrew packages for Rust tooling
const homebrew = Homebrew.of(project);
if (homebrew) {
    homebrew.addPackage("rustup");
    homebrew.addPackage("zig");
    homebrew.addPackage("cargo-lambda/tap/cargo-lambda");
}

project.gitignore.addPatterns("/target/");

project.synth();
