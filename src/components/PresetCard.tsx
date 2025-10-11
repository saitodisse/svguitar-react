/**
 * @fileoverview Preset card component for displaying chord diagram presets
 * @author svguitar-react
 * @version 1.0.0
 */

import { ChordDiagram } from "./ChordDiagram/ChordDiagram";
import type { PresetConfig } from "../utils/storyPresets";

interface PresetCardProps {
	preset: PresetConfig;
	onSelect: (preset: PresetConfig) => void;
}

export function PresetCard({ preset, onSelect }: PresetCardProps) {
	return (
		<button
			onClick={() => onSelect(preset)}
			className="group flex w-full flex-col items-center gap-2 rounded-lg border border-white/10 bg-white/5 p-3 transition-all hover:border-white/30 hover:bg-white/10 hover:scale-105"
			type="button"
		>
			<div className="flex h-[100px] w-full items-center justify-center overflow-hidden rounded bg-white/5">
				<div className="scale-[0.4] origin-center">
					<ChordDiagram {...preset.props} />
				</div>
			</div>
			<div className="flex w-full flex-col gap-0.5 text-left">
				<span className="text-xs font-medium text-white/90 line-clamp-1">{preset.name}</span>
				{preset.description && (
					<span className="text-[10px] text-white/60 line-clamp-2">{preset.description}</span>
				)}
			</div>
		</button>
	);
}
