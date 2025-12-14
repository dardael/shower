<!--
Sync Impact Report:
- Version change: 1.7.0 → 1.8.0 (added Configuration Portability principle)
- Modified principles: None
- Added sections: Principle X (Configuration Portability)
- Removed sections: None
- Templates requiring updates: ✅ plan-template.md, ✅ spec-template.md, ✅ tasks-template.md
- Follow-up TODOs: None
-->

# Shower Constitution

## Core Principles

### I. Architecture-First Development

All development MUST follow Domain-Driven Design and Hexagonal Architecture patterns with strict layer separation. Domain layer contains business logic and entities, Application layer handles use cases, Infrastructure layer manages external dependencies, and Presentation layer contains UI components. Cross-layer dependencies MUST flow inward only (Presentation → Application → Domain → Infrastructure). This architecture ensures maintainability, testability, and scalability while preventing architectural drift.

### II. Focused Testing Approach

Testing MUST be limited to unit tests and integration tests ONLY when explicitly requested. Unit tests cover individual components and functions in isolation, integration tests verify component interactions and data flow. Tests MUST focus on common cases and typical user scenarios, avoiding edge case over-testing. Over-mocking is prohibited - use real implementations whenever possible and only mock external dependencies (API calls, database, file system). Tests are written ONLY when specifically asked for in feature requirements, with emphasis on maintainability and avoiding test brittleness.

### III. Simplicity-First Implementation

Performance monitoring MUST NOT be included in final production code to maintain simplicity and reduce complexity. Performance monitoring may be used temporarily during feature development for optimization purposes, but MUST be removed before code completion. All production code should prioritize readability, maintainability, and simplicity over performance measurement and monitoring capabilities. This ensures clean, focused codebases that are easier to understand and maintain.

### IV. Security by Default

All admin functionality MUST be protected by authentication and authorization. Google OAuth with BetterAuth provides authentication, email-based ADMIN_EMAIL configuration provides authorization. Middleware MUST enforce access controls, server-side MUST validate admin privileges, and all security events MUST be logged. No sensitive data exposure in error messages, proper session management, and rate limiting are mandatory. Public and admin endpoints MUST be clearly separated with appropriate access controls.

### V. Clean Architecture Compliance

All development MUST maintain clean architecture principles with proper separation of concerns, dependency injection, and SOLID principles. Domain layer contains business logic, Application layer handles use cases, Infrastructure layer manages external dependencies, and Presentation layer contains UI components. Cross-layer dependencies MUST flow inward only, interfaces MUST be properly segregated, and code MUST remain testable and maintainable. This ensures long-term sustainability and prevents technical debt accumulation.

### VI. Accessibility-First Design

All frontend components MUST ensure proper contrast ratios for both light and dark modes to maintain readability and accessibility. Text MUST never match its background color (e.g., white text on white background, black text on black background). Design decisions MUST prioritize contrast compliance using semantic color tokens (bg="bg.subtle", color="fg") and theme-aware styling. Components MUST be tested in both light and dark themes to ensure text remains legible and interactive elements remain visible. The theme color specified in admin dashboard settings MUST be used consistently throughout the frontend when color customization is needed, ensuring visual cohesion and brand consistency across the application. This ensures inclusive design, prevents usability issues, and maintains professional appearance across different theme preferences.

### VII. YAGNI (You Aren't Gonna Need It)

Code MUST implement only the strict minimum required for current feature requirements. No functionality should be added based on speculative future needs or potential use cases. Development MUST focus on delivering value now rather than anticipating future requirements. This prevents over-engineering, reduces complexity, and maintains code simplicity by avoiding unnecessary abstractions and features that may never be used.

### VIII. DRY (Don't Repeat Yourself)

Code MUST avoid duplication by extracting common logic into reusable functions, components, or utilities. Repeated code patterns MUST be refactored into shared abstractions. Data structures and business logic MUST be centralized to prevent inconsistencies. This ensures maintainability, reduces bugs from inconsistent updates, and creates a single source of truth for each piece of functionality.

### IX. KISS (Keep It Simple, Stupid)

Code MUST be simple, readable, and clear with straightforward implementations. Complex solutions MUST be avoided in favor of simpler approaches that meet requirements. Code structure MUST be immediately understandable by other developers without extensive documentation. This ensures maintainability, reduces cognitive load, and minimizes the likelihood of introducing bugs through unnecessary complexity.

### X. Configuration Portability

Any modification to website configuration (adding, modifying, or deleting configuration fields) MUST be synchronized with the export/import system. When a new configuration field is added, it MUST be included in the export payload. When a configuration field is modified, the export format MUST reflect the change. When a configuration field is deleted, the import system MUST handle its absence gracefully. The export file version number MUST be incremented for any configuration schema change. Import logic MUST handle version migrations to maintain backward compatibility with older exports. This ensures configuration portability, prevents data loss during backup/restore operations, and maintains system consistency across environments.

## Development Standards

### Technology Stack Requirements

- **Frontend**: Next.js 15 with App Router, TypeScript strict mode, Chakra UI v3 for components
- **Backend**: Next.js API routes with MongoDB for data persistence
- **Authentication**: BetterAuth with Google OAuth provider
- **Testing**: Jest for unit tests and integration tests (only when explicitly requested)
- **Architecture**: DDD with Hexagonal patterns, dependency injection with Tsyringe
- **Logging**: FrontendLog and BackendLog wrapper objects with console logging and environment-based log level filtering

### Code Quality Standards

- TypeScript strict mode compliance with explicit return types and no 'any' usage
- SOLID principles adherence with proper interface segregation and dependency inversion
- Clean code practices with meaningful names, small functions, and single responsibility
- Comprehensive error handling with proper logging and graceful degradation
- Consistent formatting with Prettier and linting with ESLint

## Quality Gates

### Development Workflow Requirements

All development MUST follow established workflow: feature branch creation, focused testing (unit and integration tests only when explicitly asked), linting/formatting validation, and successful build before merge. Pre-commit hooks enforce code quality, pre-push hooks validate build success and test execution when tests are present.

### Review and Compliance Requirements

Every pull request MUST verify constitution compliance: architecture adherence, focused testing approach (unit/integration only when asked, avoid over-mocking), simplicity-first implementation (no performance monitoring in final code), accessibility-first design (proper contrast for light/dark modes, consistent theme color usage), YAGNI (minimal implementation for current requirements only), DRY (no code duplication), KISS (simple, readable code), configuration portability (export/import sync for config changes), logging implementation, security controls, and clean architecture principles. Code reviews MUST validate layer separation, dependency direction, proper use of dependency injection, absence of performance monitoring code, contrast compliance for theme support, consistent use of admin-configured theme colors, minimal feature implementation, absence of code duplication, code simplicity, and export/import system synchronization for configuration changes. Security reviews MUST ensure authentication/authorization implementation and absence of sensitive data exposure. Architecture reviews MUST validate SOLID principles and proper separation of concerns.

## Governance

This constitution supersedes all other development practices and guidelines. Amendments require documentation update, team approval, and migration plan for existing code. All development MUST reference this constitution for architectural decisions, testing requirements, simplicity-first implementation, accessibility-first design, YAGNI, DRY, KISS principles, configuration portability, security implementation, and clean architecture standards. Complex deviations from constitution MUST be justified with technical rationale and approved by team consensus. Use AGENTS.md for runtime development guidance and specific implementation patterns.

**Version**: 1.8.0 | **Ratified**: 2025-01-17 | **Last Amended**: 2025-12-15
