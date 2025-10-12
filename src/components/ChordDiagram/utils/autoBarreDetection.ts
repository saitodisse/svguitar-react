/**
 * @fileoverview Auto barre detection algorithm
 * Automatically detects where to place a barre (bar chord) when there are more than 4 fingers pressed
 * @author svguitar-react
 * @version 1.0.0
 */

import type { Finger, Barre } from "../types";

/**
 * Detects if an automatic barre should be added to a chord
 *
 * Algorithm:
 * 1. Filter valid fingers (fret > 0, not muted)
 * 2. Check if there are more than 4 fingers
 * 3. Group fingers by fret and count
 * 4. Select fret with most fingers (tie-breaker: lowest fret number)
 * 5. Calculate fromString and toString for the barre
 *
 * @param fingers - Array of finger positions
 * @returns Barre object if auto barre should be added, null otherwise
 *
 * @example
 * ```typescript
 * const fingers = [
 *   { fret: 3, string: 6, is_muted: false },
 *   { fret: 3, string: 5, is_muted: false },
 *   { fret: 3, string: 4, is_muted: false },
 *   { fret: 4, string: 3, is_muted: false },
 *   { fret: 5, string: 2, is_muted: false },
 * ];
 *
 * const autoBarre = detectAutoBarre(fingers);
 * // Returns: { fret: 3, fromString: 4, toString: 6 }
 * ```
 */
export function detectAutoBarre(fingers: Finger[]): Barre | null {
	// 1. Filter valid fingers (fret > 0, not muted)
	const validFingers = fingers.filter(f => f.fret > 0 && !f.is_muted);

	// 2. Check if there are more than 4 fingers
	if (validFingers.length <= 4) return null;

	// 3. Group by fret and count
	const fretCounts = new Map<number, Finger[]>();
	validFingers.forEach(f => {
		if (!fretCounts.has(f.fret)) fretCounts.set(f.fret, []);
		fretCounts.get(f.fret)!.push(f);
	});

	// 4. Find fret with most fingers (tie-breaker: lowest fret number)
	let maxCount = 0;
	let selectedFret = -1;
	let selectedFingers: Finger[] = [];

	fretCounts.forEach((fingers, fret) => {
		if (fingers.length > maxCount || (fingers.length === maxCount && fret < selectedFret)) {
			maxCount = fingers.length;
			selectedFret = fret;
			selectedFingers = fingers;
		}
	});

	// 5. Calculate fromString and toString
	const strings = selectedFingers.map(f => f.string).sort((a, b) => a - b);

	return {
		fret: selectedFret,
		fromString: strings[0],
		toString: strings[strings.length - 1],
	};
}
