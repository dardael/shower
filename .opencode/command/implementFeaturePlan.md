---
description: Implement a plan
agent: build
model: zai-coding-plan/glm-4.6
---

# Goal

Implement a feature based on a detailed plan derived from a user story.

# [IMPORTANT] Context

When it is asked to summarize and to provide a detailed but concise summary of the conversation. give again the @TASKS.md file content as it is the only source of truth about what has to be done.

# Rules

- You're only source of truth is the provided plan at @TASKS.md:
  - Follow it strictly. step by step.
  - When you begin a task, write "Starting step {step number}: {task number}" in the Current Task section in TASKS.md file.
  - When a task is completed, mark it as done in @TASKS.md.
  - When a task failed, stop and ask for help.
- Respect YAGNI principle: "You Ain't Gonna Need It".
- Do not create more functionality beyond the plan provided and the user story.

# MCP

- Use context7 mcp if you need to have documentation about a library or framework used in the project.
- Use browsermcp mcp if you need to test the feature in a browser environment.
- Use sequential-thinking mcp if you need to break down complex tasks into smaller steps.
- Use Memory mcp if you need to store temporary information during the implementation.

# Steps

## Step 1: Create new branch

- If the project is on main branch, create a new feature branch with a name based on the feature to implement. the branch must name must be : feature/my-branch-name
- If the project is already on a feature branch, go to next step.

## Step 2: Review the plan

- Based on the provided plan, check the tasks to be implemented.
- Ensure you understand each task and its requirements.
- Identify any dependencies or prerequisites for the tasks.
- If any clarifications are needed, ask for more details before proceeding.

## Step 3: Implement the tasks

- Go through each task in the plan one by one.
