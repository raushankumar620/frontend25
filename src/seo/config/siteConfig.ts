/**
 * WhatsAppMSG Enterprise Site Configuration
 * Single source of truth for site-wide brand constants, endpoints, and identifiers.
 */

export const siteConfig = {
  name: 'WhatsAppMSG',
  legalName: 'WhatsAppMSG',
  shortName: 'WhatsAppMSG',
  tagline: 'Enterprise WhatsApp Business API, Messaging & AI Platform',
  description:
    'WhatsAppMSG is an enterprise WhatsApp Business messaging and API platform that helps businesses connect WhatsApp, manage conversations, automate messaging, run campaigns, integrate APIs and deploy AI-powered WhatsApp customer support.',
  url: (import.meta.env.VITE_SITE_URL as string) || 'https://whatsappmsg.com',
  officialEmail: 'whatsappmsgofficial@gmail.com',
  locale: 'en_US',
  themeColor: '#006736',
  brandColors: {
    deepGreen: '#013B23',
    darkGreen: '#006736',
    brandGreen: '#05A222',
    brightGreen: '#1CD72C',
    emerald: '#039B56',
    teal: '#07CF74',
    lime: '#6AEB31',
    mainText: '#1F2A26',
    softBackground: '#F6FAF8',
  },
  assets: {
    logo: '/images/logo.png',
    logoSquare: '/images/whatsapplogoshort.png',
    ogImage: '/images/seo/whatsappmsg-og.png',
    twitterImage: '/images/seo/whatsappmsg-twitter.png',
    favicon: '/favicon.png',
  },
} as const;

export type SiteConfig = typeof siteConfig;
