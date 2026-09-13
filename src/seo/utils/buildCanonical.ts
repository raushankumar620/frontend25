/**
 * Canonical URL Normalization Engine
 * Ensures consistent, absolute canonical URLs across development, staging, and production.
 */

import { siteConfig } from '../config/siteConfig';

/**
 * Resolves the active base URL priority:
 * 1. import.meta.env.VITE_SITE_URL
 * 2. window.location.origin (if available in browser runtime)
 * 3. siteConfig.url (fallback)
 */
export function getBaseUrl(): string {
  const envUrl = import.meta.env.VITE_SITE_URL as string | undefined;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim() !== '') {
    return envUrl.trim().replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined' && window.location && window.location.origin) {
    return window.location.origin.replace(/\/+$/, '');
  }

  return siteConfig.url.replace(/\/+$/, '');
}

/**
 * Builds a clean, absolute canonical URL for any route path.
 *
 * @param path - Route path (e.g., '/features', '/pricing', or '')
 * @returns Fully-qualified absolute canonical URL without trailing slashes (unless root '/')
 */
export function buildCanonical(path: string = '/'): string {
  const baseUrl = getBaseUrl();
  
  if (!path || path === '/' || path === '') {
    return `${baseUrl}/`;
  }

  // Strip leading/trailing slashes and sanitize query strings/hashes
  const cleanPath = path
    .split('?')[0]
    .split('#')[0]
    .replace(/^\/+/, '')
    .replace(/\/+$/, '');

  if (!cleanPath) {
    return `${baseUrl}/`;
  }

  return `${baseUrl}/${cleanPath}`;
}
