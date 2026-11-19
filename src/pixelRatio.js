/**
 * The highest pixel ratio worth drawing the 3D scenes at: the screen's own density, up to
 * 2× on desktop retina screens but 1.5× on phones and tablets (a coarse, touch pointer),
 * where the extra pixels cost more frame time and battery than the eye can see.
 */
export const IS_TOUCH_SCREEN = typeof window.matchMedia === 'function' && window.matchMedia('(pointer: coarse)').matches;

export const MAX_PIXEL_RATIO = Math.min(window.devicePixelRatio || 1, IS_TOUCH_SCREEN ? 1.5 : 2);

/**
 * Multisampling stays on everywhere: phone GPUs resolve it on-chip almost for free, and
 * without it the hall's long straight edges stair-step visibly. Full anisotropic filtering
 * is what a phone pays for, so touch screens use at most 4×.
 */
export const ANTIALIAS = true;
export const anisotropyFor = (renderer) => Math.min(renderer.capabilities.getMaxAnisotropy(), IS_TOUCH_SCREEN ? 4 : Infinity);
