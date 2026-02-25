import { Dimensions, PixelRatio, type ScaledSize } from 'react-native';

/**
 * Responsive helpers
 * - Keeps the existing API: `responsiveWidth`, `responsiveHeight`, `responsiveFont`.
 * - Adds extra helpers for more consistent scaling across devices.
 *
 * Notes:
 * - These helpers compute using the *current* window dimensions on each call.
 * - If you need live updates on rotation, create styles inside a component using `useWindowDimensions()`.
 */

const GUIDELINE_BASE_WIDTH = 375; // iPhone X
const GUIDELINE_BASE_HEIGHT = 812; // iPhone X

const getWindow = (): ScaledSize => Dimensions.get('window');

export const getScreenWidth = () => getWindow().width;
export const getScreenHeight = () => getWindow().height;

/** Scale size by screen width (linear). */
export const scale = (size: number) => (getScreenWidth() / GUIDELINE_BASE_WIDTH) * size;

/** Scale size by screen height (linear). */
export const verticalScale = (size: number) => (getScreenHeight() / GUIDELINE_BASE_HEIGHT) * size;

/**
 * Moderate scale: interpolates between original size and scaled size.
 * `factor` in [0..1].
 */
export const moderateScale = (size: number, factor = 0.5) => size + (scale(size) - size) * factor;

/** Moderate scale using screen height. */
export const moderateVerticalScale = (size: number, factor = 0.5) => size + (verticalScale(size) - size) * factor;

/** Percentage helpers (0..100). */
export const wp = (percent: number) => (getScreenWidth() * percent) / 100;
export const hp = (percent: number) => (getScreenHeight() * percent) / 100;

// ---- Backward-compatible helpers ----
// Use these in StyleSheet / layout values
export const responsiveWidth = (size: number) => scale(size);
export const responsiveHeight = (size: number) => verticalScale(size);

/**
 * Normalize font size.
 * - Uses moderate scaling to avoid oversized text on tablets.
 * - Rounds to nearest pixel for crisp rendering.
 */
export const responsiveFont = (
  size: number,
  options?: {
    factor?: number;
    /** Max multiplier relative to original size. Example: 1.25 means 25% larger at most. */
    maxScale?: number;
  }
) => {
  const factor = options?.factor ?? 0.35;
  const maxScale = options?.maxScale ?? 1.25;

  const scaled = moderateScale(size, factor);
  const clamped = Math.min(scaled, size * maxScale);
  return PixelRatio.roundToNearestPixel(clamped);
};

/** Convenience: line-height from a base font size. */
export const responsiveLineHeight = (fontSize: number, multiplier = 1.25) =>
  PixelRatio.roundToNearestPixel(responsiveFont(fontSize) * multiplier);

// ---- Grid utilities for 3 items per row ----
export const getGridGap = () => 8;

export const getItemWidth = (params?: { columns?: number; gap?: number; paddingHorizontal?: number }) => {
  const columns = params?.columns ?? 3;
  const gap = params?.gap ?? getGridGap();
  const paddingHorizontal = params?.paddingHorizontal ?? 32; // 16px each side by default

  const availableWidth = getScreenWidth() - paddingHorizontal;
  const totalGapWidth = gap * Math.max(0, columns - 1);
  return (availableWidth - totalGapWidth) / columns;
};

export const getItemHeight = (params?: {
  columns?: number;
  gap?: number;
  paddingHorizontal?: number;
  /** width:height ratio. default keeps old 120x170 ratio */
  ratio?: { w: number; h: number };
}) => {
  const ratio = params?.ratio ?? { w: 120, h: 170 };
  const itemWidth = getItemWidth(params);
  return (itemWidth * ratio.h) / ratio.w;
};