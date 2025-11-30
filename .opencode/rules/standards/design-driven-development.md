Sub rule 1: Design Implementation Guidelines

- Implement domain-driven design in the `src/domain` layer for entities, value-objects, and services.
- Implement use cases derived from designs in the `src/application` layer to encapsulate business logic.
- Translate designs into React components in the `src/presentation` layer.
- Place reusable components under `src/presentation/shared/components`.
- Add infrastructure-specific implementations in the `src/infrastructure` layer to isolate external dependencies from core logic.
- Maintain consistent naming conventions from design specs to code (classes, interfaces, and components).
  reflect feedback without breaking core `src/domain` or `src/application` logic.
