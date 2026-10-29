# Frontend — Exleyder.com

Angular portfolio application deployed to Vercel. This directory is the Vercel project root.

## Requirements

- Node.js: use `.nvmrc` (`24.19.0`). Angular 22.2 supports Node.js 24.15.0 and newer within the 24.x line. Vercel should use Node.js 24.x as well.
- npm: use the lockfile with `npm ci`.

## Commands

```bash
npm ci
cp .env.example .env
npm start
npm run test:contact
npm run build
```

`npm start` launches Angular's development server. The local SSR entry is `src/server.ts`, which loads local environment variables and dispatches contact requests to `src/server/contact-handler.ts`. Vercel's production endpoint is `api/contact.js`; local and production handlers must remain behaviorally aligned.

## Environment

Set `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, and `CONTACT_FROM_EMAIL` in `.env` for local backend execution. In Vercel, create the same keys under **Project → Settings → Environment Variables** for each environment that should send messages. Vercel does not automatically read the local `.env` file. Only use a sender address whose domain has been verified in Resend.

## Vercel configuration

- Root Directory: `Frontend` (the repository subdirectory containing this file).
- Framework Preset: Angular.
- Install Command: `npm ci`.
- Build Command: `npm run build`.
- Output Directory: `dist/FRONT-END/browser`.

The Vercel function is deployed from `api/contact.js`. After changing environment variables, trigger a new deployment; environment changes are not retroactive to already-created deployments.

## Contact endpoint

`POST /api/contact` accepts JSON with `clientName`, `clientEmail`, `serviceType`, `projectMessage`, and an optional `website` honeypot field. Validation is repeated on the server because browser-side form validation is not a security boundary.

Run `npm run test:contact` to test method handling, JSON content-type enforcement, input validation, honeypot behavior, payload construction, HTML escaping, provider failures, and missing configuration. The tests mock Resend and do not send an actual email.



Waiting next deployment