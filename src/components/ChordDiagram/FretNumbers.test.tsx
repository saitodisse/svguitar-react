import React from "react";
import { render } from "@testing-library/react";

import { FretNumbers } from "./FretNumbers";
import { horizontalLeftEngine } from "./layouts/horizontalLeft";
import { horizontalRightEngine } from "./layouts/horizontalRight";
import type { LayoutFrame } from "./types";
import { DEFAULT_CHORD_STYLE } from "./constants";

const createFrame = (overrides?: Partial<LayoutFrame>): LayoutFrame => {
	const style = { ...DEFAULT_CHORD_STYLE, fretCount: 3 };
	return {
		width: style.width,
		height: style.height,
		gridOriginX: 40,
		gridOriginY: 60,
		gridWidth: style.fretCount * style.fretWidth,
		gridHeight: (style.stringCount - 1) * style.fretHeight,
		firstFret: 1,
		stringCount: style.stringCount,
		fretCount: style.fretCount,
		style,
		...overrides,
	};
};

describe("FretNumbers", () => {
	it("renders numbers right to left in descending x positions for horizontal-right", () => {
		const frame = createFrame();
		const { container } = render(
			<svg>
				<FretNumbers engine={horizontalRightEngine} frame={frame} />
			</svg>
		);

		const texts = Array.from(container.querySelectorAll("text"));
		expect(texts.map(text => text.textContent)).toEqual(["1", "2", "3"]);

		const xs = texts.map(text => Number(text.getAttribute("x")));
		expect(xs[0]).toBeLessThan(xs[1]);
		expect(xs[1]).toBeLessThan(xs[2]);
	});

	it("renders numbers in mirror order (3,2,1) with decreasing x when using horizontal-left", () => {
		const frame = createFrame();
		const { container } = render(
			<svg>
				<FretNumbers engine={horizontalLeftEngine} frame={frame} />
			</svg>
		);

		const texts = Array.from(container.querySelectorAll("text"));
		expect(texts.map(text => text.textContent)).toEqual(["3", "2", "1"]);

		const xs = texts.map(text => Number(text.getAttribute("x")));
		expect(xs[0]).toBeGreaterThan(xs[1]);
		expect(xs[1]).toBeGreaterThan(xs[2]);
	});
});
