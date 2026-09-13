/**
 * Structured Data Generators (JSON-LD)
 * Schema.org compliant structured data builders without fabricated or unsupported fields.
 */

import { siteConfig } from '../config/siteConfig';
import { socialConfig } from '../config/socialConfig';
import { buildCanonical } from '../utils/buildCanonical';

/**
 * Organization Schema
 * Adheres strictly to verified brand identity.
 */
export function generateOrganizationSchema() {
  const baseUrl = buildCanonical('/');
  const logoUrl = siteConfig.assets.logo.startsWith('http')
    ? siteConfig.assets.logo
    : `${baseUrl}${siteConfig.assets.logo.replace(/^\//, '')}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteConfig.name,
    legalName: siteConfig.legalName,
    url: baseUrl,
    logo: logoUrl,
    email: siteConfig.officialEmail,
    sameAs: socialConfig.sameAs,
    description: siteConfig.description,
  };
}

/**
 * WebSite Schema
 * Represents the official website entity.
 */
export function generateWebsiteSchema() {
  const baseUrl = buildCanonical('/');

  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: baseUrl,
    description: siteConfig.description,
    inLanguage: siteConfig.locale,
  };
}

/**
 * SoftwareApplication Schema
 * Represents WhatsAppMSG SaaS product.
 */
export function generateSoftwareApplicationSchema() {
  const baseUrl = buildCanonical('/');

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: siteConfig.name,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All (Cloud SaaS / Web Browser)',
    url: baseUrl,
    description: siteConfig.description,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: '14-Day Free Trial Available',
    },
  };
}

/**
 * BreadcrumbList Schema
 */
export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: buildCanonical(item.path),
    })),
  };
}

/**
 * FAQPage Schema
 */
export interface FAQItem {
  question: string;
  answer: string;
}

export function generateFaqSchema(items: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}
