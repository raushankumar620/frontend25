/**
 * WhatsAppMSG Official Social Configuration
 * Verified profiles: LinkedIn, Instagram, YouTube, Facebook.
 */

export const socialConfig = {
  linkedin: {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/company/whatsapmsg/',
    handle: 'WhatsAppMSG Official',
  },
  instagram: {
    name: 'Instagram',
    url: 'https://www.instagram.com/wmsgplatform/',
    handle: '@wmsgplatform',
  },
  youtube: {
    name: 'YouTube',
    url: 'https://www.youtube.com/@whatsapmsg',
    handle: '@whatsapmsg',
  },
  facebook: {
    name: 'Facebook',
    url: 'https://www.facebook.com/whatsapmsg',
    handle: 'WhatsAppMSG Official',
  },
  sameAs: [
    'https://www.linkedin.com/company/whatsapmsg/',
    'https://www.instagram.com/wmsgplatform/',
    'https://www.youtube.com/@whatsapmsg',
    'https://www.facebook.com/whatsapmsg',
  ],
  openGraph: {
    type: 'website',
    siteName: 'WhatsAppMSG',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
  },
} as const;

export type SocialConfig = typeof socialConfig;
