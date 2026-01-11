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

### Architecture

- **CI**: GitHub Actions validates code quality (lint, type-check, build, tests)
- **CD**: Vercel handles all deployments automatically via GitHub integration

---

## Continuous Integration (CI)

CI runs automatically on:
- **Pull Requests** → Validates code quality before merging
- **Push to `main`** → Ensures production-ready code

### CI Pipeline Steps:
1. **Checkout** - Clone the repository
2. **Install Dependencies** - Run `npm ci`
3. **Lint** - Check code style with ESLint
4. **Type Check** - Validate TypeScript types
5. **Build** - Build the production bundle
6. **Unit Tests** - Run Vitest tests

✅ CI does **NOT** deploy - deployment is handled by Vercel.

---

## Continuous Deployment (CD)

### Overview

Vercel automatically deploys the application through its GitHub integration:

| Trigger | Environment | API Used | Deployment Type |
|---------|-------------|----------|----------------|
| **Pull Request** | Preview | DEV API | Preview URL |
| **Push to `main`** | Production | PROD API | Production URL |

### How Preview Deployments Work (PRs)

When you open a Pull Request:

1. **GitHub Actions CI** runs automatically:
   - Validates lint, type-check, build, and tests
   - Must pass before merge

2. **Vercel** creates a Preview Deployment:
   - Builds the app using `.env.development`
   - Connects to **DEV API**
   - Generates a unique preview URL (e.g., `https://resumespyweb-pr-123.vercel.app`)
   - Adds a comment to the PR with the preview link

3. **Review**:
   - Click the Vercel preview link in the PR
   - Test the changes in a live environment
   - Preview uses DEV API - safe to test without affecting production

### How Production Deployments Work

When code is merged to `main`:

1. **GitHub Actions CI** validates the build again

2. **Vercel** deploys to Production:
   - Builds the app using `.env.production`
   - Connects to **PROD API**
   - Deploys to production URL (e.g., `https://resumespyweb.vercel.app`)
   - Automatic rollback available if needed

### Verifying Deployments in Browser

#### Preview Deployment (PR):
1. Open the PR on GitHub
2. Look for the **Vercel bot comment** with the preview URL
3. Click the preview link
4. Open browser DevTools → Network tab
5. Verify API calls go to **DEV API** endpoint

#### Production Deployment:
1. Visit your production URL (configured in Vercel)
2. Open browser DevTools → Network tab
3. Verify API calls go to **PROD API** endpoint

---

## Environment Configuration

The application uses environment-specific configuration via `.env` files:

| File | Used By | API Endpoint | Purpose |
|------|---------|--------------|---------|
| `.env.development` | Vercel Preview, Local Dev | DEV API | PR previews and development |
| `.env.production` | Vercel Production | PROD API | Production deployments |
| `.env.local` | Local Development | Custom | Developer override (gitignored) |

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_API_BASE_URL` | Backend API base URL | Yes |

### Setup Instructions

1. **For Vercel**:
   - Connect this repository to Vercel via GitHub integration
   - Vercel will automatically use `.env.development` for previews
   - Vercel will automatically use `.env.production` for production
   - No manual environment variable configuration needed in Vercel dashboard

2. **For Local Development**:
   ```bash
   # Copy the example file
   cp .env.example .env.local
   
   # Edit .env.local with your local backend URL
   # This file is gitignored and won't be committed
   ```

3. **Update API URLs**:
   - Edit `.env.development` with your DEV API URL
   - Edit `.env.production` with your PROD API URL

---

## First-Time Vercel Setup

If you haven't connected Vercel yet:

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"Add New Project"**
3. Import this repository (`feifeijin/ResumeSpyWeb`)
4. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `./` (leave default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `dist` (auto-detected)
5. Click **"Deploy"**

Vercel will:
- ✅ Automatically detect it's a Vite project
- ✅ Read `vercel.json` for configuration
- ✅ Use `.env.production` for production builds
- ✅ Use `.env.development` for preview builds
- ✅ Enable automatic deployments for all PRs and `main` branch pushes

---

## Workflow Summary

```
┌─────────────────────────────────────────────────────────┐
│  Developer Opens Pull Request                           │
└─────────────────┬───────────────────────────────────────┘
                  │
         ┌────────┴─────────┐
         ▼                  ▼
┌─────────────────┐  ┌──────────────────────┐
│  GitHub Actions │  │  Vercel Preview      │
│  CI Pipeline    │  │  Deployment          │
│  • Lint         │  │  • Uses DEV API      │
│  • Type Check   │  │  • Preview URL       │
│  • Build        │  │  • Safe Testing      │
│  • Unit Tests   │  │                      │
└────────┬────────┘  └──────────┬───────────┘
         │                      │
         └──────────┬───────────┘
                    ▼
         ┌─────────────────────┐
         │  Code Review & Test │
         └──────────┬──────────┘
                    ▼
         ┌─────────────────────┐
         │  Merge to main      │
         └──────────┬──────────┘
                    │
         ┌──────────┴─────────┐
         ▼                    ▼
┌─────────────────┐  ┌─────────────────────┐
│  GitHub Actions │  │  Vercel Production  │
│  CI Pipeline    │  │  Deployment         │
│  (runs again)   │  │  • Uses PROD API    │
└─────────────────┘  │  • Live Production  │
                     └─────────────────────┘
```

---

## Troubleshooting

### Preview using wrong API
- Check `.env.development` has correct DEV API URL
- Vercel should automatically use this file for preview builds

### Production using wrong API
- Check `.env.production` has correct PROD API URL
- Vercel should automatically use this file for production builds

### Build fails on Vercel
- Check GitHub Actions CI passes first
- Check Vercel build logs for specific errors
- Verify `vercel.json` configuration is correct

### Environment variables not working
- Ensure variable names start with `VITE_` (required by Vite)
- Variables are embedded at build time, not runtime
- Rebuild the app after changing environment variables

---

## Notes

- E2E tests (Cypress) are not run in CI as they require a running backend
- The CI workflow focuses on validation; CD is fully handled by Vercel
- For local development, create `.env.local` (gitignored) with your custom settings
