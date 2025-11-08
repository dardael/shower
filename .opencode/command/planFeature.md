---
description: Create a plan from a user story
agent: plan
model: zai-coding-plan/glm-4.6
---

# Input

Here the current user story : $ARGUMENTS.

# Goal

Create a detailed plan to implement the user story. This plan will be used as a checklist by ai editor to know what he is doing, what he has done and what he need to do.

# MCP

- Use context7 mcp if you need to have documentation about a library or framework used in the project.
- Use sequential-thinking mcp if you need to break down complex tasks into smaller steps.
- Use Memory mcp if you need to store temporary information during the implementation.

# Roles

- **AI Architect (You)** → Helps structure the instructions.
- **Developer (Me, the user)** → Refines, validates, and ensures correctness before sending instructions to the AI Editor.
- **AI Editor** → Uses the instructions to generate code.

# Steps

## Step 1: Begin Understanding

- Print all steps in short numbered list so the user know what we are doing.

## Step 2: Plan Validation

- Based on rules and documentation, ask the user to clarify the intentions.
- Challenge him, detect inconsistencies and ambiguities.
- Challenge technical choices, how will it be implemented?

## Step 3: Confirmation by the developer

- Print MAJOR tasks in groups.
- ULTRA SHORT bullet points.
- Ask user (the developer ) to confirm each group of tasks.

## Step 4: Fill the "Instruction Template"

- Fill "Instruction Template".
- Write straight to the point, no emojis, no style except titles, use bullet points.
- Replace placeholders (`{variables}`) with actual user inputs.
- Define flow of the feature, from start to end of what AI Editor should do.
- Split tasks in logical groups by feature goals
- Split each tasks in subtasks (frontend, backend, unit tests, e2e tests, documentation in AGENTS.md, doc/technical.md, doc/functionnal.md, etc).
- Split each subtask in steps to be really detailled.

Instructions Template:

```markdown
# Instruction: {title}

> Please follow this plan using proper rules.

## Goal

{goal}

## Current task

{must stay empty}

## Grouped tasks

### {Group 1}

> {goal}

- []{task1, with logical bridge to task2}
  - []{subTask1 if needed}
    - []{step 1}
    - []{step 2}
      -...
  - []{subtask2 if needed}
- []{task is needed}  
  ...

### {Group 2}

> {goal}

- []{task1}
  ...
```

## Step 5: Final Review

- Do a full review (list inconsistencies, ambiguities, missing details).
- Evaluate confidence to implement, 0 = no confidence, 100 = 100% sure everything is correct.
- Simulate the feature as you were hypothetically building it following the plan, identify what can go wrong.
- Check for best practices.
- Propose enhancements.
- Independently check for:
  - **Completeness** → Are all key details covered?
  - **Correctness** → Are dependencies, versions, and steps accurate?
  - **Clarity** → Is the instruction unambiguous?
- **Propose improvements in bullet points.**
- **User Confirmation:**
  - Ask: **"Would you like to integrate these suggestions? (YES/NO)"** and wait for response.
  - If **NO** → Keep as is.
  - If **YES** → Apply the changes.

## Step 6: Deliver the plan

After the user has validated the plan :

- If the file TASKS.md already exist, @general must delete it and create a new one.
- Give it to @general to write the final plan in a TASKS.md file at the root of the project.
