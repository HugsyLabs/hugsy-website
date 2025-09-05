const NPM_REGISTRY_API = 'https://registry.npmjs.org';
const UNPKG_URL = 'https://unpkg.com';
const NPM_SEARCH_API = 'https://registry.npmjs.org/-/v1/search';

export interface PackageInfo {
  name: string;
  description: string;
  version: string;
  homepage?: string;
  repository?: {
    type: string;
    url: string;
  };
  keywords?: string[];
  author?: string | { name: string; email?: string };
  license?: string;
  dependencies?: Record<string, string>;
  readme?: string;
  time?: {
    created: string;
    modified: string;
    [version: string]: string;
  };
  versions?: string[];
}

export async function getPackageInfo(packageName: string): Promise<PackageInfo | null> {
  try {
    const response = await fetch(`${NPM_REGISTRY_API}/${packageName}`);
    if (!response.ok) return null;
    
    const data = await response.json();
    const latestVersion = data['dist-tags'].latest;
    
    return {
      name: data.name,
      description: data.description,
      version: latestVersion,
      homepage: data.homepage,
      repository: data.repository,
      keywords: data.keywords,
      author: data.author,
      license: data.license,
      dependencies: data.versions[latestVersion].dependencies,
      readme: data.readme,
      time: data.time,
      versions: Object.keys(data.versions).reverse(),
    };
  } catch (error) {
    console.error(`Error fetching package info for ${packageName}:`, error);
    return null;
  }
}

export async function getPackageFile(packageName: string, filePath: string): Promise<string | null> {
  try {
    const response = await fetch(`${UNPKG_URL}/${packageName}/${filePath}`);
    if (!response.ok) return null;
    return await response.text();
  } catch (error) {
    console.error(`Error fetching file ${filePath} from ${packageName}:`, error);
    return null;
  }
}

export async function searchPackages(query: string): Promise<Array<{ name: string; description: string; version: string }>> {
  try {
    const response = await fetch(`${NPM_SEARCH_API}?text=${encodeURIComponent(query)}&size=20`);
    if (!response.ok) return [];
    
    const data = await response.json();
    return data.objects.map((obj: any) => ({
      name: obj.package.name,
      description: obj.package.description,
      version: obj.package.version,
    }));
  } catch (error) {
    console.error('Error searching packages:', error);
    return [];
  }
}