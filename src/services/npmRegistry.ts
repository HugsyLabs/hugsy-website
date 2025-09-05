// NPM Registry API service
// For fetching real NPM package information

export interface NpmPackageInfo {
  name: string;
  version: string;
  description?: string;
  keywords?: string[];
  homepage?: string;
  repository?: {
    type: string;
    url: string;
  };
  author?: {
    name: string;
    email?: string;
    url?: string;
  };
  license?: string;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  readme?: string;
  time?: {
    created: string;
    modified: string;
    [version: string]: string;
  };
  'dist-tags'?: {
    latest: string;
    [tag: string]: string;
  };
  versions?: Record<string, any>;
}

export interface NpmDownloadStats {
  downloads: number;
  start: string;
  end: string;
  package: string;
}

// Cache mechanism to avoid repeated requests
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

/**
 * Get data from cache
 */
function getCached<T>(key: string): T | null {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data as T;
  }
  cache.delete(key);
  return null;
}

/**
 * Set cache
 */
function setCache(key: string, data: any): void {
  cache.set(key, { data, timestamp: Date.now() });
}

/**
 * Get NPM package basic information
 * @param packageName Package name, e.g. '@hugsylabs/plugin-git' or 'eslint'
 */
export async function getPackageInfo(packageName: string): Promise<NpmPackageInfo | null> {
  const cacheKey = `pkg:${packageName}`;
  const cached = getCached<NpmPackageInfo>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(`https://registry.npmjs.org/${encodeURIComponent(packageName)}`);
    if (!response.ok) {
      console.error(`Failed to fetch package info: ${response.statusText}`);
      return null;
    }
    
    const data = await response.json();
    
    // Simplify data, keep only necessary fields
    const simplified: NpmPackageInfo = {
      name: data.name,
      version: data['dist-tags']?.latest || Object.keys(data.versions || {}).pop() || '0.0.0',
      description: data.description,
      keywords: data.keywords,
      homepage: data.homepage,
      repository: data.repository,
      author: data.author,
      license: data.license,
      readme: data.readme,
      time: data.time,
      'dist-tags': data['dist-tags'],
    };
    
    setCache(cacheKey, simplified);
    return simplified;
  } catch (error) {
    console.error(`Error fetching package info for ${packageName}:`, error);
    return null;
  }
}

/**
 * Get package download statistics
 * @param packageName Package name
 * @param period Time period: 'last-day' | 'last-week' | 'last-month' | 'last-year'
 */
export async function getDownloadStats(
  packageName: string,
  period: 'last-day' | 'last-week' | 'last-month' | 'last-year' = 'last-week'
): Promise<NpmDownloadStats | null> {
  const cacheKey = `downloads:${packageName}:${period}`;
  const cached = getCached<NpmDownloadStats>(cacheKey);
  if (cached) return cached;

  try {
    const response = await fetch(
      `https://api.npmjs.org/downloads/point/${period}/${encodeURIComponent(packageName)}`
    );
    
    if (!response.ok) {
      console.error(`Failed to fetch download stats: ${response.statusText}`);
      return null;
    }
    
    const data = await response.json();
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`Error fetching download stats for ${packageName}:`, error);
    return null;
  }
}

/**
 * Get package.json for a package
 * @param packageName Package name
 * @param version Version, defaults to 'latest'
 */
