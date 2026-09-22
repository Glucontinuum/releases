import { useState, useEffect } from 'react';
import type { GitHubRelease } from '../services/github';
import { fetchReleases } from '../services/github';

export function useReleases(owner: string, repo: string) {
  const [releases, setReleases] = useState<GitHubRelease[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getReleases() {
      try {
        setLoading(true);
        const data = await fetchReleases(owner, repo);
        setReleases(data);
        setError(null);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
        setError(message);
      } finally {
        setLoading(false);
      }
    }

    if (owner && repo) {
      getReleases();
    }
  }, [owner, repo]);

  const latestRelease = releases.length > 0 ? releases[0] : null;

  return { releases, latestRelease, loading, error };
}
