export interface GitHubAsset {
  id: number;
  name: string;
  browser_download_url: string;
  size: number;
  download_count: number;
}

export interface GitHubRelease {
  id: number;
  tag_name: string;
  name: string;
  body: string;
  published_at: string;
  html_url: string;
  assets: GitHubAsset[];
}

const GITHUB_API_BASE = 'https://api.github.com';

export async function fetchReleases(owner: string, repo: string): Promise<GitHubRelease[]> {
  const response = await fetch(`${GITHUB_API_BASE}/repos/${owner}/${repo}/releases`);
  
  if (!response.ok) {
    if (response.status === 404) {
      throw new Error(`Repository ${owner}/${repo} not found.`);
    }
    throw new Error('Failed to fetch releases from GitHub.');
  }

  const releases: GitHubRelease[] = await response.json();
  return releases.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
}
