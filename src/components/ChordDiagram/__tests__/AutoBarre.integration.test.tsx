/**
 * @fileoverview Integration tests for auto barre feature
 * @author svguitar-react
 * @version 1.0.0
 */

import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { ChordDiagram } from "../ChordDiagram";
import type { Chord } from "../types";

describe("ChordDiagram - Auto Barre Integration", () => {
	// T007a: Teste: Acorde com 5 dedos gera barre automática quando habilitado
	it("should render auto-detected barre by default (5 fingers)", () => {
		const chord: Chord = {
			fingers: [
				{ fret: 3, string: 6, is_muted: false },
				{ fret: 3, string: 5, is_muted: false },
				{ fret: 3, string: 4, is_muted: false },
				{ fret: 4, string: 3, is_muted: false },
				{ fret: 5, string: 2, is_muted: false },
			],
			barres: [],
		};

		const { container } = render(<ChordDiagram chord={chord} />);

		// Verify that a barre element exists
		const barres = container.querySelectorAll('[data-testid="barre"]');
		expect(barres).toHaveLength(1);
	});

	// T007b: Teste: Acorde com 5 dedos não gera barre quando `autoBarreEnabled: false`
	it("should not render auto barre when autoBarreEnabled is false", () => {
		const chord: Chord = {
			fingers: [
				{ fret: 3, string: 6, is_muted: false },
				{ fret: 3, string: 5, is_muted: false },
				{ fret: 3, string: 4, is_muted: false },
				{ fret: 4, string: 3, is_muted: false },
				{ fret: 5, string: 2, is_muted: false },
			],
			barres: [],
		};

		const { container } = render(<ChordDiagram chord={chord} autoBarreEnabled={false} />);

		// Verify that no barre elements exist
		const barres = container.querySelectorAll('[data-testid="barre"]');
		expect(barres).toHaveLength(0);
	});

	// T007c: Teste: Barres manuais desabilitam auto barre (precedência)
	it("should respect manual barres (no auto barre added)", () => {
		const manualBarre = { fret: 1, fromString: 1, toString: 6 };
		const chord: Chord = {
			fingers: [
				{ fret: 3, string: 6, is_muted: false },
				{ fret: 3, string: 5, is_muted: false },
				{ fret: 3, string: 4, is_muted: false },
				{ fret: 4, string: 3, is_muted: false },
				{ fret: 5, string: 2, is_muted: false },
			],
			barres: [manualBarre],
		};

		const { container } = render(<ChordDiagram chord={chord} />);

		// Verify that there is only 1 barre (the manual one)
		const barres = container.querySelectorAll('[data-testid="barre"]');
		expect(barres).toHaveLength(1);
	});

	// T007d: Teste: Auto barre não interfere com acordes normais (≤4 dedos)
	it("should not add auto barre for chords with 4 or fewer fingers", () => {
		const chord: Chord = {
			fingers: [
				{ fret: 3, string: 5, is_muted: false },
				{ fret: 2, string: 4, is_muted: false },
				{ fret: 0, string: 3, is_muted: false }, // Open string
				{ fret: 0, string: 2, is_muted: false }, // Open string
			],
			barres: [],
		};

		const { container } = render(<ChordDiagram chord={chord} />);

		// Verify that no barre exists
		const barres = container.querySelectorAll('[data-testid="barre"]');
		expect(barres).toHaveLength(0);
	});

	// T007e: Teste: Auto barre funciona com Fret Notation (ex: "333455")
	it("should work with Fret Notation input", () => {
		const { container } = render(
			<ChordDiagram
				instrument={{
					strings: 6,
					frets: 5,
					tuning: ["E2", "A2", "D3", "G3", "B3", "E4"],
					chord: "333455", // 6 fingers on different frets
				}}
			/>
		);

		// Verify that a barre exists (auto-detected)
		const barres = container.querySelectorAll('[data-testid="barre"]');
		expect(barres).toHaveLength(1);
	});

	// T007f: Teste: Auto barre funciona em todas as views (horizontal/vertical, right/left)
	it("should work in all views (horizontal-right)", () => {
		const chord: Chord = {
			fingers: [
				{ fret: 3, string: 6, is_muted: false },
				{ fret: 3, string: 5, is_muted: false },
				{ fret: 3, string: 4, is_muted: false },
				{ fret: 4, string: 3, is_muted: false },
				{ fret: 5, string: 2, is_muted: false },
			],
			barres: [],
		};

		const { container } = render(<ChordDiagram chord={chord} view="horizontal-right" />);

		const barres = container.querySelectorAll('[data-testid="barre"]');
		expect(barres).toHaveLength(1);
	});

	it("should work in all views (horizontal-left)", () => {
		const chord: Chord = {
			fingers: [
				{ fret: 3, string: 6, is_muted: false },
				{ fret: 3, string: 5, is_muted: false },
				{ fret: 3, string: 4, is_muted: false },
				{ fret: 4, string: 3, is_muted: false },
				{ fret: 5, string: 2, is_muted: false },
			],
			barres: [],
		};

		const { container } = render(<ChordDiagram chord={chord} view="horizontal-left" />);

		const barres = container.querySelectorAll('[data-testid="barre"]');
		expect(barres).toHaveLength(1);
	});

	it("should work in all views (vertical-right)", () => {
		const chord: Chord = {
			fingers: [
				{ fret: 3, string: 6, is_muted: false },
				{ fret: 3, string: 5, is_muted: false },
				{ fret: 3, string: 4, is_muted: false },
				{ fret: 4, string: 3, is_muted: false },
				{ fret: 5, string: 2, is_muted: false },
			],
			barres: [],
		};

		const { container } = render(<ChordDiagram chord={chord} view="vertical-right" />);

		const barres = container.querySelectorAll('[data-testid="barre"]');
		expect(barres).toHaveLength(1);
	});

	it("should work in all views (vertical-left)", () => {
		const chord: Chord = {
			fingers: [
				{ fret: 3, string: 6, is_muted: false },
				{ fret: 3, string: 5, is_muted: false },
				{ fret: 3, string: 4, is_muted: false },
				{ fret: 4, string: 3, is_muted: false },
				{ fret: 5, string: 2, is_muted: false },
			],
			barres: [],
		};

		const { container } = render(<ChordDiagram chord={chord} view="vertical-left" />);

		const barres = container.querySelectorAll('[data-testid="barre"]');
		expect(barres).toHaveLength(1);
	});

	// Additional edge case tests
	it("should handle exactly 5 fingers (threshold)", () => {
		const chord: Chord = {
			fingers: [
				{ fret: 1, string: 6, is_muted: false },
				{ fret: 1, string: 5, is_muted: false },
				{ fret: 1, string: 4, is_muted: false },
				{ fret: 1, string: 3, is_muted: false },
				{ fret: 1, string: 2, is_muted: false },
			],
			barres: [],
		};

		const { container } = render(<ChordDiagram chord={chord} />);

		const barres = container.querySelectorAll('[data-testid="barre"]');
		expect(barres).toHaveLength(1);
	});

	it("should ignore open strings in the count", () => {
		const chord: Chord = {
			fingers: [
				{ fret: 0, string: 6, is_muted: false }, // Open string (ignored)
				{ fret: 1, string: 5, is_muted: false },
				{ fret: 2, string: 4, is_muted: false },
				{ fret: 2, string: 3, is_muted: false },
				{ fret: 3, string: 2, is_muted: false },
			],
			barres: [],
		};

		const { container } = render(<ChordDiagram chord={chord} />);

		// Only 4 non-open fingers, so no auto barre
		const barres = container.querySelectorAll('[data-testid="barre"]');
		expect(barres).toHaveLength(0);
	});

	it("should ignore muted strings in the count", () => {
		const chord: Chord = {
			fingers: [
				{ fret: 1, string: 6, is_muted: true }, // Muted (ignored)
				{ fret: 1, string: 5, is_muted: false },
				{ fret: 2, string: 4, is_muted: false },
				{ fret: 2, string: 3, is_muted: false },
				{ fret: 3, string: 2, is_muted: false },
			],
			barres: [],
		};

		const { container } = render(<ChordDiagram chord={chord} />);

		// Only 4 non-muted fingers with fret > 0, so no auto barre
		const barres = container.querySelectorAll('[data-testid="barre"]');
		expect(barres).toHaveLength(0);
	});
});
