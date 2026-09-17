/**
 * WhatsAppMSG Centralized Page SEO Configuration
 * Contains accurate, unique titles, descriptions, canonical paths, and schema requirements.
 */

import { keywordClusters } from './keywords';

export interface PageSeoItem {
  id: string;
  title: string;
  description: string;
  path: string;
  robots?: string;
  keywords?: string[];
  ogType?: 'website' | 'article';
  ogImage?: string;
  breadcrumbs?: Array<{ name: string; path: string }>;
  schemas?: Array<'organization' | 'website' | 'softwareApplication' | 'breadcrumbs' | 'faq'>;
}

export const pageSeoData: Record<string, PageSeoItem> = {
  home: {
    id: 'home',
    title: 'WhatsAppMSG — WhatsApp Business API & Messaging Platform',
    description:
      'WhatsAppMSG is a powerful WhatsApp Business API platform for messaging, automation, campaigns, shared inbox, developer APIs and AI-powered customer support.',
    path: '/',
    robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    keywords: [
      ...keywordClusters.primaryBrand,
      ...keywordClusters.corePlatform,
      ...keywordClusters.automationAndAI,
    ],
    ogType: 'website',
    schemas: ['organization', 'website', 'softwareApplication'],
  },
  features: {
    id: 'features',
    title: 'WhatsApp API Features & Business Messaging Tools | WhatsAppMSG',
    description:
      'Explore WhatsAppMSG features: direct Meta Cloud API integration, domain-trained AI agents, visual workflow automation, multi-agent shared inbox, and campaign broadcasts.',
    path: '/features',
    keywords: [
      ...keywordClusters.corePlatform,
      ...keywordClusters.automationAndAI,
      ...keywordClusters.inboxAndCampaigns,
      ...keywordClusters.developers,
    ],
    ogType: 'website',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Features', path: '/features' },
    ],
    schemas: ['breadcrumbs'],
  },
  solutions: {
    id: 'solutions',
    title: 'WhatsApp Business Messaging Solutions | WhatsAppMSG',
    description:
      'Enterprise WhatsApp solutions for E-Commerce, FinTech, Healthcare, Real Estate, Education, and Professional Services with WhatsAppMSG.',
    path: '/solutions',
    keywords: [
      'WhatsApp Business solutions',
      'WhatsApp eCommerce CRM',
      'WhatsApp FinTech OTPs',
      'WhatsApp healthcare alerts',
      'enterprise WhatsApp messaging',
    ],
    ogType: 'website',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Solutions', path: '/solutions' },
    ],
    schemas: ['breadcrumbs'],
  },
  pricing: {
    id: 'pricing',
    title: 'WhatsApp API Pricing & Plans | WhatsAppMSG',
    description:
      'Transparent WhatsApp API pricing with direct Meta Cloud API rates, zero markup fees, flexible team seat scaling, and 14-day free trial.',
    path: '/pricing',
    keywords: [
      ...keywordClusters.pricing,
      'WhatsApp Business API costs',
      'Meta conversation pricing',
      'WhatsApp SaaS pricing',
    ],
    ogType: 'website',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Pricing', path: '/pricing' },
    ],
    schemas: ['breadcrumbs', 'faq'],
  },
  about: {
    id: 'about',
    title: 'About WhatsAppMSG — WhatsApp Business Messaging Platform',
    description:
      'Learn about WhatsAppMSG, our mission to pioneer conversational commerce, our direct Meta Cloud API integration, and enterprise-grade messaging infrastructure.',
    path: '/about',
    keywords: [
      ...keywordClusters.primaryBrand,
      'About WhatsAppMSG',
      'Meta Business Solution Partner',
      'Enterprise WhatsApp messaging infrastructure',
    ],
    ogType: 'website',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'About Us', path: '/about' },
    ],
    schemas: ['breadcrumbs'],
  },
  contact: {
    id: 'contact',
    title: 'Contact WhatsAppMSG — WhatsApp API & Business Messaging',
    description:
      'Connect with WhatsAppMSG enterprise specialists for custom high-volume pricing, Meta Cloud API onboarding, developer integrations, and AI workflow support.',
    path: '/contact',
    keywords: [
      'Contact WhatsAppMSG',
      'WhatsApp API sales',
      'WhatsApp Enterprise support',
      'Meta Cloud API consultation',
    ],
    ogType: 'website',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Contact Sales', path: '/contact' },
    ],
    schemas: ['breadcrumbs'],
  },
  privacy: {
    id: 'privacy',
    title: 'Privacy Policy — Data Security & Meta Cloud API Compliance | WhatsAppMSG',
    description:
      'Read the WhatsAppMSG Privacy Policy to understand how we protect customer data, maintain WhatsApp Cloud API security, and uphold GDPR & CCPA privacy standards.',
    path: '/privacy',
    keywords: [
      'WhatsAppMSG privacy policy',
      'WhatsApp Cloud API data security',
      'GDPR WhatsApp compliance',
      'Meta Business API data handling',
    ],
    ogType: 'website',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Privacy Policy', path: '/privacy' },
    ],
    schemas: ['breadcrumbs'],
  },
  terms: {
    id: 'terms',
    title: 'Terms of Service — Platform Usage & WhatsApp Messaging Agreement | WhatsAppMSG',
    description:
      'Review WhatsAppMSG Terms of Service, acceptable messaging standards, Meta Cloud API policies, subscription terms, and enterprise SLA commitments.',
    path: '/terms',
    keywords: [
      'WhatsAppMSG terms of service',
      'WhatsApp Business API terms',
      'WhatsApp marketing acceptable use policy',
      'Meta Cloud SLA',
    ],
    ogType: 'website',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Terms of Service', path: '/terms' },
    ],
    schemas: ['breadcrumbs'],
  },
  security: {
    id: 'security',
    title: 'Enterprise Security & Compliance — Architecture & Encryption | WhatsAppMSG',
    description:
      'Discover how WhatsAppMSG protects your enterprise messaging with TLS 1.3 encryption, SOC 2 aligned controls, 99.99% uptime SLA, and direct Meta Cloud infrastructure.',
    path: '/security',
    keywords: [
      'WhatsAppMSG security',
      'WhatsApp API encryption',
      'Meta Cloud API security standards',
      'enterprise messaging compliance',
    ],
    ogType: 'website',
    breadcrumbs: [
      { name: 'Home', path: '/' },
      { name: 'Security', path: '/security' },
    ],
    schemas: ['breadcrumbs'],
  },
  notFound: {
    id: 'notFound',
    title: 'Page Not Found | WhatsAppMSG',
    description: 'The requested page does not exist on WhatsAppMSG. Return to the homepage or browse our solutions.',
    path: '/404',
    robots: 'noindex, nofollow',
  },
};
