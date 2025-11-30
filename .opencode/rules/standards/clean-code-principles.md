Sub rule 1: Meaningful Names
- Use descriptive and pronounceable names for variables, functions, and classes
- Use verbs for function names (e.g., `getUserData`, `calculateTotal`)
- Use nouns for class names (e.g., `UserService`, `DatabaseConnection`)
- Name interfaces descriptively with `I` prefix: `IUserService`, `IRepository`

Sub rule 2: Small and Focused Functions
- Keep functions under 20 lines when possible
- Functions should do one thing and do it well
- Avoid functions with more than 3 parameters; use objects for multiple parameters
- Use pure functions when possible (no side effects)
- Return early from functions to reduce nesting

Sub rule 3: Code Organization and Structure
- Group related code together
- Keep files focused on a single responsibility

Sub rule 4: Error Handling
- Handle errors at the appropriate level
- Use specific error types with descriptive messages
- Avoid catching exceptions without proper handling

Sub rule 5: Logging Practices
- Server-side: `Logger` class with dependency injection
- Client-side: `useLogger` hook with direct console output

Sub rule 6: TypeScript Specific Clean Code
- Use interfaces over types for object shapes that can be extended
- Prefer explicit return types over inferred types
- Use utility types (`Pick`, `Omit`, `Partial`) effectively
- Avoid using `any`; use `unknown` for truly unknown data
- Use generics for reusable and type-safe code

Sub rule 7: Next.js Specific Clean Code
- Keep pages/route handlers thin and focused
- Move business logic to service layers
- Use server components by default, client components only when necessary
- Separate data fetching from presentation logic
- Use proper error boundaries for React components

Sub rule 8: Comments and Documentation
- Write self-documenting code that needs no or minimal comments
- Use comments only to explain why, not what
- Update comments when code changes
- Avoid commented-out code; remove it instead

Sub rule 9: Code Duplication (DRY)
- Extract common logic into reusable functions
- Use composition over inheritance
- Create utility functions for repeated operations
- Avoid copy-pasting code; refactor instead
- Use constants for repeated values

Sub rule 10: YAGNI (You Aren't Gonna Need It)
- Implement only strict minimum required for current feature requirements
- No functionality based on speculative future needs or potential use cases
- Focus on delivering value now rather than anticipating future requirements
- Prevent over-engineering and unnecessary abstractions
- Maintain code simplicity by avoiding features that may never be used

Sub rule 11: KISS (Keep It Simple, Stupid)
- Write simple, readable, and clear code with straightforward implementations
- Avoid complex solutions in favor of simpler approaches that meet requirements
- Ensure code structure is immediately understandable by other developers
- Minimize cognitive load and reduce likelihood of introducing bugs
- Prioritize simplicity over unnecessary complexity

Sub rule 12: Testing and Clean Code
- Write tests that are easy to understand
- Use descriptive test names that explain the behavior
- Keep tests simple and focused
- Test behavior, not implementation details
- Use fixtures and helpers to reduce test duplication
