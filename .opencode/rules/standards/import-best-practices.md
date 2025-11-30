Sub rule 1: Use Static Imports by Default

- Import all core modules, utilities, and domain entities using static imports
- Use static imports for dependencies needed immediately when the module loads
- Prefer static imports for application logic, domain objects, and frequently used utilities
- Static imports should be the default choice unless there's a specific reason for dynamic import

Sub rule 2: When to Use Dynamic Imports

- for code splitting large libraries or components
- for conditional loading based on runtime conditions
- for optional dependencies that may not be available
- to resolve circular dependency issues
- for non-critical features that can load asynchronously

Sub rule 3: Static Import Patterns

- Use `import type` for type-only imports to improve tree-shaking
- Example: `import { SocialNetwork } from '@/domain/settings/entities/SocialNetwork'`

Sub rule 4: Dynamic Import Patterns

- Document why a dynamic import is necessary when used
- Use `await import()` syntax for dynamic imports within functions
- Example: `const { HeavyComponent } = await import('./HeavyComponent')`
