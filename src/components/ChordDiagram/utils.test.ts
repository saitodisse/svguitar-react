/**
 * @fileoverview Tests for utility functions
 * @author svguitar-react
 * @version 1.0.0
 */

import { describe, it, expect } from "vitest";
import { formatTuningLabel, mergeInstrument, processChordData } from "./utils";
import { DEFAULT_INSTRUMENT } from "./constants";

describe("mergeInstrument", () => {
	it("preserves default strings when strings prop is undefined", () => {
		const merged = mergeInstrument({ strings: undefined, chord: "022000" });
		expect(merged.strings).toBe(DEFAULT_INSTRUMENT.strings);
	});

	it("infers strings from tuning when strings is omitted", () => {
		const merged = mergeInstrument({
			tuning: ["D2", "A2", "D3", "G3", "B3", "E4"],
		});
		expect(merged.strings).toBe(6);
	});
});

describe("processChordData", () => {
	it("parses fret notation without explicit strings prop", () => {
		const result = processChordData({
			instrument: { chord: "022000", strings: undefined },
		});
		expect(result.fingers.length).toBeGreaterThan(0);
	});
});

describe("formatTuningLabel", () => {
	describe('format: "scientific"', () => {
		it("returns the full scientific notation", () => {
			expect(formatTuningLabel("E2", "scientific")).toBe("E2");
			expect(formatTuningLabel("A2", "scientific")).toBe("A2");
			expect(formatTuningLabel("D3", "scientific")).toBe("D3");
			expect(formatTuningLabel("G3", "scientific")).toBe("G3");
			expect(formatTuningLabel("B3", "scientific")).toBe("B3");
			expect(formatTuningLabel("E4", "scientific")).toBe("E4");
		});

		it("preserves sharps in scientific notation", () => {
			expect(formatTuningLabel("C#2", "scientific")).toBe("C#2");
			expect(formatTuningLabel("F#3", "scientific")).toBe("F#3");
		});

		it("preserves flats in scientific notation", () => {
			expect(formatTuningLabel("Db3", "scientific")).toBe("Db3");
			expect(formatTuningLabel("Ab2", "scientific")).toBe("Ab2");
		});
	});

	describe('format: "note-only"', () => {
		it("returns only the note name without octave", () => {
			expect(formatTuningLabel("E2", "note-only")).toBe("E");
			expect(formatTuningLabel("A2", "note-only")).toBe("A");
			expect(formatTuningLabel("D3", "note-only")).toBe("D");
			expect(formatTuningLabel("G3", "note-only")).toBe("G");
			expect(formatTuningLabel("B3", "note-only")).toBe("B");
			expect(formatTuningLabel("E4", "note-only")).toBe("E");
		});

		it("preserves sharps in note-only format", () => {
			expect(formatTuningLabel("C#2", "note-only")).toBe("C#");
			expect(formatTuningLabel("F#3", "note-only")).toBe("F#");
			expect(formatTuningLabel("G#4", "note-only")).toBe("G#");
		});

		it("preserves flats in note-only format", () => {
			expect(formatTuningLabel("Db3", "note-only")).toBe("Db");
			expect(formatTuningLabel("Ab2", "note-only")).toBe("Ab");
			expect(formatTuningLabel("Bb2", "note-only")).toBe("Bb");
		});

		it("handles different octaves of the same note", () => {
			expect(formatTuningLabel("C0", "note-only")).toBe("C");
			expect(formatTuningLabel("C1", "note-only")).toBe("C");
			expect(formatTuningLabel("C2", "note-only")).toBe("C");
			expect(formatTuningLabel("C3", "note-only")).toBe("C");
			expect(formatTuningLabel("C8", "note-only")).toBe("C");
		});
	});

	describe("edge cases", () => {
		it("handles invalid note names gracefully", () => {
			// Should return the original string if parsing fails
			expect(formatTuningLabel("invalid", "note-only")).toBe("invalid");
			expect(formatTuningLabel("X99", "note-only")).toBe("X99");
		});

		it("handles empty strings", () => {
			expect(formatTuningLabel("", "scientific")).toBe("");
			expect(formatTuningLabel("", "note-only")).toBe("");
		});

		it("handles double sharps and double flats", () => {
			expect(formatTuningLabel("C##3", "note-only")).toBe("C##");
			expect(formatTuningLabel("Dbb4", "note-only")).toBe("Dbb");
		});
	});
});
