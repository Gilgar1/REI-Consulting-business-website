/**
 * Builds a srcset string for responsive images
 */
export function buildSrcSet(baseUrl: string, widths: number[] = [300, 600, 900, 1200], format = 'webp'): string {
  return widths
    .map(width => `${baseUrl}?w=${width}&format=${format} ${width}w`)
    .join(', ');
}

/**
 * Replaces or adds a URL parameter
 */
export function replaceOrAddParam(url: string, param: string, value: string): string {
  const urlObj = new URL(url, window.location.origin);
  urlObj.searchParams.set(param, value);
  return urlObj.pathname + urlObj.search;
}
