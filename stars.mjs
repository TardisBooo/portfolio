export const OWNER = 'TardisBooo';
export const CACHE_KEY = 'tardis-github-stars-v1';
export const MAX_CACHE_AGE = 7 * 24 * 60 * 60 * 1000;

export function parseStoredSnapshot(raw, now = Date.now()) {
  try {
    const data = JSON.parse(raw);
    if (data?.version !== 1 || data.owner !== OWNER || !Array.isArray(data.repos)) return null;
    if (!Number.isFinite(data.updatedAt) || now - data.updatedAt > MAX_CACHE_AGE || data.updatedAt > now + 60000) return null;
    if (!data.repos.every(repo => typeof repo.name === 'string' && Number.isSafeInteger(repo.stars) && repo.stars >= 0)) return null;
    if (new Set(data.repos.map(repo => repo.name.toLowerCase())).size !== data.repos.length) return null;
    if (data.total !== data.repos.reduce((sum, repo) => sum + repo.stars, 0)) return null;
    return data;
  } catch { return null; }
}

export async function loadStarSnapshot({fetchFn = fetch, signal} = {}) {
  const base = `https://api.github.com/users/${OWNER}/repos`;
  let url = `${base}?per_page=100&type=owner&sort=full_name&direction=asc`;
  const originals = new Map();
  for (let page = 0; url; page += 1) {
    if (page >= 10) throw new Error('Incomplete repository listing');
    const response = await fetchFn(url, {signal, cache:'no-store', headers:{Accept:'application/vnd.github+json'}});
    if (!response.ok) throw new Error(`GitHub returned ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error('Invalid repository listing');
    for (const repo of data) {
      if (repo?.owner?.login?.toLowerCase() !== OWNER.toLowerCase() || repo.private !== false) throw new Error('Unexpected repository owner or visibility');
      if (typeof repo.name !== 'string' || typeof repo.fork !== 'boolean' || !Number.isSafeInteger(repo.stargazers_count) || repo.stargazers_count < 0) throw new Error('Invalid star count');
      if (!repo.fork) originals.set(repo.name.toLowerCase(), {name:repo.name, stars:repo.stargazers_count});
    }
    const next = response.headers.get('Link')?.match(/<([^>]+)>;\s*rel="next"/);
    url = next?.[1] || null;
    if (url) {
      const parsed = new URL(url);
      if (parsed.origin !== 'https://api.github.com' || parsed.pathname !== new URL(base).pathname) throw new Error('Unexpected pagination destination');
    }
  }
  const repos = [...originals.values()];
  return {version:1, owner:OWNER, updatedAt:Date.now(), repos, total:repos.reduce((sum, repo) => sum + repo.stars, 0)};
}
