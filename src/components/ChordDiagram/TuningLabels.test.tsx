import React from "react";
import { render } from "@testing-library/react";

import { TuningLabels } from "./TuningLabels";
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

describe("TuningLabels", () => {
    it("positions labels to the right of the fretboard when using the horizontal-left layout", () => {
        const frame = createFrame();
        const { container } = render(
            <svg>
                <TuningLabels
                    engine={horizontalLeftEngine}
                    frame={frame}
                    tuning={["E2", "A2", "D3", "G3", "B3", "E4"]}
                />
            </svg>
        );

        const labels = Array.from(container.querySelectorAll("text"));
        expect(labels).not.toHaveLength(0);

        const rightmostX = Math.max(...labels.map(label => Number(label.getAttribute("x"))));
        expect(rightmostX).toBeGreaterThan(frame.gridOriginX + frame.gridWidth);
    });

    it("keeps labels on the left for the default horizontal-right layout", () => {
        const frame = createFrame();
        const { container } = render(
            <svg>
                <TuningLabels
                    engine={horizontalRightEngine}
                    frame={frame}
                    tuning={["E2", "A2", "D3", "G3", "B3", "E4"]}
                />
            </svg>
        );

        const labels = Array.from(container.querySelectorAll("text"));
        expect(labels).not.toHaveLength(0);

        const rightmostX = Math.max(...labels.map(label => Number(label.getAttribute("x"))));
        expect(rightmostX).toBeLessThan(frame.gridOriginX);
    });
});

