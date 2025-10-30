---
description: fix eslint, prettier and typescript strict mode issues
agent: build
model: zai-coding-plan/glm-4.6
---

Here are the current eslint, prettier and typescript command execution output: !`docker compose run --rm app sh -c "npm run lint && npm run format:check && npm run build:strict"`

IMPORTANT: No need to relaunch commands if there is no error or warning shown.

If there is error or warning, correct them (Remember, you must correct them, disable warning or error is forbidden). If there is no error or warning, reply "All linting, formatting, and strict mode checks passed successfully."
