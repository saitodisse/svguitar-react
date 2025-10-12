/**
 * @fileoverview Automatic barre detection utilities
 * @author svguitar-react
 *
 * This module implements intelligent barre detection for guitar chord diagrams.
 * When there are more than 4 pressed fingers, it automatically suggests where
 * a barre should be placed based on finger distribution across frets.
 */

import type { Barre, Finger, ChordDiagramProps } from "../types";

/**
 * Detects automatically if a barre should be added based on pressed fingers.
 *
 * Algorithm:
 * 1. Filter pressed fingers (fret > 0, not muted)
 * 2. Check threshold: must have > 4 pressed fingers
 * 3. Group fingers by fret
 * 4. Find fret with most fingers (tie-breaker: lowest fret number)
 * 5. Determine fromString/toString (first/last string with finger on that fret)
 *
 * @param fingers - Array of finger positions
 * @returns Detected barre or null if not applicable
 *
 * @example
 * ```typescript
 * // 5 fingers on fret 3 -> auto barre on fret 3
 * const fingers = [
 *   { fret: 3, string: 1, is_muted: false },
 *   { fret: 3, string: 2, is_muted: false },
 *   { fret: 3, string: 3, is_muted: false },
 *   { fret: 3, string: 4, is_muted: false },
 *   { fret: 3, string: 5, is_muted: false },
 * ];
 * const barre = detectAutoBarre(fingers);
 * // { fret: 3, fromString: 1, toString: 5 }
 * ```
 */
export function detectAutoBarre(fingers: Finger[]): Barre | null {
	// 1. Filter only pressed fingers (fret > 0, not muted)
	const pressedFingers = fingers.filter(f => f.fret > 0 && !f.is_muted);

	// 2. Check threshold (more than 4 fingers)
	if (pressedFingers.length <= 4) {
		return null;
	}

	// 3. Group fingers by fret
	const fingersByFret = new Map<number, Finger[]>();
	pressedFingers.forEach(finger => {
		if (!fingersByFret.has(finger.fret)) {
			fingersByFret.set(finger.fret, []);
		}
		fingersByFret.get(finger.fret)!.push(finger);
	});

	// 4. Find fret with most fingers (tie-breaker: lowest fret)
	let maxFret = 0;
	let maxCount = 0;

	// Convert to array and sort by fret number to ensure consistent tie-breaking
	const sortedFrets = Array.from(fingersByFret.entries()).sort((a, b) => a[0] - b[0]);

	for (const [fret, fingersAtFret] of sortedFrets) {
		if (fingersAtFret.length > maxCount) {
			maxFret = fret;
			maxCount = fingersAtFret.length;
		}
	}

	// No fret found (shouldn't happen if pressedFingers > 4, but defensive)
	if (maxFret === 0) {
		return null;
	}

	// 5. Determine fromString/toString (first and last string with finger on that fret)
	const fingersAtFret = fingersByFret.get(maxFret)!;
	const strings = fingersAtFret.map(f => f.string).sort((a, b) => a - b);
	const fromString = strings[0];
	const toString = strings[strings.length - 1];

	return {
		fret: maxFret,
		fromString,
		toString,
	};
}

/**
 * Removes fingers that are covered by a barre to avoid visual redundancy.
 *
 * A finger is considered "covered" if:
 * - It's on the same fret as the barre
 * - AND its string is between fromString and toString (inclusive)
 *
 * @param fingers - Original array of fingers
 * @param barre - Barre that covers some fingers
 * @returns Array of fingers not covered by the barre
 *
 * @example
 * ```typescript
 * const fingers = [
 *   { fret: 3, string: 1, is_muted: false },
 *   { fret: 3, string: 2, is_muted: false },
 *   { fret: 5, string: 6, is_muted: false },
 * ];
 * const barre = { fret: 3, fromString: 1, toString: 5 };
 * const filtered = removeFingersCoveredByBarre(fingers, barre);
 * // Only finger on fret 5 remains: [{ fret: 5, string: 6, is_muted: false }]
 * ```
 */
export function removeFingersCoveredByBarre(fingers: Finger[], barre: Barre): Finger[] {
	return fingers.filter(
		finger =>
			!(
				finger.fret === barre.fret &&
				finger.string >= barre.fromString &&
				finger.string <= barre.toString
			)
	);
}

/**
 * Determines if auto barre should be applied based on component props.
 *
 * Auto barre is applied when:
 * - autoBarreEnabled is not explicitly false (default: true)
 * - AND there are no manual barres defined
 *
 * Manual barres always take precedence over automatic detection.
 *
 * @param props - ChordDiagram component props
 * @returns true if auto barre should be applied
 *
 * @example
 * ```typescript
 * // Auto barre enabled (default)
 * shouldApplyAutoBarre({ chord: { fingers: [], barres: [] } }); // true
 *
 * // Auto barre disabled
 * shouldApplyAutoBarre({
 *   autoBarreEnabled: false,
 *   chord: { fingers: [], barres: [] }
 * }); // false
 *
 * // Manual barre present (auto barre disabled regardless of flag)
 * shouldApplyAutoBarre({
 *   autoBarreEnabled: true,
 *   chord: { fingers: [], barres: [{ fret: 1, fromString: 1, toString: 6 }] }
 * }); // false
 * ```
 */
export function shouldApplyAutoBarre(props: ChordDiagramProps): boolean {
	// Check if auto barre is explicitly disabled
	if (props.autoBarreEnabled === false) {
		return false;
	}

	// Check if there are manual barres (manual barres have precedence)
	const hasManualBarres = props.chord && props.chord.barres && props.chord.barres.length > 0;
	if (hasManualBarres) {
		return false;
	}

	// Auto barre can be applied
	return true;
}
