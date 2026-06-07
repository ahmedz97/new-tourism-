/**
 * Maps Angular route segments to CMS page keys (GET /pages?includes=seo).
 * Add a line here only when the route name differs from the CMS key.
 */
export const PAGE_SEO_ROUTE_KEYS: Record<string, string> = {
  about: 'about-us',
  blog: 'blog',
  contact: 'contact-us',
  faq: 'faqs',
  'terms-and-conditions': 'terms-and-conditions',
};

export function resolveCmsPageKey(routePath: string): string {
  return PAGE_SEO_ROUTE_KEYS[routePath] ?? routePath;
}
