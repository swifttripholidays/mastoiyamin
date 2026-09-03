const LOCAL_SITE_URL = 'http://localhost:3000';

/**
 * Returns a safe absolute site URL for metadata, sitemap and robots.
 * Empty Vercel environment variables are treated as unset.
 */
export function getSiteUrl(): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  const vercelUrl = process.env.VERCEL_URL?.trim();

  const candidate = configured || (vercelUrl ? `https://${vercelUrl}` : LOCAL_SITE_URL);

  try {
    return new URL(candidate).origin;
  } catch {
    return LOCAL_SITE_URL;
  }
}
