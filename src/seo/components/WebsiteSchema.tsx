import React from 'react';
import { generateWebsiteSchema } from '../data/structuredData';
import { buildJsonLd } from '../utils/buildJsonLd';

export const WebsiteSchema: React.FC = () => {
  const schema = generateWebsiteSchema();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: buildJsonLd(schema) }}
    />
  );
};
