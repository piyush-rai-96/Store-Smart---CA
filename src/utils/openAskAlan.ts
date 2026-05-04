import type { StorehubOpenAlanDetail } from '../types';

export const STOREHUB_OPEN_ALAN = 'storehub:open-alan' as const;

/** Opens the global Ask Alan panel. Optional detail selects skill, preset flows, or heatmap audit deep-link. */
export function openAskAlan(detail?: StorehubOpenAlanDetail): void {
  window.dispatchEvent(new CustomEvent(STOREHUB_OPEN_ALAN, { detail: detail ?? {} }));
}
