import React from 'react';
import type { BreadcrumbItem } from '../data/structuredData';
import { generateBreadcrumbSchema } from '../data/structuredData';
import { buildJsonLd } from '../utils/buildJsonLd';

interface BreadcrumbSchemaProps {
  items: BreadcrumbItem[];
}

export const BreadcrumbSchema: React.FC<BreadcrumbSchemaProps> = ({ items }) => {
  if (!items || items.length === 0) return null;

  const schema = generateBreadcrumbSchema(items);

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: buildJsonLd(schema) }}
    />
  );
};
