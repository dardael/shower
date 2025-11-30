Sub rule 1: Type Safety

- Never use `any` type; use `unknown` for truly unknown data
- Always provide explicit return types for functions
- Use strict null checks; handle `null` and `undefined` explicitly
- Prefer `const` assertions for readonly data structures

Sub rule 2: Interface and Type Definitions

- Use `interface` for object shapes that can be extended
- Use `type` for unions, intersections, and utility types
- Define all props interfaces for React components
- Use generic types with proper constraints

Sub rule 3: Function Typing

- Type all function parameters explicitly
- Use arrow functions with explicit return types
- Avoid function overloads; use union types instead
- Use proper typing for async functions (Promise<T>)

Sub rule 4: Object and Array Typing

- Type array elements explicitly (e.g., `string[]` not `Array`)

Sub rule 5: Error Handling

- Type error objects in catch blocks
- Create custom error classes with proper typing
- Use Result/Either patterns for error handling
- Never suppress TypeScript or eslint errors with `@ts-ignore` or `@ts-expect-error`
