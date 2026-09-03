# Yamin Mastoi — Midnight Maroon Portfolio

A premium animated portfolio, journal and private creator studio for Yamin Mastoi.

## Vercel architecture

This version is prepared for a standard Vercel deployment using:

- Next.js App Router
- Neon Postgres for posts, inbox messages and live-chat data
- Vercel Blob for uploaded media
- A signed HTTP-only admin session protected by `ADMIN_ACCESS_CODE` + `ADMIN_SESSION_SECRET`

The original Cloudflare D1/R2 and Vinext-only bindings have been removed from the application path. This avoids the missing `.openai/hosting.json` build dependency and makes the server routes run on Vercel's Node.js runtime.

## Local setup

1. Install Node.js 22.13+.
2. Run `npm install`.
3. Copy `.env.example` to `.env.local`.
4. Set `DATABASE_URL`, `ADMIN_ACCESS_CODE`, `ADMIN_SESSION_SECRET`, and `NEXT_PUBLIC_SITE_URL`.
5. Connect a Neon database and run `npm run db:migrate`.
6. Run `npm run dev`.

## Vercel setup

1. Import the repository into Vercel.
2. Use the default Next.js framework detection. Build command is `npm run build`.
3. Add a Neon Postgres integration/storage connection and make sure `DATABASE_URL` is available to the deployment.
4. Add a Vercel Blob store so `BLOB_READ_WRITE_TOKEN` is available.
5. Add `ADMIN_ACCESS_CODE`, `ADMIN_SESSION_SECRET`, and `NEXT_PUBLIC_SITE_URL` to Vercel Environment Variables.
6. Redeploy.
7. Open `/admin` and unlock the creator studio with the private access code.
8. Run the database migration once with `npm run db:migrate` from a local shell using the same `DATABASE_URL`, or execute `drizzle/0000_vercel_portfolio.sql` in the Neon SQL editor.

## Media uploads

The admin upload endpoint accepts JPG, PNG, WebP, GIF and MP4 files up to 4 MB. The smaller limit is intentional because Vercel-hosted server uploads are limited to a 4.5 MB request body; larger media should use direct-to-Blob client uploads later.

## Existing features

- Cinematic portfolio and animated Three.js sections
- Responsive journal and post pages
- Create, edit, publish and delete posts
- Vercel Blob media uploads
- Contact inbox
- Named visitor chat with local concierge replies and human takeover
- Live-chat management in the creator studio
- Social caption composer
- SEO, sitemap, robots and social-preview artwork
- Reduced-motion and mobile layouts

## Visual refresh
The homepage navbar, hero and footer have been refreshed with an editorial portfolio direction inspired by the supplied Dribbble references. The supplied Yamin Mastoi portrait is used in the hero, and the site-wide palette is based on:
`#223030` `#523D35` `#959D90` `#BBA58F` `#E8D9CD` `#EFEFE9`

For local setup:
```bash
npm install
npm run dev
```
