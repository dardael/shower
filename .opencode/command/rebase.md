---
description: reorganize commits into logical changes for a clean feature branch
agent: build
model: zai-coding-plan/glm-4.6
---

# Goal

Have a feature branch that will be merge into main branch with the minimum number of commits, each commit representing a logical change.

# Rules

1. only commit structure can be changed. no code changes are allowed.
2. before pushing the branch, make sure there is no code difference between the feature branch and main branch except for the commit history.
3. each commit must be stable.
4. first commits must be refactorings that do not change any behavior.
5. later commits can include behavior changes, but must be clearly separated from refactorings.
6. test adaptation must be commit in the same commit as the behavior change that required the adaptation.

# Steps

IMPORTANT: if there are an error during the commit due to pre-commit hooks, make a summary of the error and stop to ask what to do next.

## Step 1: Identify Changes

- Look at current code changes made in the working directory.
- Identify logical groupings of changes that can be committed together

## Step 2: Commit Changes

- Make git commits for each logical grouping of changes.
- The commit messages should be clear and descriptive of the changes made.

## Step 3: Validate Commits

- Verify there is no code difference between the feature branch and main branch except for the commit history.
- make a summary of the commits made. one bullet point per commit, with the commit hash, the commit message and the list of files changed in that commit.
- Write "Rebase proceed successfully." at the end of the summary.
- Ask if you should push the branch to remote repository.
