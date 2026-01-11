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

This repository uses GitHub Actions for CI/CD. Deployment is handled externally (e.g., Vercel).

### Continuous Integration (CI)

CI runs automatically on:
- **Pull Requests**: Validates code quality before merging
- **Push to main/release**: Ensures production-ready code

#### CI Pipeline Steps:
1. **Checkout** - Clone the repository
2. **Install Dependencies** - Run `npm ci`
3. **Lint** - Check code style with ESLint
4. **Type Check** - Validate TypeScript types
5. **Build** - Build the production bundle
6. **Unit Tests** - Run Vitest tests

### What Happens on PR

When you open a Pull Request:
1. CI automatically runs all checks (lint, type-check, build, tests)
2. External deployment platforms (e.g., Vercel) create a **Preview Deployment**
3. You can review changes in the browser before merging

### What Happens on Merge to Main

When code is merged to `main`:
1. CI validates the build again
2. External deployment platforms deploy to the **DEV environment**

### Environment Configuration

The application supports environment-specific configuration via environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `https://localhost:7227/` |

#### Environments:
- **DEV**: `main` branch - Development/staging environment
- **PREVIEW**: Pull Requests - Temporary preview deployments
- **PROD**: `release` branch - Production environment

See `.env.example` for configuration template.

### Limitations & Assumptions

- Deployment is handled externally (e.g., Vercel, Netlify)
- CI focuses on validation; CD is platform-specific
- E2E tests are not run in CI (require running backend)
