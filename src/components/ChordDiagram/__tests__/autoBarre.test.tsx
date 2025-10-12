/**
 * @fileoverview Tests for automatic barre detection
 * @author svguitar-react
 *
 * These tests follow TDD approach - they should FAIL initially until implementation is complete.
 */

import { describe, it, expect } from "vitest";
import type { Finger, Barre, ChordDiagramProps } from "../types";
import { detectAutoBarre, removeFingersCoveredByBarre, shouldApplyAutoBarre } from "../utils/autoBarre";

describe("detectAutoBarre", () => {
	describe("Activation Conditions", () => {
		it("should NOT add barre when there are 4 or fewer pressed fingers", () => {
			const fingers: Finger[] = [
				{ fret: 1, string: 1, is_muted: false },
				{ fret: 1, string: 2, is_muted: false },
				{ fret: 2, string: 3, is_muted: false },
				{ fret: 3, string: 4, is_muted: false },
			];

			const result = detectAutoBarre(fingers);
			expect(result).toBeNull();
		});

		it("should add barre when there are more than 4 pressed fingers", () => {
			const fingers: Finger[] = [
				{ fret: 3, string: 1, is_muted: false },
				{ fret: 3, string: 2, is_muted: false },
				{ fret: 3, string: 3, is_muted: false },
				{ fret: 3, string: 4, is_muted: false },
				{ fret: 3, string: 5, is_muted: false },
			];

			const result = detectAutoBarre(fingers);
			expect(result).not.toBeNull();
			expect(result?.fret).toBe(3);
		});

		it("should ignore open strings (fret = 0) in count", () => {
			const fingers: Finger[] = [
				{ fret: 1, string: 1, is_muted: false },
				{ fret: 1, string: 2, is_muted: false },
				{ fret: 2, string: 3, is_muted: false },
				{ fret: 0, string: 4, is_muted: false }, // open string
				{ fret: 0, string: 5, is_muted: false }, // open string
			];

			const result = detectAutoBarre(fingers);
			expect(result).toBeNull(); // only 3 pressed fingers
		});

		it("should ignore muted strings (is_muted = true) in count", () => {
			const fingers: Finger[] = [
				{ fret: 1, string: 1, is_muted: false },
				{ fret: 1, string: 2, is_muted: false },
				{ fret: 2, string: 3, is_muted: false },
				{ fret: 0, string: 4, is_muted: true }, // muted
				{ fret: 0, string: 5, is_muted: true }, // muted
			];

			const result = detectAutoBarre(fingers);
			expect(result).toBeNull(); // only 3 pressed fingers
		});
	});

	describe("Fret Selection", () => {
		it("should choose fret with highest number of fingers", () => {
			const fingers: Finger[] = [
				{ fret: 3, string: 1, is_muted: false },
				{ fret: 3, string: 2, is_muted: false },
				{ fret: 3, string: 3, is_muted: false },
				{ fret: 3, string: 4, is_muted: false },
				{ fret: 5, string: 5, is_muted: false },
				{ fret: 5, string: 6, is_muted: false },
			];

			const result = detectAutoBarre(fingers);
			expect(result?.fret).toBe(3); // fret 3 has 4 fingers, fret 5 has 2
		});

		it("should choose lowest fret in case of tie", () => {
			const fingers: Finger[] = [
				{ fret: 3, string: 1, is_muted: false },
				{ fret: 3, string: 2, is_muted: false },
				{ fret: 3, string: 3, is_muted: false },
				{ fret: 5, string: 4, is_muted: false },
				{ fret: 5, string: 5, is_muted: false },
				{ fret: 5, string: 6, is_muted: false },
			];

			const result = detectAutoBarre(fingers);
			expect(result?.fret).toBe(3); // tie (3 fingers each), choose lower fret
		});

		it("should handle three-way tie by choosing lowest fret", () => {
			const fingers: Finger[] = [
				{ fret: 2, string: 1, is_muted: false },
				{ fret: 2, string: 2, is_muted: false },
				{ fret: 5, string: 3, is_muted: false },
				{ fret: 5, string: 4, is_muted: false },
				{ fret: 7, string: 5, is_muted: false },
				{ fret: 7, string: 6, is_muted: false },
			];

			const result = detectAutoBarre(fingers);
			expect(result?.fret).toBe(2); // all tied with 2 fingers, choose lowest
		});
	});

	describe("String Coverage", () => {
		it("should cover from first to last string with finger on that fret", () => {
			const fingers: Finger[] = [
				{ fret: 3, string: 2, is_muted: false },
				{ fret: 3, string: 4, is_muted: false },
				{ fret: 3, string: 5, is_muted: false },
				{ fret: 5, string: 1, is_muted: false },
				{ fret: 5, string: 3, is_muted: false },
				{ fret: 5, string: 6, is_muted: false },
			];

			const result = detectAutoBarre(fingers);
			expect(result).not.toBeNull();
			// fret 3 has 3 fingers (strings 2, 4, 5)
			// fret 5 has 3 fingers (strings 1, 3, 6)
			// tie -> choose fret 3 (lower)
			expect(result?.fret).toBe(3);
			expect(result?.fromString).toBe(2);
			expect(result?.toString).toBe(5);
		});

		it("should cover all strings including gaps", () => {
			const fingers: Finger[] = [
				{ fret: 3, string: 1, is_muted: false },
				{ fret: 3, string: 3, is_muted: false },
				{ fret: 3, string: 6, is_muted: false },
				{ fret: 5, string: 2, is_muted: false },
				{ fret: 5, string: 4, is_muted: false },
				{ fret: 5, string: 5, is_muted: false },
			];

			const result = detectAutoBarre(fingers);
			expect(result).not.toBeNull();
			// fret 3: 3 fingers (strings 1, 3, 6)
			// fret 5: 3 fingers (strings 2, 4, 5)
			// tie -> choose fret 3
			expect(result?.fret).toBe(3);
			expect(result?.fromString).toBe(1); // first string with finger
			expect(result?.toString).toBe(6); // last string with finger
		});
	});
});

