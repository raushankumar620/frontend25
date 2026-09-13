import React from 'react';
import { generateSoftwareApplicationSchema } from '../data/structuredData';
import { buildJsonLd } from '../utils/buildJsonLd';

export const SoftwareApplicationSchema: React.FC = () => {
  const schema = generateSoftwareApplicationSchema();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: buildJsonLd(schema) }}
    />
  );
};
