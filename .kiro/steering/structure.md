# Project Structure

## Root Directory

```
.
├── src/                    # CDK infrastructure code (TypeScript)
├── demo-function/          # Rust Lambda function code
├── .projen/                # Projen metadata (generated)
├── .github/                # GitHub Actions workflows
├── .kiro/                  # Kiro AI assistant configuration
├── .projenrc.ts            # Projen configuration (source of truth)
├── cdk.json                # CDK app configuration (generated)
├── package.json            # Node.js dependencies (generated)
└── tsconfig.json           # TypeScript config (generated)
```

## Infrastructure Code (`src/`)

- `src/main.ts`: CDK app entry point
  - Defines stacks and constructs
  - Uses `RustFunction` construct from `cargo-lambda-cdk`
  - Configures AWS resources (S3, Lambda, IAM)

## Lambda Function Code (`demo-function/`)

```
demo-function/
├── src/
│   └── main.rs            # Lambda handler implementation
├── Cargo.toml             # Rust dependencies and metadata
└── Cargo.lock             # Locked dependency versions
```

### Rust Function Structure
- Entry point: `main.rs` with `#[tokio::main]` async runtime
- Handler function: `my_handler` processes Lambda events
- Uses `lambda_runtime` for Lambda integration
- AWS SDK clients initialized per invocation

## Configuration Files

### Projen-Managed (Do Not Edit Manually)
- `package.json`: Generated from `.projenrc.ts`
- `tsconfig.json`, `tsconfig.dev.json`: TypeScript configs
- `.eslintrc.json`, `.prettierrc.json`: Linting/formatting
- `cdk.json`: CDK configuration
- `.github/workflows/`: CI/CD workflows

### Source Files (Edit These)
- `.projenrc.ts`: Project configuration
- `src/main.ts`: Infrastructure code
- `demo-function/`: Rust function code

## Build Artifacts

- `cdk.out/`: Synthesized CloudFormation templates (gitignored)
- `target/`: Rust build artifacts (gitignored)
- `node_modules/`: Node.js dependencies (gitignored)

## Adding New Lambda Functions

1. Create new directory at root level (e.g., `my-function/`)
2. Initialize Rust project with `Cargo.toml`
3. Add function code in `my-function/src/main.rs`
4. Reference in `src/main.ts` using `RustFunction` construct:
   ```typescript
   new RustFunction(this, "MyFunction", {
     manifestPath: path.join(__dirname, "../my-function/Cargo.toml"),
   });
   ```
