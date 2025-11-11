# Admin Dashboard Code Quality Improvement Plan

## Overview

Fix critical code quality issues in Admin Dashboard implementation while maintaining all existing functionality and following project standards.

## Prerequisites

- Ensure all existing tests pass before starting
- Create backup of current working implementation
- Scan all admin component files to identify exact import violations before fixing

## Step 1: Identify and Fix Import Pattern Violations

[*] 1.1 Scan all admin component files for relative imports using grep/search tools
[*] 1.2 Document all found relative import violations with file paths and line numbers

Found relative import violations:

- /home/renaud/dev/shower/src/presentation/admin/components/WebsiteSettingsForm.tsx:17 - `from '../hooks/useFormState'`
- /home/renaud/dev/shower/src/presentation/admin/components/WebsiteSettingsForm.tsx:19 - `from '../hooks/useIconManagement'`
- /home/renaud/dev/shower/src/presentation/admin/hooks/useSocialNetworksForm.ts:8 - `from './useFormState'`
- /home/renaud/dev/shower/src/presentation/admin/components/WebsiteSettingsForm.tsx:15 - `from './ThemeColorSelector'`
- /home/renaud/dev/shower/src/presentation/admin/components/AdminLayout.tsx:11 - `from './AdminSidebar'`
- /home/renaud/dev/shower/src/presentation/admin/components/AdminLayout.tsx:12 - `from './AdminErrorBoundary'`
- /home/renaud/dev/shower/src/presentation/admin/components/AdminSidebar.tsx:14 - `from './AdminMenuItem'`
- /home/renaud/dev/shower/src/presentation/admin/components/AdminDashboard.tsx:13 - `from './AdminErrorBoundary'`
  [*] 1.3 Replace relative imports with absolute imports using `@/` prefix
  [*] 1.4 Update import statements in all identified files
  [*] 1.5 Verify import consistency across all admin components
  [*] 1.6 Run TypeScript compilation to ensure no import errors

## Step 2: Integrate Logging in AdminSidebar

[*] 2.1 Add logging for sidebar toggle interactions
[*] 2.2 Add logging for menu item clicks
[*] 2.3 Add logging for mobile menu open/close actions
[*] 2.4 Use structured logging with appropriate metadata
[*] 2.5 Test logging functionality in development environment

## Step 3: Simplify Focus Trap Implementation

[*] 3.1 Review current FocusTrap class implementation
[*] 3.2 Replace magic numbers (100ms timeouts) with named constants
[*] 3.3 Simplify focus trap activation/deactivation logic
[*] 3.4 Update focus trap usage in AdminSidebar component
[*] 3.5 Test keyboard navigation and focus management

## Step 4: Standardize Styling Approaches

[*] 4.1 Identify and remove inline styles in AdminSidebar
[*] 4.2 Convert all styling to Chakra UI props
[*] 4.3 Ensure consistent use of semantic Chakra components
[*] 4.4 Verify responsive design patterns are consistent
[*] 4.5 Test styling across different screen sizes

## Step 5: Simplify localStorage Parsing with Migration

[*] 5.1 Add fallback mechanism for localStorage format migration
[*] 5.2 Standardize localStorage data format to boolean only for new writes
[*] 5.3 Remove complex JSON parsing and multiple format handling
[*] 5.4 Simplify error handling to basic boolean fallback
[*] 5.5 Test sidebar state persistence across browser sessions
[*] 5.6 Test migration from old format to new format

## Step 6: Complete Test Coverage

[*] 6.1 Implement backdrop click functionality in AdminLayout
[*] 6.2 Remove TODO comments from test files
[*] 6.3 Update e2e test to include backdrop click test
[*] 6.4 Verify all admin navigation tests pass
[*] 6.5 Add regression tests for new functionality

## Step 7: Fix Component Naming

[*] 7.1 Remove unused AdminDashboard component (not used anywhere in codebase)
[*] 7.2 Update all import references (none found - component was unused)
[*] 7.3 Component file removed as it was not needed
[*] 7.4 Component removal verified - no references found in codebase
[*] 7.5 Update documentation to reflect component removal

## Step 8: Validation and Testing

[*] 8.1 Run full test suite (unit + e2e) to ensure no regressions
[*] 8.2 Perform manual testing of admin dashboard functionality
[*] 8.3 Verify accessibility features still work correctly
[*] 8.4 Check responsive design on mobile and desktop
[*] 8.5 Validate logging output and error handling
[*] 8.6 Verify no console output in test results

## Step 9: Code Quality Verification

[*] 9.1 Run linting and type checking commands
[*] 9.2 Verify all import patterns follow project standards
[*] 9.3 Check for any remaining code duplication
[*] 9.4 Ensure all console methods are properly mocked in tests
[*] 9.5 Validate adherence to SOLID principles and DDD architecture

## Step 10: Documentation Updates

[*] 10.1 Update any relevant documentation if component names changed
[*] 10.2 Document any new logging patterns or conventions
[*] 10.3 Update AGENTS.md if file structure changed
[*] 10.4 Verify README.md still reflects current functionality
[*] 10.5 Commit changes with descriptive commit message