export async function getPackageJson(
  packageName: string,
  version: string = 'latest'
): Promise<any | null> {
  const cacheKey = `pkgjson:${packageName}:${version}`;
  const cached = getCached<any>(cacheKey);
  if (cached) return cached;

  try {
    const url = `https://unpkg.com/${packageName}@${version}/package.json`;
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Failed to fetch package.json: ${response.statusText}`);
      return null;
    }
    
    const data = await response.json();
    setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error(`Error fetching package.json for ${packageName}@${version}:`, error);
    return null;
  }
}

/**
 * Get README for a package
 * @param packageName Package name
 * @param version Version, defaults to 'latest'
 */
export async function getReadme(
  packageName: string,
  version: string = 'latest'
): Promise<string | null> {
  const cacheKey = `readme:${packageName}:${version}`;
  const cached = getCached<string>(cacheKey);
  if (cached) return cached;

  try {
    // Try multiple possible README filenames
    const possibleFiles = ['README.md', 'readme.md', 'README', 'readme'];
    
    for (const filename of possibleFiles) {
      const url = `https://unpkg.com/${packageName}@${version}/${filename}`;
      const response = await fetch(url);
      
      if (response.ok) {
        const text = await response.text();
        setCache(cacheKey, text);
        return text;
      }
    }
    
    // If not found, try to get from registry
    const pkgInfo = await getPackageInfo(packageName);
    if (pkgInfo?.readme) {
      setCache(cacheKey, pkgInfo.readme);
      return pkgInfo.readme;
    }
    
    return null;
  } catch (error) {
    console.error(`Error fetching README for ${packageName}@${version}:`, error);
    return null;
  }
}

/**
 * Get file content from a package
 * @param packageName Package name
 * @param filePath File path
 * @param version Version, defaults to 'latest'
 */
export async function getFileContent(
  packageName: string,
  filePath: string,
  version: string = 'latest'
): Promise<string | null> {
  const cacheKey = `file:${packageName}:${version}:${filePath}`;
  const cached = getCached<string>(cacheKey);
  if (cached) return cached;

  try {
    const url = `https://unpkg.com/${packageName}@${version}/${filePath}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Failed to fetch file content: ${response.statusText}`);
      return null;
    }
    
    const text = await response.text();
    setCache(cacheKey, text);
    return text;
  } catch (error) {
    console.error(`Error fetching file ${filePath} for ${packageName}@${version}:`, error);
    return null;
  }
}

/**
 * Get file list from a package (via unpkg browse API)
 * Note: unpkg's meta API may not be supported for all packages
 */
export async function getFileList(
  packageName: string,
  version: string = 'latest'
): Promise<any[] | null> {
  const cacheKey = `filelist:${packageName}:${version}`;
  const cached = getCached<any[]>(cacheKey);
  if (cached) return cached;

  try {
    // unpkg provides a ?meta parameter to get file list
    const url = `https://unpkg.com/${packageName}@${version}/?meta`;
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`Failed to fetch file list: ${response.statusText}`);
      return null;
    }
    
    const data = await response.json();
    setCache(cacheKey, data.files || []);
    return data.files || [];
  } catch (error) {
    console.error(`Error fetching file list for ${packageName}@${version}:`, error);
    return null;
  }
}

/**
 * Extract repository info from GitHub URL
 */
export function extractGitHubInfo(repositoryUrl?: string): { owner: string; repo: string } | null {
  if (!repositoryUrl) return null;
  
  // Match various GitHub URL formats
  const patterns = [
    /github\.com[:/]([^/]+)\/([^/.]+)/,
    /^git\+https:\/\/github\.com\/([^/]+)\/([^/.]+)/,
    /^https:\/\/github\.com\/([^/]+)\/([^/.]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = repositoryUrl.match(pattern);
    if (match) {
      return { owner: match[1], repo: match[2] };
    }
  }
  
  return null;
}

/**
 * Format date
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

/**
 * Check if code is minified/obfuscated
 */
export function isMinified(code: string): boolean {
  // Simple heuristic check
  const lines = code.split('\n');
  if (lines.length < 10 && code.length > 500) return true; // Long but few lines
  
  // Check for typical obfuscation patterns
  const minifiedPatterns = [
    /function\s*\([a-z],\s*[a-z],\s*[a-z]\)/i, // function(a,b,c)
    /var\s+[a-z]=[a-z]\([a-z]\)/i, // var a=b(c)
    /\$[a-zA-Z]{1,2}\(/,  // $a( or $ab(
  ];
  
  return minifiedPatterns.some(pattern => pattern.test(code));
}