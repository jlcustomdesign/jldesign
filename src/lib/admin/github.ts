/**
 * github.ts — Thin wrapper over the GitHub REST API.
 *
 * Used in production to read content and to commit changes (atomic, multi-file)
 * with the Git Data API: create blobs → tree → commit → move the branch ref.
 */
import { REPO_OWNER, REPO_NAME, REPO_BRANCH } from './config';

const API = 'https://api.github.com';

function headers(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'jl-custom-admin',
  };
}

async function gh(token: string, path: string, init?: RequestInit) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: { ...headers(token), ...(init?.headers || {}) },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GitHub ${init?.method || 'GET'} ${path} → ${res.status}: ${body}`);
  }
  return res;
}

export interface GitHubUser {
  login: string;
  name: string | null;
  email: string | null;
  avatar_url: string;
}

/** Return the authenticated user, or null if the token is invalid. */
export async function getUser(token: string): Promise<GitHubUser | null> {
  try {
    const res = await gh(token, '/user');
    return (await res.json()) as GitHubUser;
  } catch {
    return null;
  }
}

/** True only if the token can push to the content repo (i.e. a real collaborator). */
export async function canPush(token: string): Promise<boolean> {
  try {
    const res = await gh(token, `/repos/${REPO_OWNER}/${REPO_NAME}`);
    const repo = (await res.json()) as { permissions?: { push?: boolean } };
    return Boolean(repo.permissions?.push);
  } catch {
    return false;
  }
}

/** List file names (not directories) directly inside a repo directory. Empty if missing. */
export async function listDir(token: string, dir: string): Promise<string[]> {
  try {
    const res = await gh(
      token,
      `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${encodeURI(dir)}?ref=${REPO_BRANCH}&_cb=${Date.now()}`,
      { cache: 'no-store' }
    );
    const items = (await res.json()) as Array<{ name: string; type: string }>;
    return items.filter((i) => i.type === 'file').map((i) => i.name);
  } catch {
    return [];
  }
}

/** Read a UTF-8 text file from the repo, or null if it does not exist. */
export async function readFile(token: string, path: string): Promise<string | null> {
  try {
    const res = await gh(
      token,
      `/repos/${REPO_OWNER}/${REPO_NAME}/contents/${encodeURI(path)}?ref=${REPO_BRANCH}&_cb=${Date.now()}`,
      { cache: 'no-store' }
    );
    const data = (await res.json()) as { content?: string; encoding?: string };
    if (!data.content) return null;
    return Buffer.from(data.content, (data.encoding as BufferEncoding) || 'base64').toString('utf-8');
  } catch {
    return null;
  }
}

export type FileChange =
  | { path: string; content: Buffer | string; delete?: false }
  | { path: string; delete: true };

/**
 * Commit a set of file changes (creates/updates and deletes) in a single commit.
 */
export async function commitChanges(
  token: string,
  changes: FileChange[],
  message: string,
  user?: GitHubUser | null
): Promise<string> {
  // 1. Current branch tip + base tree
  const refRes = await gh(token, `/repos/${REPO_OWNER}/${REPO_NAME}/git/ref/heads/${REPO_BRANCH}`);
  const baseSha = ((await refRes.json()) as { object: { sha: string } }).object.sha;

  const commitRes = await gh(token, `/repos/${REPO_OWNER}/${REPO_NAME}/git/commits/${baseSha}`);
  const baseTree = ((await commitRes.json()) as { tree: { sha: string } }).tree.sha;

  // 2. Build tree entries (blobs for upserts, sha:null for deletes)
  const treeItems: Array<Record<string, unknown>> = [];
  for (const change of changes) {
    if (change.delete) {
      treeItems.push({ path: change.path, mode: '100644', type: 'blob', sha: null });
      continue;
    }
    const isBuffer = Buffer.isBuffer(change.content);
    const blobRes = await gh(token, `/repos/${REPO_OWNER}/${REPO_NAME}/git/blobs`, {
      method: 'POST',
      body: JSON.stringify(
        isBuffer
          ? { content: (change.content as Buffer).toString('base64'), encoding: 'base64' }
          : { content: change.content as string, encoding: 'utf-8' }
      ),
    });
    const blobSha = ((await blobRes.json()) as { sha: string }).sha;
    treeItems.push({ path: change.path, mode: '100644', type: 'blob', sha: blobSha });
  }

  // 3. New tree
  const treeRes = await gh(token, `/repos/${REPO_OWNER}/${REPO_NAME}/git/trees`, {
    method: 'POST',
    body: JSON.stringify({ base_tree: baseTree, tree: treeItems }),
  });
  const newTree = ((await treeRes.json()) as { sha: string }).sha;

  // 4. New commit
  const author = user
    ? { name: user.name || user.login, email: user.email || `${user.login}@users.noreply.github.com` }
    : undefined;
  const newCommitRes = await gh(token, `/repos/${REPO_OWNER}/${REPO_NAME}/git/commits`, {
    method: 'POST',
    body: JSON.stringify({
      message,
      tree: newTree,
      parents: [baseSha],
      ...(author ? { author, committer: author } : {}),
    }),
  });
  const newCommit = ((await newCommitRes.json()) as { sha: string }).sha;

  // 5. Move the branch
  await gh(token, `/repos/${REPO_OWNER}/${REPO_NAME}/git/refs/heads/${REPO_BRANCH}`, {
    method: 'PATCH',
    body: JSON.stringify({ sha: newCommit, force: false }),
  });

  return newCommit;
}
