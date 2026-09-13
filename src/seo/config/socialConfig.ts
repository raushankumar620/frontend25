/**
 * WhatsAppMSG Official Social Configuration
 * Only official verified profiles are declared here.
 */

export const socialConfig = {
  instagram: {
    name: 'Instagram',
    url: 'https://www.instagram.com/whatsapmsg/',
    handle: 'whatsapmsg',
  },
  sameAs: [
    'https://www.instagram.com/whatsapmsg/',
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
