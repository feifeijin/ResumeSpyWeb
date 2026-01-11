# ResumeSpyWeb - Front-End

ResumeSpyWeb is the front-end of the Resume Manager platform, built with Vue 3, Vuetify, and Vite. It allows users to interact with resumes, manage multiple versions, and create customized resumes for job descriptions (JDs).

## Features

- **Resume Display**: View and manage resumes in multiple languages.
- **Resume Creation**: Create and customize resumes tailored to job descriptions.
- **Version Control Interface**: Compare different versions of resumes and revert to previous versions.
- **Multi-language Support**: Switch between different languages for resume management.
- **End-to-End Testing**: Full testing using Cypress.

## Technology Stack

- **Front-End**: Vue 3 with Vuetify
- **State Management**: Pinia
- **Routing**: Vue Router
- **API Communication**: Axios
- **Build Tool**: Vite
- **TypeScript**: For type safety
- **Testing**: Vitest (unit tests), Cypress (e2e tests)

## CI/CD Overview

This repository uses **GitHub Actions** for Continuous Integration (CI) and **Vercel** for Continuous Deployment (CD).

---

### Architecture

- **CI**: GitHub Actions validates code quality (lint, type-check, build, tests)
- **CD**: Vercel handles all deployments automatically via GitHub integration

---

## Continuous Integration (CI)

CI runs automatically on:
- **Pull Requests**: Validates code quality before merging
- **Push to master/main/release**: Ensures production-ready code

### CI Pipeline Steps:
1. **Checkout** - Clone the repository
2. **Install Dependencies** - Run `npm ci`
3. **Lint** - Check code style with ESLint
4. **Type Check** - Validate TypeScript types
5. **Build** - Build the production bundle
6. **Unit Tests** - Run Vitest tests

**Note:** CI focuses on validation only. Deployment is handled by Vercel (see CD section below).

---

### Continuous Deployment (CD) with Vercel

This project uses **Vercel** for continuous deployment. Vercel automatically deploys the application based on Git branch activity.

#### Deployment Environments

| Environment | Branch | API Endpoint | Vercel Type | Auto-Deploy |
|-------------|--------|--------------|-------------|-------------|
| **Production** | `master` | PROD API | Production | ✅ Yes |
| **Preview** | PR branches | DEV API | Preview | ✅ Yes |
| **Local Dev** | - | Local backend | - | Manual |

#### How It Works

##### 1️⃣ Pull Request Preview Deployments

When you **create or update a Pull Request**:

1. **GitHub CI** runs automatically:
   - Installs dependencies
   - Runs linting
   - Runs type checking
   - Builds the application
   - Runs unit tests

2. **Vercel** automatically:
   - Detects the PR
   - Builds the application using `.env.development` (DEV API)
   - Generates a **unique preview URL** (e.g., `https://resumespyweb-pr-123.vercel.app`)
   - Posts the preview URL as a comment on the PR
   - Updates the preview on every new commit to the PR

3. **You can**:
   - Click the preview URL to test changes in a real environment
   - Share the preview URL with team members for review
   - Verify that the DEV API integration works correctly

**Preview deployments use the DEV API** configured in `.env.development`.

##### 2️⃣ Production Deployment

When you **merge a PR to `master`**:

1. **GitHub CI** validates the code again on `master`

2. **Vercel** automatically:
   - Detects the push to `master`
   - Builds the application using `.env.production` (PROD API)
   - Deploys to the **production domain** (e.g., `https://resumespy.com` or `https://resumespyweb.vercel.app`)
   - The deployment typically completes in 1-2 minutes

**Production deployments use the PROD API** configured in `.env.production`.

---

### Vercel Setup Instructions

#### Initial Setup (One-Time)

