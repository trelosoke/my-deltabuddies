# Use deep merge in fixture instead of a shallow spread

## Context and Problem Statement

The `makeValidConfig()` function receives an override object value for the base configuration. Therefore, it must not use a shallow merge, as the config has various nested property objects. The need appeared in the `feat/config-tests` branch and the fixture needs to allow partial override values to merge without deleting the non-conflicting properties. If this is not decided, shallow spread destroys nested fields and the test fails for the wrong reasons.

## Considered Options

* Spread operator at top level.
* Helpers for each nested object field.
* Deep merge.

## Decision Outcome

Chosen option: "Deep merge", because it recurses into nested
objects and only overrides the conflicting keys.

Spread operator was rejected because it doesn't enter nested levels,
so a partial override destroys non-conflicting fields.

Helpers per field were rejected because each new field requires a
new helper that hardcodes the config path, coupling the fixture to
the schema.

## Consequences

* Good, because the tests will only pass a path to the changed value, with no need to rewrite the entire config.
* Bad, because deep merge is custom code that must be maintained.