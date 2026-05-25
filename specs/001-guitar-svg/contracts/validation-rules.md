# Validation Rules: ChordDiagram Component

This document defines validation behavior for `ChordDiagram` inputs.

## Input Requirement

At least one of these inputs should be provided:

- `voicing`
- `chord`
- `instrument`

If no input exists, the component may render an empty fretboard or apply the configured fallback behavior.

## Input Precedence

```ts
voicing > chord > instrument;
```

`voicing` is preferred because it uses the shared `achorde-musical-domain` contract.

## Validation Policy

```ts
type InvalidBehavior = "keep-previous" | "render-fallback" | "suppress";
```

- `strict`: invalid values trigger error handling.
- `lenient`: invalid values may be normalized when safe.
- `keep-previous`: preserve the last valid rendered chord.
- `render-fallback`: render `fallbackChord`.
- `suppress`: render the fretboard without chord marks.

## Finger Rules

- `string` must be between `1` and `stringCount`.
- `fret` must be `0` or greater.
- `fret: 0` represents an open string.
- Muted strings should not also render fretted dots.

## Barre Rules

- `fromString` and `toString` must be within the string range.
- `fret` must be greater than `0`.
- Barres render across the inclusive string range.
- Manual barres disable automatic barre detection.

## Instrument Rules

- `strings` must be positive.
- `tuning.length` should match `strings`.
- Fret notation may contain `x`, `0`, digits, and parenthesized multi-digit frets.

## Style Rules

- Dimensions should be finite positive numbers unless a specific offset prop allows negative values.
- Opacity values should be between `0` and `1`.
- Colors should be valid CSS color strings.

## Error Reporting

Consumers can use:

- `onError` for telemetry, toasts, or external UI.
- `errorFallback` for inline fallback rendering.
