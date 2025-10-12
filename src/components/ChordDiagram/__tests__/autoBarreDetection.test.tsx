/**
 * @fileoverview Unit tests for auto barre detection algorithm
 * @author svguitar-react
 * @version 1.0.0
 */

import { describe, it, expect } from "vitest";
import { detectAutoBarre } from "../utils/autoBarreDetection";
import type { Finger } from "../types";

describe("detectAutoBarre", () => {
	// T006a: Teste: Não aciona com 4 dedos ou menos (fret > 0)
	it("should return null when 4 or fewer fingers with fret > 0", () => {
		const fingers: Finger[] = [
			{ fret: 1, string: 5, is_muted: false },
			{ fret: 2, string: 4, is_muted: false },
			{ fret: 2, string: 3, is_muted: false },
			{ fret: 3, string: 2, is_muted: false },
		];

		const result = detectAutoBarre(fingers);

		expect(result).toBeNull();
	});

	// T006b: Teste: Aciona com 5 dedos (fret > 0)
	it("should detect barre when more than 4 fingers with fret > 0", () => {
		const fingers: Finger[] = [
			{ fret: 3, string: 6, is_muted: false },
			{ fret: 3, string: 5, is_muted: false },
			{ fret: 3, string: 4, is_muted: false },
			{ fret: 4, string: 3, is_muted: false },
			{ fret: 5, string: 2, is_muted: false },
		];

		const result = detectAutoBarre(fingers);

		expect(result).toEqual({
			fret: 3,
			fromString: 4,
			toString: 6,
		});
	});

	// T006c: Teste: Ignora dedos com fret = 0 na contagem
	it("should ignore fingers with fret = 0 in the count", () => {
		const fingers: Finger[] = [
			{ fret: 0, string: 6, is_muted: false }, // open string
			{ fret: 1, string: 5, is_muted: false },
			{ fret: 2, string: 4, is_muted: false },
			{ fret: 2, string: 3, is_muted: false },
			{ fret: 3, string: 2, is_muted: false },
		];

		const result = detectAutoBarre(fingers);

		expect(result).toBeNull(); // Only 4 fingers with fret > 0
	});

	// T006d: Teste: Ignora dedos mutados na contagem
	it("should ignore muted fingers in the count", () => {
		const fingers: Finger[] = [
			{ fret: 1, string: 6, is_muted: true }, // muted
			{ fret: 1, string: 5, is_muted: false },
			{ fret: 2, string: 4, is_muted: false },
			{ fret: 2, string: 3, is_muted: false },
			{ fret: 3, string: 2, is_muted: false },
		];

		const result = detectAutoBarre(fingers);

		expect(result).toBeNull(); // Only 4 non-muted fingers with fret > 0
	});

	// T006e: Teste: Seleciona traste com maior número de dedos
	it("should select fret with most fingers", () => {
		const fingers: Finger[] = [
			{ fret: 3, string: 6, is_muted: false }, // 3 fingers on fret 3
			{ fret: 3, string: 5, is_muted: false },
			{ fret: 3, string: 4, is_muted: false },
			{ fret: 5, string: 3, is_muted: false }, // 2 fingers on fret 5
			{ fret: 5, string: 2, is_muted: false },
		];

		const result = detectAutoBarre(fingers);

		expect(result).not.toBeNull();
		expect(result!.fret).toBe(3); // Fret 3 has most fingers
	});

	// T006f: Teste: Em caso de empate, seleciona traste de menor número
	it("should select lowest fret number in case of tie", () => {
		const fingers: Finger[] = [
			{ fret: 3, string: 6, is_muted: false }, // 2 fingers on fret 3
			{ fret: 3, string: 5, is_muted: false },
			{ fret: 5, string: 4, is_muted: false }, // 2 fingers on fret 5
			{ fret: 5, string: 3, is_muted: false },
			{ fret: 7, string: 2, is_muted: false }, // 1 finger on fret 7
		];

		const result = detectAutoBarre(fingers);

		expect(result).not.toBeNull();
		expect(result!.fret).toBe(3); // Lowest fret number wins the tie
	});

	// T006g: Teste: Define fromString e toString corretamente
	it("should define fromString and toString correctly", () => {
		const fingers: Finger[] = [
			{ fret: 3, string: 2, is_muted: false }, // Not in order
			{ fret: 3, string: 6, is_muted: false },
			{ fret: 3, string: 4, is_muted: false },
			{ fret: 4, string: 3, is_muted: false },
			{ fret: 5, string: 5, is_muted: false },
		];

		const result = detectAutoBarre(fingers);

		expect(result).not.toBeNull();
		expect(result!.fromString).toBe(2); // Lowest string number on fret 3
		expect(result!.toString).toBe(6); // Highest string number on fret 3
	});

	// T006h: Teste: Cobre todas as cordas entre primeiro e último dedo do traste
	it("should cover all strings between first and last finger of the fret", () => {
		const fingers: Finger[] = [
			{ fret: 3, string: 6, is_muted: false },
			{ fret: 3, string: 4, is_muted: false }, // String 5 not pressed, but should be covered
			{ fret: 3, string: 2, is_muted: false },
			{ fret: 4, string: 3, is_muted: false },
			{ fret: 5, string: 1, is_muted: false },
		];

		const result = detectAutoBarre(fingers);

		expect(result).not.toBeNull();
		expect(result!.fret).toBe(3);
		expect(result!.fromString).toBe(2);
		expect(result!.toString).toBe(6);
		// This means the barre will cover strings 2, 3, 4, 5, 6
		// even though string 5 and 3 don't have fingers on fret 3
	});

	// Additional edge cases
	it("should handle exactly 5 fingers (threshold case)", () => {
		const fingers: Finger[] = [
			{ fret: 1, string: 6, is_muted: false },
			{ fret: 1, string: 5, is_muted: false },
			{ fret: 1, string: 4, is_muted: false },
			{ fret: 1, string: 3, is_muted: false },
			{ fret: 1, string: 2, is_muted: false },
		];

		const result = detectAutoBarre(fingers);

		expect(result).not.toBeNull();
		expect(result!.fret).toBe(1);
		expect(result!.fromString).toBe(2);
		expect(result!.toString).toBe(6);
	});

	it("should return null with empty finger array", () => {
		const fingers: Finger[] = [];

		const result = detectAutoBarre(fingers);

		expect(result).toBeNull();
	});

	it("should return null when all fingers are on open strings", () => {
		const fingers: Finger[] = [
			{ fret: 0, string: 6, is_muted: false },
			{ fret: 0, string: 5, is_muted: false },
			{ fret: 0, string: 4, is_muted: false },
			{ fret: 0, string: 3, is_muted: false },
			{ fret: 0, string: 2, is_muted: false },
		];

		const result = detectAutoBarre(fingers);

		expect(result).toBeNull();
	});

	it("should return null when all fingers are muted", () => {
		const fingers: Finger[] = [
			{ fret: 1, string: 6, is_muted: true },
			{ fret: 1, string: 5, is_muted: true },
			{ fret: 1, string: 4, is_muted: true },
			{ fret: 1, string: 3, is_muted: true },
			{ fret: 1, string: 2, is_muted: true },
		];

		const result = detectAutoBarre(fingers);

		expect(result).toBeNull();
	});
});
