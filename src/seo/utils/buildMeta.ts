/**
 * Meta Tag Utility Functions
 * Creates strongly typed meta descriptor objects for Open Graph, Twitter, and standard HTML meta.
 */

import { siteConfig } from '../config/siteConfig';
import { seoConfig } from '../config/seoConfig';
import { buildCanonical } from './buildCanonical';

export interface MetaOptions {
  title?: string;
  description?: string;
  canonicalPath?: string;
  robots?: string;
  keywords?: string[];
  ogType?: string;
  ogImage?: string;
  ogImageAlt?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  author?: string;
}

export interface MetaTagDescriptor {
  title: string;
  canonicalUrl: string;
  meta: Array<{ name?: string; property?: string; content: string }>;
  link: Array<{ rel: string; href: string }>;
}

export function buildMetaDescriptors(options: MetaOptions = {}): MetaTagDescriptor {
  const title = options.title || seoConfig.defaultTitle;
  const description = options.description || seoConfig.defaultDescription;
  const canonicalUrl = buildCanonical(options.canonicalPath || '/');
  const robots = options.robots || seoConfig.defaultRobots;
  const keywords = options.keywords && options.keywords.length > 0
    ? options.keywords.join(', ')
    : undefined;
  
  const ogImage = options.ogImage
    ? (options.ogImage.startsWith('http') ? options.ogImage : `${buildCanonical('/')}${options.ogImage.replace(/^\//, '')}`)
    : `${buildCanonical('/')}${siteConfig.assets.ogImage.replace(/^\//, '')}`;
  
  const ogImageAlt = options.ogImageAlt || `${siteConfig.name} — ${title}`;

  const metaList: Array<{ name?: string; property?: string; content: string }> = [
    { name: 'description', content: description },
    { name: 'robots', content: robots },
    { name: 'author', content: options.author || siteConfig.name },
    { name: 'application-name', content: siteConfig.name },
    { name: 'theme-color', content: siteConfig.themeColor },

    // Open Graph
    { property: 'og:site_name', content: siteConfig.name },
    { property: 'og:type', content: options.ogType || 'website' },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:url', content: canonicalUrl },
    { property: 'og:image', content: ogImage },
    { property: 'og:image:alt', content: ogImageAlt },
    { property: 'og:locale', content: siteConfig.locale },

    // Twitter
    { name: 'twitter:card', content: options.twitterCard || 'summary_large_image' },
    { name: 'twitter:title', content: title },
    { name: 'twitter:description', content: description },
    { name: 'twitter:image', content: ogImage },
    { name: 'twitter:image:alt', content: ogImageAlt },
  ];

  if (keywords) {
    metaList.push({ name: 'keywords', content: keywords });
  }

  return {
    title,
    canonicalUrl,
    meta: metaList,
    link: [
      { rel: 'canonical', href: canonicalUrl },
    ],
  };
}
