# Frontend — Exleyder.com

Angular portfolio deployed to Vercel. This directory is the Vercel project root.

## Requirements

- Node.js: `.nvmrc` (`24.19.0`).
- npm: use the committed lockfile with `npm ci`.

## Commands

```bash
cp .env.example .env
# Edit .env and set STATIC_FORMS_API_KEY to your actual key from Static Forms.
npm ci
npm start
npm run test:contact
npm run build
```

`npm start` and `npm run build` run `scripts/generate-static-forms-config.cjs` first. The script reads `STATIC_FORMS_API_KEY` from local `.env` or the build environment and generates `src/app/pages/contact/static-forms.config.ts`. The generated file is ignored by Git and must not be edited manually.

## Contact form — Static Forms (active)

The Angular contact form submits directly from the browser to `https://api.staticforms.dev/submit` using the form-specific public key in the endpoint URL (`/submit/<API_KEY>`), sourced from `STATIC_FORMS_API_KEY`. Static Forms delivers notifications to the recipient configured in **Static Forms → Forms → your form → Delivery**. The current recipient should be `orejuelabreiman@gmail.com`.

Set `STATIC_FORMS_API_KEY=sf_...` in the local `.env` and in Vercel under **Project → Settings → Environment Variables** for Production (and Preview if required). The key is a public form identifier and will be embedded in the client bundle; it is not a secret. Do not use this value as `RESEND_API_KEY`.

The form submits the fields `name`, `email`, `serviceType`, `message`, `subject`, and `honeypot`. If Static Forms Form Builder/schema enforcement is enabled, ensure the schema's field names match the fields submitted by this app. The `email` field is used as the reply-to address.

## Legacy Resend endpoint (intentionally retained for now)

`api/contact.js`, `src/server/contact-handler.ts`, their tests, and the `RESEND_API_KEY`, `CONTACT_TO_EMAIL`, and `CONTACT_FROM_EMAIL` variables are intentionally not removed in this migration. The Angular form no longer calls `/api/contact`; it calls Static Forms directly. Keep these legacy files until the new flow is verified. A Static Forms `sf_...` key is not a valid Resend API key. If you want to keep testing the legacy endpoint, restore a valid Resend key in `RESEND_API_KEY` and use a sender authorized by Resend.

## Vercel configuration

- Root Directory: this directory (`Frontend` in the Git repository if this folder is nested under the repository root).
- Framework Preset: Angular.
- Install Command: `npm ci`.
- Build Command: `npm run build` (automatically generates the public Static Forms config first).
- Output Directory: `dist/FRONT-END/browser`, matching the configured Angular browser output.

In Vercel, add `STATIC_FORMS_API_KEY` as an Environment Variable for Production (and Preview if needed), then redeploy. Vercel does not read your local `.env` file.

## Tests

`npm run test:contact` still tests the retained legacy Resend endpoint; it does not send a real email and does not test Static Forms delivery. Verify the active flow by submitting the published form and checking both the Static Forms Inbox and the recipient inbox.


## Static Forms migration status

The Angular contact form now submits directly to Static Forms. The previous Resend endpoint (`api/contact.js`) and local Express handler are intentionally retained for verification and have not been deleted. Configure `STATIC_FORMS_API_KEY` in local `.env` and in Vercel build environment.
