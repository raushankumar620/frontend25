import React from 'react';
import type { MetaOptions } from '../utils/buildMeta';
import { buildMetaDescriptors } from '../utils/buildMeta';

export interface SocialMetaProps extends MetaOptions {}

export const SocialMeta: React.FC<SocialMetaProps> = (props) => {
  const descriptors = buildMetaDescriptors(props);

  return (
    <>
      {descriptors.meta.map((m, idx) => {
        if (m.name) {
          return <meta key={`meta-name-${m.name}-${idx}`} name={m.name} content={m.content} />;
        }
        if (m.property) {
          return <meta key={`meta-prop-${m.property}-${idx}`} property={m.property} content={m.content} />;
        }
        return null;
      })}
      {descriptors.link.map((l, idx) => (
        <link key={`link-rel-${l.rel}-${idx}`} rel={l.rel} href={l.href} />
      ))}
    </>
  );
};
