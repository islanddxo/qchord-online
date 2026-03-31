/**
 * Native pixel size of the bundled shell image (reference only).
 */
export const QCHORD_SHELL_NATIVE_WIDTH = 2160;
export const QCHORD_SHELL_NATIVE_HEIGHT = 1620;

/**
 * Layout box for shell + overlay (= centered 50% × 50% of the native PNG frame).
 * Scaler is exactly this size with `transform: scale(fitScale)` so the viewport fit matches
 * the visible instrument (no extra ×0.5 shrink on a 2160×1620 wrapper).
 */
export const QCHORD_DESIGN_WIDTH = QCHORD_SHELL_NATIVE_WIDTH / 2;
export const QCHORD_DESIGN_HEIGHT = QCHORD_SHELL_NATIVE_HEIGHT / 2;
