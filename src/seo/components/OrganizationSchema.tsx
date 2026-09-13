import React from 'react';
import { generateOrganizationSchema } from '../data/structuredData';
import { buildJsonLd } from '../utils/buildJsonLd';

export const OrganizationSchema: React.FC = () => {
  const schema = generateOrganizationSchema();

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: buildJsonLd(schema) }}
    />
  );
};
