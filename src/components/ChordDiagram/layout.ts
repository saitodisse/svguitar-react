/**
 * @fileoverview Layout engines and registry for ChordDiagram component
 * @author svguitar-react
 * @version 1.0.0
 */

import type { LayoutEngine, ViewId } from "./types";
import { horizontalRightEngine } from "./layouts/horizontalRight";
import { horizontalLeftEngine } from "./layouts/horizontalLeft";
import { verticalRightEngine } from "./layouts/verticalRight";
import { verticalLeftEngine } from "./layouts/verticalLeft";

/**
 * Layout registry for managing available layout engines
 */
class LayoutRegistry {
	private engines: Map<ViewId, LayoutEngine> = new Map();

	/**
	 * Register a layout engine
	 */
	register(engine: LayoutEngine): void {
		this.engines.set(engine.id, engine);
	}

	/**
	 * Get a layout engine by view ID
	 */
	get(viewId: ViewId): LayoutEngine | undefined {
		return this.engines.get(viewId);
	}

	/**
	 * Check if a view ID is registered
	 */
	has(viewId: ViewId): boolean {
		return this.engines.has(viewId);
	}

	/**
	 * Get all registered view IDs
	 */
	getViewIds(): ViewId[] {
		return Array.from(this.engines.keys());
	}
}

/**
 * Global layout registry instance
 */
export const layoutRegistry = new LayoutRegistry();

/**
 * Register all built-in layout engines
 */
layoutRegistry.register(horizontalRightEngine);
layoutRegistry.register(horizontalLeftEngine);
layoutRegistry.register(verticalRightEngine);
layoutRegistry.register(verticalLeftEngine);

/**
 * Resolve view ID from props with precedence: layoutEngine > view > default
 */
export function resolveViewId(
	props: { layoutEngine?: LayoutEngine; view?: ViewId },
	defaultView: ViewId = "horizontal-right"
): ViewId {
	if (props.layoutEngine) return props.layoutEngine.id;
	if (props.view) return props.view;
	return defaultView;
}

/**
 * Validate that a view ID exists in the registry
 */
export function validateView(viewId: ViewId): boolean {
	return layoutRegistry.has(viewId);
}

/**
 * Get layout engine for a view ID
 */
export function getLayoutEngine(viewId: ViewId): LayoutEngine | undefined {
	return layoutRegistry.get(viewId);
}
