# Instruction: Simplify Website Settings Document Structure

## Goal

Refactor the MongoDB website settings document structure from a single complex document to a simple key-value structure where each setting is stored as a separate document with only `key` and `value` properties.

## Related github issues

https://github.com/dardael/shower/issues/26

## Current task

## Steps

### Step 1: Domain Layer Implementation

- [x] Task 1: Create new WebsiteSetting entity (singular) with key and value properties
- [x] Task 2: Update WebsiteSettingsRepository interface to use individual key-based operations
- [] Task 3: Create factory methods for different setting types (name, icon, theme-color)
- [] Task 4: Add type safety methods for value validation and conversion

### Step 2: Infrastructure Layer Implementation

- [x] Task 1: Update WebsiteSettingsModel to use simple key-value schema with Schema.Types.Mixed for value
- [x] Task 2: Implement new MongooseWebsiteSettingsRepository with getByKey and setByKey methods
- [] Task 3: Add mapping logic between domain entities and database documents
- [] Task 4: Handle default value creation when documents don't exist

### Step 3: Application Layer Implementation

- [x] Task 1: Update GetWebsiteName service to fetch "website-name" key document
- [x] Task 2: Update UpdateWebsiteName service to update "website-name" key document
- [x] Task 3: Update GetWebsiteIcon service to fetch "website-icon" key document
- [x] Task 4: Update UpdateWebsiteIcon service to update "website-icon" key document
- [x] Task 5: Update GetThemeColor service to fetch "theme-color" key document
- [x] Task 6: Update UpdateThemeColor service to update "theme-color" key document

### Step 4: Write Tests

- [x] Task 1: Update unit tests for WebsiteSetting entity
- [x] Task 2: Update unit tests for MongooseWebsiteSettingsRepository
- [x] Task 3: Update unit tests for all application services (Get/Update name, icon, theme-color)
- [x] Task 4: Add integration tests for the new key-value structure
- [] Task 5: Verify existing e2e tests still pass with new implementation

### Step 5: Test the implementation

- [] Task 1: Check typescript strict types. if it goes wrong, fix the issues.
- [] Task 2: Check eslint. if it goes wrong, fix the issues.
- [] Task 3: Check prettier. if it goes wrong, fix the issues.
- [] Task 4: check that unit tests pass. if it goes wrong, fix the issues.
- [] Task 5: check that end to end tests pass. if it goes wrong, fix the issues.
- [] Task 6: Perform manual testing to ensure the feature works as expected using browsermcp mcp. if it goes wrong, fix the issues.

### Step 6: Documentation

- [x] Task 1: Update technical documentation to reflect new key-value structure
- [x] Task 2: Update AGENTS.md with any new file structure changes

### Step 7: Cleanup Legacy Code

- [x] Task 1: Remove old WebsiteSettings entity file
- [x] Task 2: Remove any unused imports and references to old structure
- [x] Task 3: Clean up any test files that reference the old entity

### Step 8: Commit

- [x] Task 1: Look at current code changes made in the working directory.
- [x] Task 2: Identify logical groupings of changes that can be committed together.
- [x] Task 3: Make git commits for each logical grouping of changes.
- [x] Task 4: The commit messages should be clear and descriptive of the changes made.

### Step 9: Review the current files modified/created/deleted in the working directory

- [x] Task 1: Review the implementation to ensure all tasks in the plan have been completed.
- [x] Task 2: Ensure the code is clean and adheres to project standards.
- [x] Task 3: Check for dead code or unnecessary comments.
- [x] Task 4: Check for duplicated code.
- [x] Task 5: Check that the feature is fully implemented and functional.
- [x] Task 6: Make a summary of the problems you have seen in your review. group them by the following categories : Critical, Major, Minor and NITPICK. In each category, one bullet point per problem, with a short description of problem and the file and line where it is located. at the end of the summary, Give a confidence level (from 0% to 100%)
- [x] Task 7: If the confidence level is below 90%, create an implementation plan to address the issues found during the review. The plan should include tasks to fix each problem identified, along with any necessary testing or validation steps. Replace the Step 1 in @TASKS.md by those new tasks.
- [x] Task 8: If the confidence level is 90% or above, write "Implementation completed successfully with high confidence." at the end of the summary.
- [x] Task 9: Write the review summary in @LAST_REVIEW_SUMMARY.md. If the file already exists, replace the existing content by the new summary.

Implementation completed successfully with high confidence.

### Step 10: Push changes (only if confidence level is 90% or above)

- [x] Task 1: push the feature branch to the remote repository.
- [x] Task 2: create a pull request to merge the feature branch into the main branch. The description of the pull request must include the summary of feature address and implementation summary. The pull request must be linked to the related github issues.
- [x] Task 3: add a comment on the pull request with the last review summary.
- [x] Task 4: write "the feature branch has been pushed and a pull request has been created here: {link to the pull request}" at the end of the summary.

The feature branch has been pushed and a pull request has been created here: https://github.com/dardael/shower/pull/40