1. **Install Vercel GitHub App**:
   - Go to [Vercel](https://vercel.com)
   - Sign in with your GitHub account
   - Click "Import Project"
   - Select `feifeijin/ResumeSpyWeb` repository
   - Vercel will auto-detect Vite settings from `vercel.json`

2. **Configure Production Branch**:
   - In Vercel Dashboard → Project Settings → Git
   - Set Production Branch to: `master`

3. **Configure Environment Variables in Vercel** (if needed):
   - Go to Vercel Dashboard → Your Project → Settings → Environment Variables
   - For **Production**, set:
     - `VITE_API_BASE_URL` = `https://your-actual-prod-api.com/`
   - For **Preview**, set:
     - `VITE_API_BASE_URL` = `https://your-actual-dev-api.com/`
   
   > **Note**: Environment variables in Vercel **override** values in `.env.development` and `.env.production` if set. You can use Vercel environment variables for sensitive or environment-specific URLs, or update the `.env.*` files directly.

4. **Configure Production Domain** (optional):
   - Go to Vercel Dashboard → Your Project → Settings → Domains
   - Add your custom domain (e.g., `app.resumespy.com`)
   - Vercel provides automatic HTTPS certificates

---

### Verifying Deployments

#### Preview Deployment Verification

1. Open the PR on GitHub
2. Wait for the Vercel bot to comment with the preview URL
3. Click the preview URL
4. Open browser DevTools → Network tab
5. Verify API calls go to the **DEV API** endpoint
6. Test the application functionality

#### Production Deployment Verification

1. After merging to `master`, go to the Vercel Dashboard
2. Wait for the deployment to complete (watch the Deployments tab)
3. Visit your production URL
4. Open browser DevTools → Network tab
5. Verify API calls go to the **PROD API** endpoint
6. Perform smoke tests on critical features

---

### Environment Configuration Files

| File | Purpose | Committed? | Used By |
|------|---------|-----------|---------|
| `.env.development` | DEV API configuration | ✅ Yes | PR previews & local dev |
| `.env.production` | PROD API configuration | ✅ Yes | Production deployments |
| `.env.local` | Local overrides (optional) | ❌ No (gitignored) | Local development only |
| `.env.example` | Template for contributors | ✅ Yes | Documentation |

#### How Environment Variables Work

The application reads `VITE_API_BASE_URL` from `import.meta.env` (see `src/api/api.ts`).

Vite loads environment files in this priority order (higher priority = loaded last):
1. `.env` (always loaded)
2. `.env.local` (local overrides, not committed)
3. `.env.[mode]` (e.g., `.env.development` or `.env.production`)
4. `.env.[mode].local` (local overrides for specific mode, not committed)

**Vercel automatically uses:**
- `.env.development` for PR preview builds
- `.env.production` for production builds from `master`

---

### Rollback Strategy

If a production deployment has issues:

**Option 1: Instant Rollback (Vercel Dashboard)**
1. Go to Vercel Dashboard → Deployments
2. Find the last stable deployment
3. Click "..." → "Promote to Production"
4. The rollback is instant (no rebuild needed)

**Option 2: Git Rollback**
1. Revert the problematic commit on `master`
2. Push to `master`
3. Vercel will automatically redeploy
4. This triggers a new build (takes 1-2 minutes)

---

### Troubleshooting

#### Preview Deployment Not Created
- Check that the Vercel GitHub App has access to the repository
- Verify Vercel project settings include the correct branch configuration
- Check Vercel deployment logs for build errors

#### Wrong API Being Used
- Verify `.env.development` and `.env.production` have correct values
- Check Vercel environment variable overrides in the dashboard (Settings → Environment Variables)
- Inspect network requests in browser DevTools to confirm the API base URL
- Check `src/api/api.ts` to see how the environment variable is read

#### Build Fails on Vercel
- Check Vercel deployment logs for specific error messages
- Ensure `package.json` scripts are correct (`build`, `build-only`)
- Verify that all dependencies are listed in `package.json`
- Test the build locally: `npm run build`
- Verify `vercel.json` configuration is valid

#### Environment Variable Not Loading
- Ensure the variable name starts with `VITE_` (Vite requirement)
- Check that the `.env.*` file is committed to the repository
- Verify the file is in the repository root (not in a subdirectory)
- Restart your local dev server after changing environment files

---

### CI vs CD Separation

- **CI (GitHub Actions)**: Validates code quality (lint, type-check, test, build)
- **CD (Vercel)**: Handles deployment to hosting infrastructure

**Important:** GitHub Actions does **NOT** deploy - it only validates.

This separation ensures:
- ✅ Fast CI feedback (no deployment overhead)
- ✅ Reliable deployments managed by Vercel's infrastructure
- ✅ Clear separation of concerns
- ✅ Easy rollbacks via Vercel dashboard

---

### How Production Deployments Work

When code is merged to `main`:

- Deployment is handled by Vercel (not GitHub Actions)
- E2E tests are not run in CI (require running backend)
- CI focuses on validation; CD is platform-specific
- Environment files (`.env.development`, `.env.production`) are committed to the repository
