/**
 * Shared SVG Shape Generators
 *
 * Responsive `rectangle()` and `cross()` path generators used by both
 * the Home hero and the Services hero animations.
 *
 * Previously duplicated in:
 *   - src/scripts/hero-animation.ts
 *   - src/scripts/services-hero-animation.ts
 */

// Breakpoint at which we switch from mobile to desktop SVG paths
export const WIDTH_TARGET = 1110;

export const DESKTOP_RESOLUTION = { width: 1890, height: 916 } as const;
export const MOBILE_RESOLUTION  = { width: 1020, height: 882 } as const;

/**
 * Create responsive width/height scaling functions.
 * `rw(val)` maps a design-pixel x-value to the current viewport width.
 * `rh(val)` maps a design-pixel y-value to the current viewport height.
 */
function getScalers(w: number, h: number) {
  const isDesktop = w > WIDTH_TARGET;
  const ref = isDesktop ? DESKTOP_RESOLUTION : MOBILE_RESOLUTION;
  
  // For ultra-wide/short screens (like Windows with taskbars), we want to cap the height scaling
  // so the elements don't get vertically squashed too aggressively.
  const hScale = Math.max(h, isDesktop ? 680 : 600);
  
  return {
    isDesktop,
    rw: (val: number) => (val / ref.width) * w,
    rh: (val: number) => (val / ref.height) * hScale,
  };
}

/**
 * Full-screen rounded rectangle (start state for hero morph animations).
 */
export function rectangle(w: number, h: number): string {
  const { isDesktop, rw, rh } = getScalers(w, h);

  return isDesktop
    ? `M${rw(12)} ${rh(1)} H${rw(12)} C${rw(4)} ${rh(1)} ${rw(1)} ${rh(4)} ${rw(1)} ${rh(12)} V${rh(905)} C${rw(1)} ${rh(913)} ${rw(4)} ${h} ${rw(12)} ${h} H${rw(1879)} C${rw(1879)} ${h} ${rw(1879)} ${h} ${rw(1879)} ${h} V${h} C${rw(1879)} ${h} ${rw(1879)} ${h} ${rw(1879)} ${h} H${rw(1879)} C${rw(1879)} ${h} ${rw(1879)} ${h} ${rw(1879)} ${h} V${h} C${rw(1879)} ${h} ${rw(1879)} ${h} ${rw(1879)} ${h} H${rw(1879)} C${rw(1887)} ${h} ${w} ${rh(913)} ${w} ${rh(905)} V${rh(12)} C${w} ${rh(12)} ${w} ${rh(12)} ${w} ${rh(12)} H${w} C${w} ${rh(4)} ${rw(1887)} ${rh(1)} ${rw(1879)} ${rh(1)} V${rh(1)} C${rw(1879)} ${rh(1)} ${rw(1879)} ${rh(1)} ${rw(1879)} ${rh(1)} H${rw(12)} V${rh(1)} C${rw(4)} ${rh(1)} ${rw(1)} ${rh(4)} ${rw(1)} ${rh(12)} Z`
    : `M${rw(1000)} ${rh(15)} H${rw(21)} C${rw(9.9543)} ${rh(15)} ${rw(1)} ${rh(24.9543)} ${rw(1)} ${rh(35)} V${rh(845)} C${rw(1)} ${rh(845)} ${rw(1)} ${rh(845)} ${rw(1)} ${rh(845)} H${rw(1)} C${rw(1)} ${rh(860)} ${rw(6)} ${rh(867)} ${rw(21)} ${rh(867)} V${rh(867)} C${rw(21)} ${rh(867)} ${rw(21)} ${rh(867)} ${rw(21)} ${rh(867)} H${rw(997)} C${rw(997)} ${rh(867)} ${rw(997)} ${rh(867)} ${rw(997)} ${rh(867)} V${rh(867)} C${rw(1016)} ${rh(867)} ${w} ${rh(862)} ${w} ${rh(845)} H${w} C${w} ${rh(845)} ${w} ${rh(845)} ${w} ${rh(845)} V${rh(35)} C${w} ${rh(24.9543)} ${rw(1011.05)} ${rh(15)} ${rw(1000)} ${rh(15)} Z`;
}

/**
 * Cross / cutout shape (end state for hero morph animations).
 */
export function cross(w: number, h: number): string {
  const { isDesktop, rw, rh } = getScalers(w, h);

  return isDesktop
    ? `M${rw(470)} ${rh(145)} H${rw(19)} C${rw(9)} ${rh(145)} ${rw(1)} ${rh(153)} ${rw(1)} ${rh(163)} V${rh(754)} C${rw(1)} ${rh(763)} ${rw(9)} ${rh(772)} ${rw(19)} ${rh(772)} H${rw(320)} C${rw(330)} ${rh(772)} ${rw(338)} ${rh(780)} ${rw(338)} ${rh(790)} V${rh(898)} C${rw(338)} ${rh(907)} ${rw(346)} ${h} ${rw(356)} ${h} H${rw(1092)} C${rw(1102)} ${h} ${rw(1110)} ${rh(907)} ${rw(1110)} ${rh(898)} V${rh(789)} C${rw(1110)} ${rh(779)} ${rw(1118)} ${rh(771)} ${rw(1128)} ${rh(771)} H${rw(1872)} C${rw(1881)} ${rh(771)} ${w} ${rh(763)} ${w} ${rh(753)} V${rh(164)} C${w} ${rh(154)} ${rw(1881)} ${rh(146)} ${rw(1872)} ${rh(146)} H${rw(1420)} C${rw(1410)} ${rh(146)} ${rw(1402)} ${rh(137)} ${rw(1402)} ${rh(128)} V${rh(19)} C${rw(1402)} ${rh(9)} ${rw(1394)} ${rh(1)} ${rw(1384)} ${rh(1)} H${rw(506)} C${rw(496)} ${rh(1)} ${rw(488)} ${rh(9)} ${rw(488)} ${rh(19)} V${rh(127)} C${rw(488)} ${rh(137)} ${rw(480)} ${rh(145)} ${rw(470)} ${rh(145)} Z`
    : `M${rw(1000)} ${rh(15)} H${rw(21)} C${rw(9.9543)} ${rh(15)} ${rw(1)} ${rh(24.9543)} ${rw(1)} ${rh(35)} V${rh(680)} C${rw(1)} ${rh(691.046)} ${rw(9.9543)} ${rh(700)} ${rw(21)} ${rh(700)} H${rw(220)} C${rw(231.046)} ${rh(700)} ${rw(240)} ${rh(708.954)} ${rw(240)} ${rh(720)} V${rh(846.869)} C${rw(240)} ${rh(857.915)} ${rw(248.954)} ${rh(866.869)} ${rw(260)} ${rh(866.869)} H${rw(741)} C${rw(752.046)} ${rh(866.869)} ${rw(761)} ${rh(857.915)} ${rw(761)} ${rh(846.869)} V${rh(720)} C${rw(761)} ${rh(708.954)} ${rw(769.954)} ${rh(700)} ${rw(781)} ${rh(700)} H${rw(1000)} C${rw(1011.05)} ${rh(700)} ${w} ${rh(691.046)} ${w} ${rh(680)} V${rh(35)} C${w} ${rh(24.9543)} ${rw(1011.05)} ${rh(15)} ${rw(1000)} ${rh(15)} Z`;
}
