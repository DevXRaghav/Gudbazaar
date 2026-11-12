import React, { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  canonicalPath?: string;
  ogImage?: string;
  schema?: Record<string, unknown>;
}

export const SEOHead: React.FC<SEOHeadProps> = ({
  title = 'Gudbazaar — Pure Jaggery & Natural Sweetness',
  description = 'Discover authentic traditional Indian jaggery. Shop handcrafted jaggery blocks, pure gud powder, cubes, and liquid kakvi direct to your doorstep.',
  canonicalPath = '',
  ogImage = '/images/hero_jaggery_display.jpg',
  schema,
}) => {
  useEffect(() => {
    // Update Title
    document.title = title.includes('Gudbazaar') ? title : `${title} | Gudbazaar`;

    // Update Meta Description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // Update OG tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute('content', title);

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.setAttribute('content', description);

    const ogImg = document.querySelector('meta[property="og:image"]');
    if (ogImg) ogImg.setAttribute('content', ogImage);

    // Update Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `https://gudbazaar.com${canonicalPath}`);

    // Update Dynamic JSON-LD if provided
    let scriptTag = document.getElementById('dynamic-json-ld') as HTMLScriptElement | null;
    if (schema) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = 'dynamic-json-ld';
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(schema);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [title, description, canonicalPath, ogImage, schema]);

  return null;
};
