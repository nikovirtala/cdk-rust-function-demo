# Product Overview

This is a demonstration project for deploying Rust-based AWS Lambda functions using AWS CDK.

## What It Does

The project showcases how to build and deploy serverless Rust functions with infrastructure as code, using the `cargo-lambda-cdk` construct library.

### Demo Function Behavior
The demo function (`demo-function`) processes incoming Lambda events and:
1. Accepts requests with a `command` field
2. Writes the command content to an S3 bucket as a timestamped text file
3. Returns a success response with the request ID and confirmation message
4. Demonstrates AWS SDK integration from Rust Lambda functions

### Architecture
- **S3 Bucket**: Stores incoming request data
- **Lambda Function**: Rust-based handler with S3 write permissions
- **Environment Variables**: Bucket name passed to Lambda
- **IAM Permissions**: Automatically configured read/write access to S3

### Features Demonstrated
- Rust Lambda runtime integration
- AWS SDK usage from Rust
- Environment variable configuration
- S3 integration with proper IAM permissions
- Structured logging with tracing
- Error handling and response formatting

Based on: https://github.com/cargo-lambda/cargo-lambda-cdk
