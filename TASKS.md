# Instruction: Admin Dashboard Code Quality Improvements

## Goal

Fix critical and major code quality issues in the Admin Dashboard implementation, including duplicate error boundaries, authentication logic duplication, overly complex localStorage handling, and debug logging in production code.

## Current task

Starting Step 4: Test the implementation

## Steps

### Step 1: Address Code Review Issues

- [x] Task 1: Fix code duplication in AdminSidebar focus trap implementation by extracting CSS selector to constant
- [x] Task 2: Add proper environment variable typing and validation for SHOWER_ENV in AdminPageAuthenticatorator
- [x] Task 3: Improve localStorage JSON parsing error handling in AdminLayout for better error recovery
- [x] Task 4: Simplify focus trap logic in AdminSidebar or consider using a library for better maintainability
- [x] Task 5: Extract test session creation logic from AdminPageAuthenticatorator to separate method for better separation of concerns
- [x] Task 6: Standardize comment style throughout AdminLayout component
- [x] Task 7: Clean up unused variable handling in AdminPageAuthenticatorator test
- [x] Task 8: Extract magic timeout numbers to constants in e2e tests
- [x] Task 9: Remove redundant style properties in AdminSidebar styling

### Step 2: Back End implementation

### Step 3: Write Test

- [x] Task 1: Write unit tests for the new shared authentication utility function
- [x] Task 2: Update existing component tests to reflect the simplified localStorage handling
- [x] Task 3: Add tests to ensure error boundaries work correctly with single boundary implementation

### Step 4: Test the implementation

- [x] Task 1: Check typescript strict types. if it goes wrong, fix the issues.
- [x] Task 2: Check eslint. if it goes wrong, fix the issues.
- [x] Task 3: Check prettier. if it goes wrong, fix the issues.
- [x] Task 4: Check that unit tests pass. if it goes wrong, fix the issues.
- [x] Task 5: Check that end to end tests pass. if it goes wrong, fix the issues.
- [x] Task 6: Perform manual testing to ensure the feature works as expected using browsermcp mcp. if it goes wrong, fix the issues.

### Step 5: Documentation

### Step 6: Commit

- [] Task 1: Look at current code changes made in the working directory.
- [] Task 2: Identify logical groupings of changes that can be committed together.
- [] Task 3: Make git commits for each logical grouping of changes.
- [] Task 4: The commit messages should be clear and descriptive of the changes made.

### Step 7: Review

- [ ] Task 1: Review the implementation to ensure all tasks in the plan have been completed.
- [ ] Task 2: Ensure the code is clean and adheres to project standards.
- [ ] Task 3: Check for dead code or unnecessary comments.
- [ ] Task 4: Check for duplicated code.
- [ ] Task 5: Check that the feature is fully implemented and functional.
- [ ] Task 6: Make a summary of the problems you have seen in your review. group them by the following categories: Critical, Major, Minor and NITPICK. In each category, one bullet point per problem, with a short description of the problem and file and line where it is located. at the end of the summary, Give a confidence level (from 0% to 100%)
- [ ] Task 7: If the confidence level is below 90%, create an implementation plan to address the issues found during the review. The plan should include tasks to fix each problem identified, along with any necessary testing or validation steps. Replace Step 1 in @TASKS.md by those new tasks.
- [ ] Task 8: If the confidence level is 90% or above, write "Implementation completed successfully with high confidence." at the end of the summary.
- [ ] Task 9: Write the review summary in @LAST_REVIEW_SUMMARY.md. If the file already exists, replace the existing content by the new summary.

### Step 8: Push changes (only if confidence level is 90% or above)

- [] Task 1: Push the feature branch to the remote repository.
- [] Task 2: Create a pull request to merge the feature branch into the main branch. The description of the pull request must include the summary of the feature address and implementation summary.
- [] Task 3: Add a comment on the pull request with the last review summary.
- [] Task 4: Write "the feature branch has been pushed and a pull request has been created here: {link to the pull request}" at the end of the summary.
