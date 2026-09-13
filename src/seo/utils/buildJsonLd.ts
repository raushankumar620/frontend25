/**
 * JSON-LD Serialization Utility
 * Safely stringifies structured data without XSS vulnerabilities.
 */

export function buildJsonLd<T extends Record<string, unknown>>(data: T): string {
  try {
    return JSON.stringify(data, null, 2).replace(/</g, '\\u003c');
  } catch (err) {
    console.error('[WhatsAppMSG SEO] Failed to serialize JSON-LD payload:', err);
    return '{}';
  }
}