describe("removeFingersCoveredByBarre", () => {
	it("should remove only fingers covered by barre", () => {
		const fingers: Finger[] = [
			{ fret: 3, string: 1, is_muted: false },
			{ fret: 3, string: 2, is_muted: false },
			{ fret: 3, string: 3, is_muted: false },
			{ fret: 5, string: 6, is_muted: false },
		];
		const barre: Barre = { fret: 3, fromString: 1, toString: 5 };

		const filtered = removeFingersCoveredByBarre(fingers, barre);

		// Should keep only the finger on fret 5
		expect(filtered).toHaveLength(1);
		expect(filtered[0]).toEqual({ fret: 5, string: 6, is_muted: false });
	});

	it("should keep fingers outside barre string range", () => {
		const fingers: Finger[] = [
			{ fret: 3, string: 1, is_muted: false },
			{ fret: 3, string: 2, is_muted: false },
			{ fret: 3, string: 5, is_muted: false },
			{ fret: 3, string: 6, is_muted: false },
		];
		const barre: Barre = { fret: 3, fromString: 2, toString: 5 };

		const filtered = removeFingersCoveredByBarre(fingers, barre);

		// Should keep fingers at strings 1 and 6 (outside barre range)
		expect(filtered).toHaveLength(2);
		expect(filtered).toContainEqual({ fret: 3, string: 1, is_muted: false });
		expect(filtered).toContainEqual({ fret: 3, string: 6, is_muted: false });
	});

	it("should keep fingers on different frets", () => {
		const fingers: Finger[] = [
			{ fret: 3, string: 1, is_muted: false },
			{ fret: 5, string: 1, is_muted: false },
			{ fret: 7, string: 3, is_muted: false },
		];
		const barre: Barre = { fret: 3, fromString: 1, toString: 6 };

		const filtered = removeFingersCoveredByBarre(fingers, barre);

		// Should keep fingers on frets 5 and 7
		expect(filtered).toHaveLength(2);
		expect(filtered).toContainEqual({ fret: 5, string: 1, is_muted: false });
		expect(filtered).toContainEqual({ fret: 7, string: 3, is_muted: false });
	});

	it("should return empty array if all fingers are covered", () => {
		const fingers: Finger[] = [
			{ fret: 1, string: 1, is_muted: false },
			{ fret: 1, string: 2, is_muted: false },
			{ fret: 1, string: 3, is_muted: false },
		];
		const barre: Barre = { fret: 1, fromString: 1, toString: 6 };

		const filtered = removeFingersCoveredByBarre(fingers, barre);

		expect(filtered).toHaveLength(0);
	});
});

describe("shouldApplyAutoBarre", () => {
	it("should return true when autoBarreEnabled is not false and no manual barres", () => {
		const props: Partial<ChordDiagramProps> = {
			autoBarreEnabled: true,
			chord: {
				fingers: [],
				barres: [],
			},
		};

		const result = shouldApplyAutoBarre(props as ChordDiagramProps);
		expect(result).toBe(true);
	});

	it("should return true when autoBarreEnabled is undefined (default) and no manual barres", () => {
		const props: Partial<ChordDiagramProps> = {
			chord: {
				fingers: [],
				barres: [],
			},
		};

		const result = shouldApplyAutoBarre(props as ChordDiagramProps);
		expect(result).toBe(true);
	});

	it("should return false when autoBarreEnabled is explicitly false", () => {
		const props: Partial<ChordDiagramProps> = {
			autoBarreEnabled: false,
			chord: {
				fingers: [],
				barres: [],
			},
		};

		const result = shouldApplyAutoBarre(props as ChordDiagramProps);
		expect(result).toBe(false);
	});

	it("should return false when manual barres are defined", () => {
		const props: Partial<ChordDiagramProps> = {
			autoBarreEnabled: true,
			chord: {
				fingers: [],
				barres: [{ fret: 1, fromString: 1, toString: 6 }],
			},
		};

		const result = shouldApplyAutoBarre(props as ChordDiagramProps);
		expect(result).toBe(false);
	});

	it("should return false when both autoBarreEnabled is false AND manual barres exist", () => {
		const props: Partial<ChordDiagramProps> = {
			autoBarreEnabled: false,
			chord: {
				fingers: [],
				barres: [{ fret: 1, fromString: 1, toString: 6 }],
			},
		};

		const result = shouldApplyAutoBarre(props as ChordDiagramProps);
		expect(result).toBe(false);
	});

	it("should handle missing chord prop gracefully", () => {
		const props: Partial<ChordDiagramProps> = {
			autoBarreEnabled: true,
		};

		const result = shouldApplyAutoBarre(props as ChordDiagramProps);
		expect(result).toBe(true); // no barres means auto barre can be applied
	});
});
