import React, { useEffect } from 'react';
import type { PageSeoItem } from '../data/pageSeo';
import { pageSeoData } from '../data/pageSeo';
import { buildCanonical } from '../utils/buildCanonical';
import { buildJsonLd } from '../utils/buildJsonLd';
import type { BreadcrumbItem, FAQItem } from '../data/structuredData';
import { 
  generateOrganizationSchema, 
  generateWebsiteSchema, 
  generateSoftwareApplicationSchema, 
  generateBreadcrumbSchema,
  generateFaqSchema
} from '../data/structuredData';
import { siteConfig } from '../config/siteConfig';
import { seoConfig } from '../config/seoConfig';

export interface SEOProps {
  page?: keyof typeof pageSeoData | string;
  title?: string;
  description?: string;
  canonicalPath?: string;
  robots?: string;
  keywords?: string[];
  ogType?: 'website' | 'article';
  ogImage?: string;
  breadcrumbs?: BreadcrumbItem[];
  faqItems?: FAQItem[];
  includeOrganizationSchema?: boolean;
  includeWebsiteSchema?: boolean;
  includeSoftwareAppSchema?: boolean;
}

/**
 * Helper to update or create a <meta> tag in the document head
 */
function setMetaTag(attributeName: 'name' | 'property', attributeValue: string, content: string) {
  let element = document.querySelector(`meta[${attributeName}="${attributeValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attributeName, attributeValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

/**
 * Helper to update or create a <link> tag in the document head
 */
function setLinkTag(rel: string, href: string) {
  let element = document.querySelector(`link[rel="${rel}"]`);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

export const SEO: React.FC<SEOProps> = ({
  page,
  title: propTitle,
  description: propDescription,
  canonicalPath: propCanonicalPath,
  robots: propRobots,
  keywords: propKeywords,
  ogType: propOgType,
  ogImage: propOgImage,
  breadcrumbs: propBreadcrumbs,
  faqItems: propFaqItems,
  includeOrganizationSchema,
  includeWebsiteSchema,
  includeSoftwareAppSchema,
}) => {
  const pageData: Partial<PageSeoItem> = (page && pageSeoData[page]) || {};

  const title = propTitle || pageData.title || seoConfig.defaultTitle;
  const description = propDescription || pageData.description || seoConfig.defaultDescription;
  const canonicalPath = propCanonicalPath || pageData.path || '/';
  const canonicalUrl = buildCanonical(canonicalPath);
  const robots = propRobots || pageData.robots || seoConfig.defaultRobots;
  const keywords = propKeywords || pageData.keywords || [];
  const ogType = propOgType || pageData.ogType || 'website';
  
  const rawOgImage = propOgImage || pageData.ogImage || siteConfig.assets.ogImage;
  const ogImage = rawOgImage.startsWith('http')
    ? rawOgImage
    : `${buildCanonical('/')}${rawOgImage.replace(/^\//, '')}`;

  const breadcrumbs = propBreadcrumbs || pageData.breadcrumbs;

  const showOrg = includeOrganizationSchema ?? pageData.schemas?.includes('organization');
  const showWeb = includeWebsiteSchema ?? pageData.schemas?.includes('website');
  const showApp = includeSoftwareAppSchema ?? pageData.schemas?.includes('softwareApplication');
  const showBreadcrumbs = breadcrumbs && breadcrumbs.length > 0;
  const showFaq = propFaqItems && propFaqItems.length > 0;

  // Update Head tags synchronously on client
  useEffect(() => {
    // Document Title
    document.title = title;

    // Standard Meta
    setMetaTag('name', 'description', description);
    setMetaTag('name', 'robots', robots);
    setMetaTag('name', 'author', siteConfig.name);
    setMetaTag('name', 'application-name', siteConfig.name);
    setMetaTag('name', 'theme-color', siteConfig.themeColor);

    if (keywords.length > 0) {
      setMetaTag('name', 'keywords', keywords.join(', '));
    }

    // Canonical link
    setLinkTag('canonical', canonicalUrl);

    // Open Graph
    setMetaTag('property', 'og:site_name', siteConfig.name);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:locale', siteConfig.locale);

    // Twitter Card
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', title);
    setMetaTag('name', 'twitter:description', description);
    setMetaTag('name', 'twitter:image', ogImage);
  }, [title, description, canonicalUrl, robots, keywords, ogType, ogImage]);

  return (
    <>
      {/* Organization Schema */}
      {showOrg && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: buildJsonLd(generateOrganizationSchema()) }}
        />
      )}

      {/* WebSite Schema */}
      {showWeb && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: buildJsonLd(generateWebsiteSchema()) }}
        />
      )}

      {/* SoftwareApplication Schema */}
      {showApp && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: buildJsonLd(generateSoftwareApplicationSchema()) }}
        />
      )}

      {/* BreadcrumbList Schema */}
      {showBreadcrumbs && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: buildJsonLd(generateBreadcrumbSchema(breadcrumbs)) }}
        />
      )}

      {/* FAQPage Schema */}
      {showFaq && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: buildJsonLd(generateFaqSchema(propFaqItems)) }}
        />
      )}
    </>
  );
};
