/**
 * @fileoverview Utility functions for automatic firstFret calculation
 * @author svguitar-react
 * @version 1.0.0
 */

import type { Finger, ChordDiagramProps } from "../types";

/**
 * Maximum allowed fret count (doesn't make sense to show frets beyond 12th fret for most guitars)
 */
const MAX_FRET_COUNT = 12;

/**
 * Filters fingers to get only pressed ones (fret > 0)
 * @param fingers - Array of finger positions
 * @returns Array of pressed fingers (excluding open strings and muted strings)
 * @example
 * ```typescript
 * const fingers = [
 *   { fret: 0, string: 1, is_muted: false },
 *   { fret: 5, string: 2, is_muted: false },
 *   { fret: 7, string: 3, is_muted: false }
 * ];
 * const pressed = getPressedFingers(fingers);
 * // Returns: [{ fret: 5, string: 2, is_muted: false }, { fret: 7, string: 3, is_muted: false }]
 * ```
 */
export function getPressedFingers(fingers: Finger[]): Finger[] {
	return fingers.filter(finger => finger.fret > 0);
}

/**
 * Checks if autoFirstFret should be activated based on finger positions
 * @param fingers - Array of finger positions
 * @param currentFretCount - Current fretCount from props
 * @returns true if any pressed finger is outside the range 1-fretCount
 * @example
 * ```typescript
 * const fingers = [
 *   { fret: 0, string: 1, is_muted: false },
 *   { fret: 5, string: 2, is_muted: false }
 * ];
 * shouldActivateAutoFirstFret(fingers, 4); // true (fret 5 is outside 1-4)
 * shouldActivateAutoFirstFret(fingers, 6); // false (fret 5 is within 1-6)
 * ```
 */
export function shouldActivateAutoFirstFret(fingers: Finger[], currentFretCount: number): boolean {
	const pressedFingers = getPressedFingers(fingers);

	// No pressed fingers, no need to activate
	if (pressedFingers.length === 0) {
		return false;
	}

	// Check if any finger is outside the range 1-fretCount
	return pressedFingers.some(finger => finger.fret > currentFretCount);
}

/**
 * Calculates automatic firstFret and fretCount based on finger positions
 * @param fingers - Array of finger positions
 * @param currentFretCount - Current fretCount from props
 * @returns Object containing calculated firstFret, fretCount, and whether adjustment was made
 * @example
 * ```typescript
 * // Example 1: Fingers fit within fretCount
 * const fingers1 = [
 *   { fret: 5, string: 1, is_muted: false },
 *   { fret: 7, string: 2, is_muted: false },
 *   { fret: 8, string: 3, is_muted: false }
 * ];
 * calculateAutoFirstFret(fingers1, 4);
 * // Returns: { firstFret: 5, fretCount: 4, wasAdjusted: false }
 *
 * // Example 2: Fingers require fretCount adjustment
 * const fingers2 = [
 *   { fret: 5, string: 1, is_muted: false },
 *   { fret: 10, string: 2, is_muted: false }
 * ];
 * calculateAutoFirstFret(fingers2, 4);
 * // Returns: { firstFret: 5, fretCount: 6, wasAdjusted: true }
 *
 * // Example 3: No pressed fingers (edge case)
 * const fingers3 = [
 *   { fret: 0, string: 1, is_muted: false },
 *   { fret: 0, string: 2, is_muted: false }
 * ];
 * calculateAutoFirstFret(fingers3, 4);
 * // Returns: { firstFret: 1, fretCount: 4, wasAdjusted: false }
 * ```
 */
export function calculateAutoFirstFret(
	fingers: Finger[],
	currentFretCount: number
): {
	firstFret: number;
	fretCount: number;
	wasAdjusted: boolean;
} {
	const pressedFingers = getPressedFingers(fingers);

	// Edge case: No pressed fingers, return defaults
	if (pressedFingers.length === 0) {
		return {
			firstFret: 1,
			fretCount: currentFretCount,
			wasAdjusted: false,
		};
	}

	// Calculate the range of pressed fingers
	const fretNumbers = pressedFingers.map(finger => finger.fret);
	const minFret = Math.min(...fretNumbers);
	const maxFret = Math.max(...fretNumbers);
	const rangeRequired = maxFret - minFret + 1;

	// Calculate the new firstFret (always the minimum fret position)
	const newFirstFret = minFret;

	// Calculate the new fretCount (if needed)
	let newFretCount = currentFretCount;
	let wasAdjusted = false;

	if (rangeRequired > currentFretCount) {
		// Need to increase fretCount to fit all fingers
		newFretCount = Math.min(rangeRequired, MAX_FRET_COUNT);
		wasAdjusted = true;
	}

	return {
		firstFret: newFirstFret,
		fretCount: newFretCount,
		wasAdjusted,
	};
}

/**
 * Checks if autoFirstFret feature should be applied based on component props
 * @param props - ChordDiagram component props
 * @param currentFirstFret - Current firstFret value from chord data
 * @returns true if autoFirstFret should be applied
 * @example
 * ```typescript
 * // autoFirstFret enabled and no manual firstFret
 * shouldApplyAutoFirstFret({ autoFirstFret: true }, undefined); // true
 *
 * // autoFirstFret enabled but manual firstFret provided
 * shouldApplyAutoFirstFret({ autoFirstFret: true, firstFret: 5 }, 5); // false
 *
 * // autoFirstFret disabled
 * shouldApplyAutoFirstFret({ autoFirstFret: false }, undefined); // false
 * ```
 */
export function shouldApplyAutoFirstFret(
	props: ChordDiagramProps,
	currentFirstFret: number | undefined
): boolean {
	// autoFirstFret must be explicitly enabled
	if (!props.autoFirstFret) {
		return false;
	}

	// If firstFret is manually provided in props, it takes precedence
	if (props.firstFret !== undefined) {
		return false;
	}

	// If firstFret was set in chord data, check if it's the default value
	// If currentFirstFret is undefined or 1 (default), we can apply autoFirstFret
	if (currentFirstFret !== undefined && currentFirstFret !== 1) {
		return false;
	}

	return true;
}
