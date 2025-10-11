/**
 * @fileoverview Sidebar component displaying all chord diagram presets
 * @author svguitar-react
 * @version 1.0.0
 */

import { CHORD_PRESETS, type PresetConfig } from "../utils/storyPresets";
import { PresetCard } from "./PresetCard";

interface PresetsSidebarProps {
	onSelectPreset: (preset: PresetConfig) => void;
}

export function PresetsSidebar({ onSelectPreset }: PresetsSidebarProps) {
	return (
		<aside
			className="flex max-h-[calc(100vh-200px)] flex-col gap-4 overflow-y-auto rounded-xl border border-white/10 bg-white/5 p-4 shadow-lg backdrop-blur-sm"
			aria-label="Chord diagram presets"
		>
			<div className="flex items-center justify-between sticky top-0 bg-white/5 backdrop-blur-sm pb-2 border-b border-white/10">
				<h2 className="text-lg font-semibold text-white/90">Presets</h2>
				<span className="text-xs text-white/60">{CHORD_PRESETS.length} presets</span>
			</div>
			<div className="grid grid-cols-1 gap-3">
				{CHORD_PRESETS.map(preset => (
					<PresetCard key={preset.id} preset={preset} onSelect={onSelectPreset} />
				))}
			</div>
		</aside>
	);
}
