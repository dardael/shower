---
description: fix e2e tests
agent: build
model: zai-coding-plan/glm-4.6
---

# Goal

you must fix the e2e tests so that all tests pass successfully.

# MCP

- Use context7 mcp if you need to have documentation about a library or framework used in the project.
- Use browsermcp mcp if you need to test the feature in a browser environment.
- Use sequential-thinking mcp if you need to break down complex tasks into smaller steps.
- Use Memory mcp if you need to store temporary information during the implementation.

# Steps

## Step 1: Launch E2e Tests

- launch docker compose up mongodb -d
- launch docker compose run --rm -T app npm run build
- launch e2e tests using the following command: docker compose run --rm -T app npm run test:e2e

## Step 2: Analyze Output

- Identify any errors or failures in the test output.
- Identify also console output (like console.log) that should not be there.
- Group related errors together.

## Step 3: fix Issues

- For each group of related errors, investigate the root cause.
- Correct the code to fix the issues causing the test failures.
- Remove any unnecessary console output (like console.log) from the code.

## Step 4: Rerun Fixed Tests

- Rerun only the fixed e2e tests. If some tests are still failing, go to Step.

## Step 5: Rerun all tests

- Rerun all e2e tests to ensure that all tests pass successfully.
- If there are still failing tests, go to Step 2.
- If all tests pass successfully, respond with "All e2e tests passed successfully."
