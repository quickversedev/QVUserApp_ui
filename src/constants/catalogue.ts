/**
 * Catalogue accent colours.
 *
 * These are not in the theme because the theme has no green: both `main` and
 * `secondary` are amber (#D97706 / #F59E0B). The QV PLP and PDP designs use a green
 * for everything that means "vegetarian", "saving" or "fast delivery" — its
 * `secondary` / `on-secondary` pair — so the value lives here rather than being
 * repeated as a literal in every component that needs it.
 *
 * Prefer `useTheme().getColor()` for everything else, per the repo's style rules. If
 * a green is ever added to the server-driven theme, delete this and read it from
 * there instead.
 */
export const CATALOGUE_ACCENT = '#006D30';
export const ON_CATALOGUE_ACCENT = '#FFFFFF';

/**
 * Horizontal gutter for the catalogue detail body.
 *
 * Shared because the PDP's sheet and the blocks rendered outside it — the ETA
 * banner, the trust pills, the suggestions grid — have to line up, and they live in
 * different files. A literal in each was how two of them ended up on the screen edge.
 */
export const CATALOGUE_GUTTER = 20;
