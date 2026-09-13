/**
 * WhatsAppMSG Global SEO Directives & Meta Defaults
 */

import { siteConfig } from './siteConfig';
import { socialConfig } from './socialConfig';

export const seoConfig = {
  defaultTitle: `${siteConfig.name} — WhatsApp Business API & Messaging Platform`,
  titleTemplate: `%s | ${siteConfig.name}`,
  defaultDescription: siteConfig.description,
  defaultRobots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  noIndexRobots: 'noindex, nofollow',
  author: siteConfig.name,
  applicationName: siteConfig.name,
  generator: 'WhatsAppMSG Engine',
  themeColor: siteConfig.themeColor,
  openGraph: {
    ...socialConfig.openGraph,
    defaultImage: siteConfig.assets.ogImage,
    imageWidth: 1200,
    imageHeight: 630,
    imageAlt: `${siteConfig.name} — Enterprise WhatsApp Business API & Messaging Platform`,
  },
  twitter: {
    ...socialConfig.twitter,
    defaultImage: siteConfig.assets.twitterImage,
  },
} as const;

export type SeoConfig = typeof seoConfig;
