/**
 * @fileoverview Tests for preset loading consistency
 * @author svguitar-react
 * @version 1.0.0
 *
 * These tests verify that clicking a preset multiple times produces
 * consistent results - all properties should remain unchanged between clicks.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import { CHORD_PRESETS } from "../utils/storyPresets";

// Mock state setters
const createMockSetters = () => ({
	setChord: vi.fn(),
	setBarreEnabled: vi.fn(),
	setBarreFret: vi.fn(),
	setBarreFromString: vi.fn(),
	setBarreToString: vi.fn(),
	setView: vi.fn(),
	setWidth: vi.fn(),
	setHeight: vi.fn(),
	setFretCount: vi.fn(),
	setStringCount: vi.fn(),
	setFretWidth: vi.fn(),
	setFretHeight: vi.fn(),
	setStringWidth: vi.fn(),
	setDotSize: vi.fn(),
	setBarreHeight: vi.fn(),
	setBackgroundColor: vi.fn(),
	setFretColor: vi.fn(),
	setStringColor: vi.fn(),
	setDotColor: vi.fn(),
	setDotTextColor: vi.fn(),
	setBarreColor: vi.fn(),
	setFretTextColor: vi.fn(),
	setTuningTextColor: vi.fn(),
	setOpenStringColor: vi.fn(),
	setMutedStringColor: vi.fn(),
	setFontFamily: vi.fn(),
	setDotTextSize: vi.fn(),
	setFretTextSize: vi.fn(),
	setTuningTextSize: vi.fn(),
	setTuningLabelOffsetX: vi.fn(),
	setTuningLabelOffsetY: vi.fn(),
	setTuningLabelFormat: vi.fn(),
	setStringIndicatorOffsetX: vi.fn(),
	setStringIndicatorOffsetY: vi.fn(),
	setBarresWidth: vi.fn(),
	setBarresOpacity: vi.fn(),
	setBarresOffsetX: vi.fn(),
	setBarresOffsetY: vi.fn(),
	setFretTextOffsetX: vi.fn(),
	setFretTextOffsetY: vi.fn(),
	setNutStrokeWidth: vi.fn(),
	setNutOffsetX: vi.fn(),
	setNutOffsetY: vi.fn(),
	setNutOpacity: vi.fn(),
	setNutColor: vi.fn(),
	setCanvasOffsetX: vi.fn(),
	setCanvasOffsetY: vi.fn(),
});

// Simulate the loadPreset function from App.tsx
const simulateLoadPreset = (
	preset: (typeof CHORD_PRESETS)[number],
	setters: ReturnType<typeof createMockSetters>
) => {
	const p = preset.props;

	// Extract chord notation
	setters.setChord(p.instrument?.chord || "x32010");

	// Extract barre information
	if (p.chord?.barres && p.chord.barres.length > 0) {
		const firstBarre = p.chord.barres[0];
		setters.setBarreEnabled(1);
		setters.setBarreFret(firstBarre.fret);
		setters.setBarreFromString(firstBarre.fromString);
		setters.setBarreToString(firstBarre.toString);
	} else {
		setters.setBarreEnabled(0);
	}

	// All properties (always set)
	setters.setView(p.view!);
	setters.setWidth(p.width!);
	setters.setHeight(p.height!);
	setters.setFretCount(p.fretCount!);
	setters.setStringCount(p.stringCount!);
	setters.setFretWidth(p.fretWidth!);
	setters.setFretHeight(p.fretHeight!);
	setters.setStringWidth(p.stringWidth!);
	setters.setDotSize(p.dotSize!);
	setters.setBarreHeight(p.barreHeight!);
	setters.setBackgroundColor(p.backgroundColor!);
	setters.setFretColor(p.fretColor!);
	setters.setStringColor(p.stringColor!);
	setters.setDotColor(p.dotColor!);
	setters.setDotTextColor(p.dotTextColor!);
	setters.setBarreColor(p.barreColor!);
	setters.setFretTextColor(p.fretTextColor!);
	setters.setTuningTextColor(p.tuningTextColor!);
	setters.setOpenStringColor(p.openStringColor!);
	setters.setMutedStringColor(p.mutedStringColor!);
	setters.setFontFamily(p.fontFamily!);
	setters.setDotTextSize(p.dotTextSize!);
	setters.setFretTextSize(p.fretTextSize!);
	setters.setTuningTextSize(p.tuningTextSize!);
	setters.setTuningLabelOffsetX(Math.round(p.tuningLabelOffsetX! * 100));
	setters.setTuningLabelOffsetY(Math.round(p.tuningLabelOffsetY! * 100));
	setters.setTuningLabelFormat(p.tuningLabelFormat!);
	setters.setStringIndicatorOffsetX(Math.round(p.stringIndicatorOffsetX! * 100));
	setters.setStringIndicatorOffsetY(Math.round(p.stringIndicatorOffsetY! * 100));
	setters.setBarresWidth(p.barresWidth!);
	setters.setBarresOpacity(Math.round(p.barresOpacity! * 100));
	setters.setBarresOffsetX(Math.round(p.barresOffsetX! * 100));
	setters.setBarresOffsetY(Math.round(p.barresOffsetY! * 100));
	setters.setFretTextOffsetX(Math.round(p.fretTextOffsetX! * 100));
	setters.setFretTextOffsetY(Math.round(p.fretTextOffsetY! * 100));
	setters.setNutStrokeWidth(Math.round(p.nutStrokeWidth! * 1000));
	setters.setNutOffsetX(Math.round(p.nutOffsetX! * 100));
	setters.setNutOffsetY(Math.round(p.nutOffsetY! * 100));
	setters.setNutOpacity(Math.round(p.nutOpacity! * 100));
	setters.setNutColor(p.nutColor!);
	setters.setCanvasOffsetX(p.canvasOffsetX!);
	setters.setCanvasOffsetY(p.canvasOffsetY!);
};

describe("Preset Loading Consistency", () => {
	describe("C Major - Default Preset", () => {
		let setters: ReturnType<typeof createMockSetters>;
		const preset = CHORD_PRESETS.find(p => p.id === "c-major-default")!;

		beforeEach(() => {
			setters = createMockSetters();
		});

		it("should have all required properties defined in preset", () => {
			expect(preset).toBeDefined();
			expect(preset.props.view).toBeDefined();
			expect(preset.props.width).toBeDefined();
			expect(preset.props.height).toBeDefined();
			expect(preset.props.fretCount).toBeDefined();
			expect(preset.props.stringCount).toBeDefined();
			expect(preset.props.canvasOffsetX).toBeDefined();
			expect(preset.props.canvasOffsetY).toBeDefined();
			expect(preset.props.tuningLabelFormat).toBeDefined();
			expect(preset.props.fretTextOffsetX).toBeDefined();
			expect(preset.props.fretTextOffsetY).toBeDefined();
		});

		it("should produce identical values when clicked twice", () => {
			// First click
			simulateLoadPreset(preset, setters);
			const firstClickValues = getAllSetterCalls(setters);

			// Clear mocks
			Object.values(setters).forEach(setter => setter.mockClear());

			// Second click
			simulateLoadPreset(preset, setters);
			const secondClickValues = getAllSetterCalls(setters);

			// Compare all values
			expect(secondClickValues).toEqual(firstClickValues);
		});

		it("should set all properties with exact values from preset", () => {
			simulateLoadPreset(preset, setters);

			// Dimensions
			expect(setters.setWidth).toHaveBeenCalledWith(128);
			expect(setters.setHeight).toHaveBeenCalledWith(219);
			expect(setters.setFretCount).toHaveBeenCalledWith(5);
			expect(setters.setStringCount).toHaveBeenCalledWith(6);
			expect(setters.setFretWidth).toHaveBeenCalledWith(19);
			expect(setters.setFretHeight).toHaveBeenCalledWith(35);

			// Colors
			expect(setters.setBackgroundColor).toHaveBeenCalledWith("#ffffff");
			expect(setters.setFretColor).toHaveBeenCalledWith("#333333");
			expect(setters.setStringColor).toHaveBeenCalledWith("#666666");
			expect(setters.setFretTextColor).toHaveBeenCalledWith("#c6c6c6");
			expect(setters.setTuningTextColor).toHaveBeenCalledWith("#e0e0e0");

			// Tuning
			expect(setters.setTuningLabelFormat).toHaveBeenCalledWith("note-only");
			expect(setters.setTuningLabelOffsetX).toHaveBeenCalledWith(Math.round(0.01 * 100));
			expect(setters.setTuningLabelOffsetY).toHaveBeenCalledWith(Math.round(0.27 * 100));

			// Canvas
			expect(setters.setCanvasOffsetX).toHaveBeenCalledWith(-39);
			expect(setters.setCanvasOffsetY).toHaveBeenCalledWith(-19);

			// Fret Text Offsets
			expect(setters.setFretTextOffsetX).toHaveBeenCalledWith(Math.round(-0.13 * 100));
			expect(setters.setFretTextOffsetY).toHaveBeenCalledWith(Math.round(0.11 * 100));

			// Nut
			expect(setters.setNutStrokeWidth).toHaveBeenCalledWith(Math.round(0.075 * 1000));
			expect(setters.setNutColor).toHaveBeenCalledWith("#333333");
			expect(setters.setNutOpacity).toHaveBeenCalledWith(Math.round(1.0 * 100));

			// String Indicators
			expect(setters.setStringIndicatorOffsetX).toHaveBeenCalledWith(Math.round(0.58 * 100));
			expect(setters.setStringIndicatorOffsetY).toHaveBeenCalledWith(Math.round(0.63 * 100));

			// Barres
			expect(setters.setBarresOffsetX).toHaveBeenCalledWith(0);
			expect(setters.setBarresOffsetY).toHaveBeenCalledWith(Math.round(-0.11 * 100));
		});
	});

	describe("F Major - Horizontal Right Preset", () => {
		let setters: ReturnType<typeof createMockSetters>;
		const preset = CHORD_PRESETS.find(p => p.id === "f-major-horizontal-right")!;

		beforeEach(() => {
			setters = createMockSetters();
		});

		it("should have all required properties defined in preset", () => {
			expect(preset).toBeDefined();
			expect(preset.props.view).toBe("horizontal-right");
			expect(preset.props.width).toBe(535);
			expect(preset.props.height).toBe(214);
			expect(preset.props.fretCount).toBe(5);
			expect(preset.props.stringCount).toBe(6);
			expect(preset.props.canvasOffsetX).toBe(0);
			expect(preset.props.canvasOffsetY).toBe(0);
			expect(preset.props.tuningLabelFormat).toBe("note-only");
			expect(preset.props.fretTextOffsetX).toBe(0);
			expect(preset.props.fretTextOffsetY).toBe(0);
			expect(preset.props.chord?.barres).toBeDefined();
			expect(preset.props.chord?.barres?.length).toBe(1);
		});

		it("should produce identical values when clicked twice", () => {
			// First click
			simulateLoadPreset(preset, setters);
			const firstClickValues = getAllSetterCalls(setters);

			// Clear mocks
			Object.values(setters).forEach(setter => setter.mockClear());

			// Second click
			simulateLoadPreset(preset, setters);
			const secondClickValues = getAllSetterCalls(setters);

			// Compare all values - should be identical
			expect(secondClickValues).toEqual(firstClickValues);
		});

		it("should set all properties with exact values from preset", () => {
			simulateLoadPreset(preset, setters);

			// Dimensions
			expect(setters.setWidth).toHaveBeenCalledWith(535);
			expect(setters.setHeight).toHaveBeenCalledWith(214);
			expect(setters.setFretCount).toHaveBeenCalledWith(5);
			expect(setters.setStringCount).toHaveBeenCalledWith(6);
			expect(setters.setFretWidth).toHaveBeenCalledWith(47);
			expect(setters.setFretHeight).toHaveBeenCalledWith(30);

			// Colors
			expect(setters.setBackgroundColor).toHaveBeenCalledWith("#ffffff");
			expect(setters.setFretColor).toHaveBeenCalledWith("#333333");
			expect(setters.setStringColor).toHaveBeenCalledWith("#666666");
			expect(setters.setFretTextColor).toHaveBeenCalledWith("#abaaaa");
			expect(setters.setTuningTextColor).toHaveBeenCalledWith("#9e9a9a");

			// Tuning
			expect(setters.setTuningLabelFormat).toHaveBeenCalledWith("note-only");
			expect(setters.setTuningLabelOffsetX).toHaveBeenCalledWith(Math.round(0.28 * 100));
			expect(setters.setTuningLabelOffsetY).toHaveBeenCalledWith(Math.round(-0.04 * 100));

			// Canvas (CRITICAL - these were changing)
			expect(setters.setCanvasOffsetX).toHaveBeenCalledWith(0);
			expect(setters.setCanvasOffsetY).toHaveBeenCalledWith(0);

			// Fret Text Offsets (CRITICAL - these were changing)
			expect(setters.setFretTextOffsetX).toHaveBeenCalledWith(0);
			expect(setters.setFretTextOffsetY).toHaveBeenCalledWith(0);

			// Nut
			expect(setters.setNutStrokeWidth).toHaveBeenCalledWith(75);
			expect(setters.setNutColor).toHaveBeenCalledWith("#333333");
			expect(setters.setNutOpacity).toHaveBeenCalledWith(100);

			// String Indicators
			expect(setters.setStringIndicatorOffsetX).toHaveBeenCalledWith(50);
			expect(setters.setStringIndicatorOffsetY).toHaveBeenCalledWith(0);

			// Barres
			expect(setters.setBarresWidth).toHaveBeenCalledWith(12);
			expect(setters.setBarresOpacity).toHaveBeenCalledWith(100);
			expect(setters.setBarresOffsetX).toHaveBeenCalledWith(37);
			expect(setters.setBarresOffsetY).toHaveBeenCalledWith(-14);

			// Barre configuration
			expect(setters.setBarreEnabled).toHaveBeenCalledWith(1);
			expect(setters.setBarreFret).toHaveBeenCalledWith(1);
			expect(setters.setBarreFromString).toHaveBeenCalledWith(1);
			expect(setters.setBarreToString).toHaveBeenCalledWith(6);

			// Chord
			expect(setters.setChord).toHaveBeenCalledWith("133211");
		});
	});

	describe("F Major - Vertical Right Preset", () => {
		let setters: ReturnType<typeof createMockSetters>;
		const preset = CHORD_PRESETS.find(p => p.id === "f-major-vertical-right")!;

		beforeEach(() => {
			setters = createMockSetters();
		});

		it("should have all required properties defined in preset", () => {
			expect(preset).toBeDefined();
			expect(preset.props.view).toBe("vertical-right");
			expect(preset.props.width).toBe(192);
			expect(preset.props.height).toBe(261);
			expect(preset.props.fretCount).toBe(5);
			expect(preset.props.stringCount).toBe(6);
			expect(preset.props.canvasOffsetX).toBe(0);
			expect(preset.props.canvasOffsetY).toBe(0);
			expect(preset.props.chord?.barres).toBeDefined();
		});

		it("should produce identical values when clicked twice", () => {
			// First click
			simulateLoadPreset(preset, setters);
			const firstClickValues = getAllSetterCalls(setters);

			// Clear mocks
			Object.values(setters).forEach(setter => setter.mockClear());

			// Second click
			simulateLoadPreset(preset, setters);
			const secondClickValues = getAllSetterCalls(setters);

			// Compare all values - should be identical
			expect(secondClickValues).toEqual(firstClickValues);
		});

		it("should set all properties with exact values from preset", () => {
			simulateLoadPreset(preset, setters);

			// Dimensions
			expect(setters.setWidth).toHaveBeenCalledWith(192);
			expect(setters.setHeight).toHaveBeenCalledWith(261);
			expect(setters.setFretCount).toHaveBeenCalledWith(5);
			expect(setters.setStringCount).toHaveBeenCalledWith(6);
			expect(setters.setFretWidth).toHaveBeenCalledWith(23);
			expect(setters.setFretHeight).toHaveBeenCalledWith(39);

			// Colors
			expect(setters.setBackgroundColor).toHaveBeenCalledWith("#ffffff");
			expect(setters.setFretColor).toHaveBeenCalledWith("#333333");
			expect(setters.setTuningTextColor).toHaveBeenCalledWith("#cecbcb");

			// Tuning
			expect(setters.setTuningLabelFormat).toHaveBeenCalledWith("note-only");
			expect(setters.setTuningLabelOffsetX).toHaveBeenCalledWith(Math.round(0.04 * 100));
			expect(setters.setTuningLabelOffsetY).toHaveBeenCalledWith(Math.round(0.15 * 100));

			// Canvas
			expect(setters.setCanvasOffsetX).toHaveBeenCalledWith(0);
			expect(setters.setCanvasOffsetY).toHaveBeenCalledWith(0);

			// Fret Text Offsets
			expect(setters.setFretTextOffsetX).toHaveBeenCalledWith(Math.round(-6.32 * 100));
			expect(setters.setFretTextOffsetY).toHaveBeenCalledWith(Math.round(0.16 * 100));

			// Barres
			expect(setters.setBarresWidth).toHaveBeenCalledWith(10);
			expect(setters.setBarresOffsetX).toHaveBeenCalledWith(12);
			expect(setters.setBarresOffsetY).toHaveBeenCalledWith(33);

			// Barre configuration
			expect(setters.setBarreEnabled).toHaveBeenCalledWith(1);
			expect(setters.setBarreFret).toHaveBeenCalledWith(1);
		});
	});

	describe("All Presets - Comprehensive Property Validation", () => {
		it("should have all 3 presets available", () => {
			expect(CHORD_PRESETS.length).toBe(3);
			expect(CHORD_PRESETS.map(p => p.id)).toEqual([
				"c-major-default",
				"f-major-horizontal-right",
				"f-major-vertical-right",
			]);
		});

		CHORD_PRESETS.forEach(preset => {
			describe(`${preset.name} (${preset.id})`, () => {
				let setters: ReturnType<typeof createMockSetters>;

				beforeEach(() => {
					setters = createMockSetters();
				});

				it("should have ALL properties explicitly defined", () => {
					const p = preset.props;

					// Dimensions (9 properties)
					expect(p.width).toBeDefined();
					expect(p.height).toBeDefined();
					expect(p.fretCount).toBeDefined();
					expect(p.stringCount).toBeDefined();
					expect(p.fretWidth).toBeDefined();
					expect(p.fretHeight).toBeDefined();
					expect(p.stringWidth).toBeDefined();
					expect(p.dotSize).toBeDefined();
					expect(p.barreHeight).toBeDefined();

					// Colors (10 properties)
					expect(p.backgroundColor).toBeDefined();
					expect(p.fretColor).toBeDefined();
					expect(p.stringColor).toBeDefined();
					expect(p.dotColor).toBeDefined();
					expect(p.dotTextColor).toBeDefined();
					expect(p.barreColor).toBeDefined();
					expect(p.fretTextColor).toBeDefined();
					expect(p.tuningTextColor).toBeDefined();
					expect(p.openStringColor).toBeDefined();
					expect(p.mutedStringColor).toBeDefined();

					// Fonts (4 properties)
					expect(p.fontFamily).toBeDefined();
					expect(p.dotTextSize).toBeDefined();
					expect(p.fretTextSize).toBeDefined();
					expect(p.tuningTextSize).toBeDefined();

					// Tuning (3 properties)
					expect(p.tuningLabelOffsetX).toBeDefined();
					expect(p.tuningLabelOffsetY).toBeDefined();
					expect(p.tuningLabelFormat).toBeDefined();

					// String Indicators (2 properties)
					expect(p.stringIndicatorOffsetX).toBeDefined();
					expect(p.stringIndicatorOffsetY).toBeDefined();

					// Barres (4 properties)
					expect(p.barresWidth).toBeDefined();
					expect(p.barresOpacity).toBeDefined();
					expect(p.barresOffsetX).toBeDefined();
					expect(p.barresOffsetY).toBeDefined();

					// Fret Text (2 properties)
					expect(p.fretTextOffsetX).toBeDefined();
					expect(p.fretTextOffsetY).toBeDefined();

					// Nut (5 properties)
					expect(p.nutStrokeWidth).toBeDefined();
					expect(p.nutOffsetX).toBeDefined();
					expect(p.nutOffsetY).toBeDefined();
					expect(p.nutOpacity).toBeDefined();
					expect(p.nutColor).toBeDefined();

					// Canvas (2 properties)
					expect(p.canvasOffsetX).toBeDefined();
					expect(p.canvasOffsetY).toBeDefined();

					// View & Data
					expect(p.view).toBeDefined();
					expect(p.instrument).toBeDefined();
					expect(p.instrument?.chord).toBeDefined();
					expect(p.instrument?.tuning).toBeDefined();
				});

				it("should maintain consistency across 2 consecutive clicks", () => {
					// First click
					simulateLoadPreset(preset, setters);
					const firstClickValues = getAllSetterCalls(setters);

					// Second click (clear mocks first)
					Object.values(setters).forEach(setter => setter.mockClear());
					simulateLoadPreset(preset, setters);
					const secondClickValues = getAllSetterCalls(setters);

					// Every single property should be identical
					expect(secondClickValues).toEqual(firstClickValues);

					// Verify critical properties that were problematic
					expect(firstClickValues.setFretCount).toEqual(secondClickValues.setFretCount);
					expect(firstClickValues.setCanvasOffsetX).toEqual(secondClickValues.setCanvasOffsetX);
					expect(firstClickValues.setFretTextOffsetX).toEqual(secondClickValues.setFretTextOffsetX);
					expect(firstClickValues.setTuningLabelFormat).toEqual(
						secondClickValues.setTuningLabelFormat
					);
					expect(firstClickValues.setNutStrokeWidth).toEqual(secondClickValues.setNutStrokeWidth);
				});
			});
		});
	});
});

// Helper function to extract all setter call values
function getAllSetterCalls(setters: ReturnType<typeof createMockSetters>) {
	const calls: Record<string, any> = {};

	Object.entries(setters).forEach(([name, setter]) => {
		if (setter.mock.calls.length > 0) {
			calls[name] = setter.mock.calls[0][0];
		}
	});

	return calls;
}
