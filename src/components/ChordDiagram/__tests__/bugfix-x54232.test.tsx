/**
 * @fileoverview Bug fix tests for chord "x54232"
 * @author svguitar-react
 *
 * This test validates the fix for the bug where "x54232" was rendering
 * frets 3-7 instead of 2-6, and the auto barre was not being detected.
 */

import { describe, it, expect } from "vitest";
import { parseFretNotation } from "../utils";
import { detectAutoBarre } from "../utils/autoBarre";
import { calculateAutoFirstFret } from "../utils/autoFirstFret";

describe("Bug Fix: x54232 Chord", () => {
	describe("Parse Fret Notation", () => {
		it("should parse x54232 correctly", () => {
			const result = parseFretNotation("x54232");

			expect(result.fingers).toEqual([
				{ fret: 0, string: 1, is_muted: true }, // x
				{ fret: 5, string: 2, is_muted: false }, // 5
				{ fret: 4, string: 3, is_muted: false }, // 4
				{ fret: 2, string: 4, is_muted: false }, // 2
				{ fret: 3, string: 5, is_muted: false }, // 3
				{ fret: 2, string: 6, is_muted: false }, // 2
			]);

			expect(result.barres).toEqual([]);
		});
	});

	describe("Auto Barre Detection", () => {
		it("should detect barre on fret 2 for x54232", () => {
			const fingers = [
				{ fret: 0, string: 1, is_muted: true }, // x - ignored
				{ fret: 5, string: 2, is_muted: false }, // 5 - pressed
				{ fret: 4, string: 3, is_muted: false }, // 4 - pressed
				{ fret: 2, string: 4, is_muted: false }, // 2 - pressed
				{ fret: 3, string: 5, is_muted: false }, // 3 - pressed
				{ fret: 2, string: 6, is_muted: false }, // 2 - pressed
			];

			const barre = detectAutoBarre(fingers);

			// Should detect barre because:
			// - 5 pressed fingers (> 4 threshold)
			// - Fret 2 has 2 fingers (strings 4 and 6) - maximum count
			expect(barre).not.toBeNull();
			expect(barre?.fret).toBe(2);
			expect(barre?.fromString).toBe(4);
			expect(barre?.toString).toBe(6);
		});
	});

	describe("Auto First Fret Calculation", () => {
		it("should calculate firstFret based on fretCount (simplified rule)", () => {
			const fingers = [
				{ fret: 0, string: 1, is_muted: true }, // x - ignored
				{ fret: 5, string: 2, is_muted: false }, // 5
				{ fret: 4, string: 3, is_muted: false }, // 4
				{ fret: 2, string: 4, is_muted: false }, // 2 - minimum
				{ fret: 3, string: 5, is_muted: false }, // 3
				{ fret: 2, string: 6, is_muted: false }, // 2 - minimum
			];

			// With fretCount=4: maxFret (5) > fretCount (4) → adjust to minFret=2
			const result4 = calculateAutoFirstFret(fingers, 4);
			expect(result4.firstFret).toBe(2);
			expect(result4.fretCount).toBe(4);
			expect(result4.wasAdjusted).toBe(false);

			// With fretCount=5: maxFret (5) <= fretCount (5) → keep firstFret=1
			const result5 = calculateAutoFirstFret(fingers, 5);
			expect(result5.firstFret).toBe(1);
			expect(result5.fretCount).toBe(5);
			expect(result5.wasAdjusted).toBe(false);
		});

		it("should display frets 1-5 with fretCount=5 (simplified rule)", () => {
			const fingers = [
				{ fret: 0, string: 1, is_muted: true },
				{ fret: 5, string: 2, is_muted: false },
				{ fret: 4, string: 3, is_muted: false },
				{ fret: 2, string: 4, is_muted: false },
				{ fret: 3, string: 5, is_muted: false },
				{ fret: 2, string: 6, is_muted: false },
			];

			const result = calculateAutoFirstFret(fingers, 5);

			// Simplified rule: maxFret (5) <= fretCount (5) → firstFret=1
			expect(result.firstFret).toBe(1);
			expect(result.fretCount).toBe(5);

			// Should display frets 1-5
			const displayedFrets = Array.from({ length: result.fretCount }, (_, i) => result.firstFret + i);
			expect(displayedFrets).toEqual([1, 2, 3, 4, 5]);

			// Verify all pressed fingers are visible
			const pressedFingers = fingers.filter(f => f.fret > 0);
			const maxFret = Math.max(...pressedFingers.map(f => f.fret));
			const lastDisplayedFret = result.firstFret + result.fretCount - 1;

			expect(maxFret).toBeLessThanOrEqual(lastDisplayedFret);
		});
	});

	describe("Integration: Full Chord Rendering", () => {
		it("should correctly process x54232 with auto features enabled", () => {
			// Parse the notation
			const chord = parseFretNotation("x54232");

			// Detect auto barre
			const barre = detectAutoBarre(chord.fingers);

			// Calculate auto first fret with fretCount=5
			const autoFret5 = calculateAutoFirstFret(chord.fingers, 5);

			// Assertions
			expect(chord.fingers.length).toBe(6); // Total fingers (including muted)
			expect(chord.fingers.filter(f => f.fret > 0).length).toBe(5); // Pressed fingers

			expect(barre).not.toBeNull();
			expect(barre?.fret).toBe(2);

			// Simplified rule: maxFret (5) <= fretCount (5) → firstFret=1
			expect(autoFret5.firstFret).toBe(1);
			expect(autoFret5.fretCount).toBe(5);

			// Expected fret numbers displayed: 1, 2, 3, 4, 5
			const displayedFrets = Array.from(
				{ length: autoFret5.fretCount },
				(_, i) => autoFret5.firstFret + i
			);
			expect(displayedFrets).toEqual([1, 2, 3, 4, 5]);
		});

		it("should adjust when fretCount is too small", () => {
			const chord = parseFretNotation("x54232");

			// With fretCount=4: maxFret (5) > fretCount (4) → adjust to minFret=2
			const autoFret4 = calculateAutoFirstFret(chord.fingers, 4);

			expect(autoFret4.firstFret).toBe(2);
			expect(autoFret4.fretCount).toBe(4);

			// Expected fret numbers: 2, 3, 4, 5
			const displayedFrets = Array.from(
				{ length: autoFret4.fretCount },
				(_, i) => autoFret4.firstFret + i
			);
			expect(displayedFrets).toEqual([2, 3, 4, 5]);
		});
	});
});
