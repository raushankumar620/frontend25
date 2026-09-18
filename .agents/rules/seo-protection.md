# SEO, Favicon & Brand Identity Protection Rules

## Invariant: Zero Removal of SEO Content
Chahe koi bhi task ho (refactoring, adding new UI, fixing bugs, cleanups):
1. **Never delete, modify, or empty SEO assets**:
   - `public/favicon.png` (512x512 square official WhatsAppMSG brand logo).
   - `public/robots.txt`
   - `public/sitemap.xml`
   - `public/site.webmanifest` & `public/manifest.json`
   - `public/llms.txt`
   - `public/images/seo/*`
   - `src/seo/*`
2. **Never alter or remove index.html SEO and Verification tags**:
   - `<meta name="gridinsoft-key" ... />`
   - Single favicon declaration: `<link rel="icon" type="image/png" href="/favicon.png" />`
   - Open Graph tags (`og:title`, `og:image`, `og:url`, `og:logo`, etc.)
   - Twitter Cards
   - JSON-LD Structured Data (`Organization`, `WebSite`, `SoftwareApplication`)
   - Pre-hydration semantic crawler fallback in `#root`.
3. **Favicon Strict Standard**:
   - Do NOT add multiple or duplicate `<link rel="icon">` tags.
   - Do NOT replace `favicon.png` with generic WhatsApp phone receiver icons.
