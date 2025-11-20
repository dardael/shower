# Instruction: {title}

## Goal

{goal}

## Related github issues

{link to the github issues related to this feature}

## Current task

{must stay empty}

## Steps

### Step 1: Front End implementation

- [] Task 1: {task1, with logical bridge to task2}
- [] Task 2: {task2}
  ...

### Step 2: Back End implementation

- [] Task 1: {task1, with logical bridge to task2}
- [] Task 2: {task2}
  ...

### Step 3: Write Test

- [] Task 1: {task1, with logical bridge to task2}
- [] Task 2: {task2}
  ...

### Step 4: Test the implementation

- [] Task 1: Check typescript strcit types. if it goes wrong, fix the issues.
- [] Task 2: Check eslint. if it goes wrong, fix the issues.
- [] Task 3: Check prettier. if it goes wrong, fix the issues.
- [] Task 4: check that unit tests pass. if it goes wrong, fix the issues.
- [] Task 5: Perform manual testing to ensure the feature works as expected using browsermcp mcp. if it goes wrong, fix the issues.

### Step 5: Documentation

- [] Task 1: {task1, with logical bridge to task2}
- [] Task 2: {task2}
  ...

### Step 6: Commit

- [] Task 1: Look at current code changes made in the working directory.
- [] Task 2: Identify logical groupings of changes that can be committed together.
- [] Task 3: Make git commits for each logical grouping of changes.
- [] Task 4: The commit messages should be clear and descriptive of the changes made.

### Step 7: Review the current files modified/created/deleted in the working directory

- [] Task 1: Review the implementation to ensure all tasks in the plan have been completed.
- [] Task 2: Ensure the code is clean and adheres to project standards.
- [] Task 3: Check for dead code or unnecessary comments.
- [] Task 4: Check for duplicated code.
- [] Task 5: Check that the feature is fully implemented and functional.
- [] Task 6: Make a summary of the problems you have seen in your review. group them by the following categories : Critical, Major, Minor and NITPICK. In each category, one bullet point per problem, with a short description of the problem and the file and line where it is located. at the end of the summary, Give a confidence level (from 0% to 100%)
- [] Task 7: If the confidence level is below 90%, create an implementation plan to address the issues found during the review. The plan should include tasks to fix each problem identified, along with any necessary testing or validation steps. Replace the Step 1 in @TASKS.md by those new tasks.
- [] Task 8: If the confidence level is 90% or above, write "Implementation completed successfully with high confidence." at the end of the summary.
- [] Task 9: Write the review summary in @LAST_REVIEW_SUMMARY.md. If the file already exists, replace the existing content by the new summary.

### Step 8: Push changes (only if confidence level is 90% or above)

- Task 1: push the feature branch to the remote repository.
- Task 2: create a pull request to merge the feature branch into the main branch. the description of the pull request must include the summary of feature address and implementation summary. the pull request must be linked to the related github issues.
- Task 3: add a comment on the pull request with the last review summary.
- Task 4: write "the feature branch has been pushed and a pull request has been created here: {link to the pull request}" at the end of the summary.
