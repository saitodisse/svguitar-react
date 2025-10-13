/**
 * @fileoverview Bug fix tests for chords with open strings (005500, 006600)
 * @author svguitar-react
 *
 * This test validates the fix for the bug where autoFirstFret was adjusting
 * even when fingers fit in the default range, losing open string visualization.
 */

import { describe, it, expect } from "vitest";
import { parseFretNotation } from "../utils";
import { calculateAutoFirstFret } from "../utils/autoFirstFret";

describe("Bug Fix: Open Strings with AutoFirstFret", () => {
	describe("Chord '005500' - Fingers fit in range", () => {
		it("should parse 005500 correctly", () => {
			const result = parseFretNotation("005500");

			expect(result.fingers).toEqual([
				{ fret: 0, string: 1, is_muted: false }, // open
				{ fret: 0, string: 2, is_muted: false }, // open
				{ fret: 5, string: 3, is_muted: false }, // pressed
				{ fret: 5, string: 4, is_muted: false }, // pressed
				{ fret: 0, string: 5, is_muted: false }, // open
				{ fret: 0, string: 6, is_muted: false }, // open
			]);
		});

		it("should keep firstFret=1 when maxFret <= fretCount (with fretCount=5)", () => {
			const fingers = [
				{ fret: 0, string: 1, is_muted: false },
				{ fret: 0, string: 2, is_muted: false },
				{ fret: 5, string: 3, is_muted: false },
				{ fret: 5, string: 4, is_muted: false },
				{ fret: 0, string: 5, is_muted: false },
				{ fret: 0, string: 6, is_muted: false },
			];

			const result = calculateAutoFirstFret(fingers, 5);

			// maxFret=5 <= fretCount=5 → keep firstFret=1
			expect(result.firstFret).toBe(1);
			expect(result.fretCount).toBe(5);
			expect(result.wasAdjusted).toBe(false);

			// Should display frets 1-5
			const displayedFrets = Array.from({ length: result.fretCount }, (_, i) => result.firstFret + i);
			expect(displayedFrets).toEqual([1, 2, 3, 4, 5]);
		});

		it("should keep firstFret=1 when maxFret <= fretCount (with fretCount=6)", () => {
			const fingers = [
				{ fret: 0, string: 1, is_muted: false },
				{ fret: 0, string: 2, is_muted: false },
				{ fret: 5, string: 3, is_muted: false },
				{ fret: 5, string: 4, is_muted: false },
				{ fret: 0, string: 5, is_muted: false },
				{ fret: 0, string: 6, is_muted: false },
			];

			const result = calculateAutoFirstFret(fingers, 6);

			// maxFret=5 <= fretCount=6 → keep firstFret=1
			expect(result.firstFret).toBe(1);
			expect(result.fretCount).toBe(6);
			expect(result.wasAdjusted).toBe(false);
		});

		it("should adjust firstFret when maxFret > fretCount (with fretCount=4)", () => {
			const fingers = [
				{ fret: 0, string: 1, is_muted: false },
				{ fret: 0, string: 2, is_muted: false },
				{ fret: 5, string: 3, is_muted: false },
				{ fret: 5, string: 4, is_muted: false },
				{ fret: 0, string: 5, is_muted: false },
				{ fret: 0, string: 6, is_muted: false },
			];

			const result = calculateAutoFirstFret(fingers, 4);

			// maxFret=5 > fretCount=4 → adjust to firstFret=5
			expect(result.firstFret).toBe(5);
			expect(result.fretCount).toBe(4);
			expect(result.wasAdjusted).toBe(false);

			// Should display frets 5-8
			const displayedFrets = Array.from({ length: result.fretCount }, (_, i) => result.firstFret + i);
			expect(displayedFrets).toEqual([5, 6, 7, 8]);
		});
	});

	describe("Chord '006600' - Fingers don't fit in default range", () => {
		it("should parse 006600 correctly", () => {
			const result = parseFretNotation("006600");

			expect(result.fingers).toEqual([
				{ fret: 0, string: 1, is_muted: false }, // open
				{ fret: 0, string: 2, is_muted: false }, // open
				{ fret: 6, string: 3, is_muted: false }, // pressed
				{ fret: 6, string: 4, is_muted: false }, // pressed
				{ fret: 0, string: 5, is_muted: false }, // open
				{ fret: 0, string: 6, is_muted: false }, // open
			]);
		});

		it("should adjust firstFret when maxFret > fretCount (with fretCount=4)", () => {
			const fingers = [
				{ fret: 0, string: 1, is_muted: false },
				{ fret: 0, string: 2, is_muted: false },
				{ fret: 6, string: 3, is_muted: false },
				{ fret: 6, string: 4, is_muted: false },
				{ fret: 0, string: 5, is_muted: false },
				{ fret: 0, string: 6, is_muted: false },
			];

			const result = calculateAutoFirstFret(fingers, 4);

			// maxFret=6 > fretCount=4 → adjust to firstFret=6
			expect(result.firstFret).toBe(6);
			expect(result.fretCount).toBe(4);
			expect(result.wasAdjusted).toBe(false);

			// Should display frets 6-9
			const displayedFrets = Array.from({ length: result.fretCount }, (_, i) => result.firstFret + i);
			expect(displayedFrets).toEqual([6, 7, 8, 9]);
		});

		it("should adjust firstFret when maxFret > fretCount (with fretCount=5)", () => {
			const fingers = [
				{ fret: 0, string: 1, is_muted: false },
				{ fret: 0, string: 2, is_muted: false },
				{ fret: 6, string: 3, is_muted: false },
				{ fret: 6, string: 4, is_muted: false },
				{ fret: 0, string: 5, is_muted: false },
				{ fret: 0, string: 6, is_muted: false },
			];

			const result = calculateAutoFirstFret(fingers, 5);

			// maxFret=6 > fretCount=5 → adjust to firstFret=6
			expect(result.firstFret).toBe(6);
			expect(result.fretCount).toBe(5);
			expect(result.wasAdjusted).toBe(false);

			// Should display frets 6-10
			const displayedFrets = Array.from({ length: result.fretCount }, (_, i) => result.firstFret + i);
			expect(displayedFrets).toEqual([6, 7, 8, 9, 10]);
		});

		it("should keep firstFret=1 when maxFret <= fretCount (with fretCount=6)", () => {
			const fingers = [
				{ fret: 0, string: 1, is_muted: false },
				{ fret: 0, string: 2, is_muted: false },
				{ fret: 6, string: 3, is_muted: false },
				{ fret: 6, string: 4, is_muted: false },
				{ fret: 0, string: 5, is_muted: false },
				{ fret: 0, string: 6, is_muted: false },
			];

			const result = calculateAutoFirstFret(fingers, 6);

			// maxFret=6 <= fretCount=6 → keep firstFret=1
			expect(result.firstFret).toBe(1);
			expect(result.fretCount).toBe(6);
			expect(result.wasAdjusted).toBe(false);

			// Should display frets 1-6
			const displayedFrets = Array.from({ length: result.fretCount }, (_, i) => result.firstFret + i);
			expect(displayedFrets).toEqual([1, 2, 3, 4, 5, 6]);
		});
	});

	describe("Hybrid Rule: Only adjust when maxFret > fretCount", () => {
		it("should maintain open string visibility when possible", () => {
			const testCases = [
				// [chord, fretCount, expectedFirstFret, expectedFrets]
				["005500", 5, 1, [1, 2, 3, 4, 5]], // fits → keep firstFret=1
				["005500", 4, 5, [5, 6, 7, 8]], // doesn't fit → adjust
				["006600", 4, 6, [6, 7, 8, 9]], // doesn't fit → adjust
				["006600", 5, 6, [6, 7, 8, 9, 10]], // doesn't fit → adjust
				["006600", 6, 1, [1, 2, 3, 4, 5, 6]], // fits → keep firstFret=1
				["003300", 4, 1, [1, 2, 3, 4]], // fits → keep firstFret=1
				["00(12)(12)00", 12, 1, Array.from({ length: 12 }, (_, i) => i + 1)], // fits
				["00(12)(12)00", 11, 12, Array.from({ length: 11 }, (_, i) => i + 12)], // doesn't fit
			];

			testCases.forEach(([chord, fretCount, expectedFirstFret, expectedFrets]) => {
				const parsed = parseFretNotation(chord);
				const result = calculateAutoFirstFret(parsed.fingers, fretCount);

				expect(result.firstFret).toBe(expectedFirstFret);

				const displayedFrets = Array.from(
					{ length: result.fretCount },
					(_, i) => result.firstFret + i
				);
				expect(displayedFrets).toEqual(expectedFrets);
			});
		});
	});
});
