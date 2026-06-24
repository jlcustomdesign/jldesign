/**
 * config.ts — Central configuration for the custom admin (replaces Keystatic).
 *
 * GitHub is used as the database: in production every change is committed to the
 * repo via the GitHub API. In development changes are written to the local
 * filesystem (same idea as Keystatic's local mode), so the whole admin can be
 * tested without GitHub.
 */

export const REPO_OWNER = 'RobertGyorgy';
export const REPO_NAME = 'JL-Design';
export const REPO_BRANCH = 'main';

/** Cookie that stores the GitHub OAuth access token (set by the OAuth callback). */
export const TOKEN_COOKIE = 'keystatic-gh-access-token';

export const IS_DEV = process.env.NODE_ENV !== 'production';

/** Where each collection's entry files live (relative to the repo root). */
export const PATHS = {
  portfolio: 'src/content/portfolio',
  blog: 'src/content/blog',
  categories: 'src/content/categories',
  offers: 'src/content/offers',
} as const;

/** Where uploaded images are stored (relative to repo root, served from /public). */
export const ASSETS = {
  portfolio: 'public/assets/portfolio',
  blog: 'public/assets/blog',
  offers: 'public/assets/offers',
} as const;

export type CollectionName = keyof typeof PATHS;
