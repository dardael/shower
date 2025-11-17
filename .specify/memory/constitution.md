<!--
Sync Impact Report:
- Version change: 0.0.0 → 1.1.0 (principle refinement + template updates)
- Modified principles: Principle V (Performance-Conscious → Clean Architecture Compliance)
- Added sections: None
- Removed sections: tasks.md template and references
- Templates requiring updates: ✅ plan-template.md, ✅ spec-template.md
- Follow-up TODOs: None
-->

# Shower Constitution

## Core Principles

### I. Architecture-First Development

All development MUST follow Domain-Driven Design and Hexagonal Architecture patterns with strict layer separation. Domain layer contains business logic and entities, Application layer handles use cases, Infrastructure layer manages external dependencies, and Presentation layer contains UI components. Cross-layer dependencies MUST flow inward only (Presentation → Application → Domain → Infrastructure). This architecture ensures maintainability, testability, and scalability while preventing architectural drift.

### II. Test-Driven Quality

Comprehensive testing is NON-NEGOTIABLE and MUST precede implementation. Unit tests with Jest for business logic and services, integration tests for API contracts, and end-to-end tests with Playwright for complete user workflows. All tests MUST be written before implementation, must fail initially, and only pass when correct functionality is implemented. Test coverage MUST be maintained for all critical paths with performance tests validating the enhanced logging system's 14,000+ logs/sec capability.

### III. Production-Grade Observability

Enhanced logging system MUST be used throughout all application layers - NO console.log, console.error, console.warn, or console.debug permitted. Structured logging with metadata, correlation IDs, and performance monitoring is mandatory. Server-side uses Logger with dependency injection, client-side uses useLogger hook. All operations MUST include appropriate log levels (DEBUG, INFO, WARN, ERROR) with specialized methods for API requests, security events, and performance measurement. This system is designed for single-instance deployments only.

### IV. Security by Default

All admin functionality MUST be protected by authentication and authorization. Google OAuth with BetterAuth provides authentication, email-based ADMIN_EMAIL configuration provides authorization. Middleware MUST enforce access controls, server-side MUST validate admin privileges, and all security events MUST be logged. No sensitive data exposure in error messages, proper session management, and rate limiting are mandatory. Public and admin endpoints MUST be clearly separated with appropriate access controls.

### V. Clean Architecture Compliance

All development MUST maintain clean architecture principles with proper separation of concerns, dependency injection, and SOLID principles. Domain layer contains business logic, Application layer handles use cases, Infrastructure layer manages external dependencies, and Presentation layer contains UI components. Cross-layer dependencies MUST flow inward only, interfaces MUST be properly segregated, and code MUST remain testable and maintainable. This ensures long-term sustainability and prevents technical debt accumulation.

## Development Standards

### Technology Stack Requirements

- **Frontend**: Next.js 15 with App Router, TypeScript strict mode, Chakra UI v3 for components
- **Backend**: Next.js API routes with MongoDB for data persistence
- **Authentication**: BetterAuth with Google OAuth provider
- **Testing**: Jest for unit tests, Playwright for e2e tests with collection-based cleanup
- **Architecture**: DDD with Hexagonal patterns, dependency injection with Tsyringe
- **Logging**: Enhanced async logging system with structured JSON output and file rotation

### Code Quality Standards

- TypeScript strict mode compliance with explicit return types and no 'any' usage
- SOLID principles adherence with proper interface segregation and dependency inversion
- Clean code practices with meaningful names, small functions, and single responsibility
- Comprehensive error handling with proper logging and graceful degradation
- Consistent formatting with Prettier and linting with ESLint

## Quality Gates

### Development Workflow Requirements

All development MUST follow established workflow: feature branch creation, comprehensive testing, linting/formatting validation, and successful build before merge. Pre-commit hooks enforce code quality, pre-push hooks validate test coverage and build success. MongoDB MUST be running for e2e tests, application MUST be built before test execution. All tests MUST pass in CI/CD pipeline with performance benchmarks meeting or exceeding established baselines.

### Review and Compliance Requirements

Every pull request MUST verify constitution compliance: architecture adherence, test coverage, logging implementation, security controls, and clean architecture principles. Code reviews MUST validate layer separation, dependency direction, and proper use of dependency injection. Security reviews MUST ensure authentication/authorization implementation and absence of sensitive data exposure. Architecture reviews MUST validate SOLID principles and proper separation of concerns.

## Governance

This constitution supersedes all other development practices and guidelines. Amendments require documentation update, team approval, and migration plan for existing code. All development MUST reference this constitution for architectural decisions, testing requirements, security implementation, and clean architecture standards. Complex deviations from constitution MUST be justified with technical rationale and approved by team consensus. Use AGENTS.md for runtime development guidance and specific implementation patterns.

**Version**: 1.1.0 | **Ratified**: 2025-01-17 | **Last Amended**: 2025-01-17
