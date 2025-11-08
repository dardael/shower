---
description: Implement a plan
agent: build
model: zai-coding-plan/glm-4.6
---

# Input

$ARGUMENTS

# Goal

Implement a feature based on a detailed plan derived from a user story.

# Rules

- You're only source of truth is the provided plan at @TASKS.md:
  - Follow it strictly. step by step.
  - When you begin a step, write "Starting step {step number}: {step title}" in the Current Task section in TASKS.md file.
  - When a step is completed, mark it as done in @TASKS.md.
  - When a step failed, stop and ask for help.
  - When compacting the session due to to big context, The file TASKS.md is the only file you should keep in context and you must follow it, read the current task from it and continue.
  - for step 4 to 7, before doing anything, create corresponding tasks for the current step in TASKS.md. Then do them one by one.
- Respect YAGNI principle: "You Ain't Gonna Need It".
- Do not create more functionality beyond the plan provided and the user story.
- Do not go to step 3 more than 3 times. if after 3 iterations the confidence level is still below 90%, stop and ask for help.

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
- Write code to implement the functionality described in each task.
- Ensure to follow coding standards and best practices.

## Step 4: Test the implementation

- Check typescript strcit types. if it goes wrong, fix the issues.
- Check eslint. if it goes wrong, fix the issues.
- Check prettier. if it goes wrong, fix the issues.
- check that unit tests pass. if it goes wrong, fix the issues.
- check that end to end tests pass. if it goes wrong, fix the issues.
- Perform manual testing to ensure the feature works as expected using browsermcp mcp. if it goes wrong, fix the issues.

## Step 5: Commit

- Look at current code changes made in the working directory.
- Identify logical groupings of changes that can be committed together.
- Make git commits for each logical grouping of changes.
- The commit messages should be clear and descriptive of the changes made.

## Step 6: Review

- Review the implementation to ensure all tasks in the plan have been completed.
- Ensure the code is clean and adheres to project standards.
- Check for dead code or unnecessary comments.
- Check for duplicated code.
- Check that the feature is fully implemented and functional.
- Make a summary of the problems you have seen in your review. group them by the following categories : Critical, Major, Minor and NITPICK. In each category, one bullet point per problem, with a short description of the problem and the file and line where it is located. at the end of the summary, Give a confidence level (from 0% to 100%)
- If the confidence level is below 90%, create an implementation plan to address the issues found during the review. The plan should include tasks to fix each problem identified, along with any necessary testing or validation steps. Go to step 3.
- If the confidence level is 90% or above, write "Implementation completed successfully with high confidence." at the end of the summary.

## Step 7: Push changes

- push the feature branch to the remote repository.
- create a pull request to merge the feature branch into the main branch. the description of the pull request must include the summary of feature address and implementation summary.
- add a comment on the pull request with the last review summary.
- write "the feature branch has been pushed and a pull request has been created here: {link to the pull request}" at the end of the summary.
