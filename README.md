# EngLearn - Academic English Learning Assistant

## Project Overview

**EngLearn** is a personal English learning and reading assistant web application designed for AI/NLP/Big Data researchers. It provides daily curated academic papers, listening practice videos, and reading materials — all accessible through a clean, focused interface.

**Live Site:** [GitHub Pages URL after deployment](https://xjblsy.github.io/daily-English-essay-reading/)

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Getting Started](#getting-started)
5. [Deployment Guide](#deployment-guide)
6. [Content Update Mechanism](#content-update-mechanism)
7. [Testing](#testing)
8. [Monitoring & Maintenance](#monitoring--maintenance)

---

## Features

### Core Modules

| Module | Description |
|--------|-------------|
| **Dashboard** | Daily recommendations overview with 3 papers + 2 videos + readings, quick navigation |
| **Academic Papers** | Searchable paper list from arXiv/Nature with source/category filters |
| **Listening Practice** | Curated video collection (BBC Learning English, TED, Cambridge IELTS) with embedded player |
| **Reading Materials** | IELTS passages, tech blogs, documentation with difficulty levels |
| **Favorites** | Bookmark system grouped by type (papers/videos/readings) |
| **History** | Browsing history with relative timestamps |
| **Settings** | Research interests, daily count preferences |
| **System Monitor** | Health dashboard showing API connectivity, storage usage, update logs |

### Key Capabilities

- **Daily Auto-Update**: Automatic content refresh every 24 hours via arXiv API
- **Graceful Degradation**: Falls back to curated data when APIs are unavailable
- **Offline Support**: Cached recommendations load instantly on revisit
- **Retry Logic**: Exponential backoff retry for failed API calls
- **Comprehensive Logging**: Full audit trail of all update operations

---

## Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React | 18.x |
| Language | TypeScript | 5.x |
| Build Tool | Vite | 6.x |
| Styling | Tailwind CSS | 3.x |
| State Management | Zustand | 5.x |
| Routing | React Router | 7.x |
| Icons | Lucide React | latest |
| Date Utils | date-fns | 3.x |
| Testing | Vitest | latest |

---

## Project Structure

```
englearn/
├── .github/workflows/deploy.yml   # GitHub Actions CI/CD pipeline
├── public/                         # Static assets
├── src/
│   ├── assets/images/              # Image resources
│   ├── components/
│   │   ├── layout/                 # Sidebar, Header, Layout
│   │   ├── common/                 # Card, Badge, Button, EmptyState, LoadingSpinner, HealthMonitor
│   │   ├── papers/                 # PaperCard, PaperFilters
│   │   ├── listening/              # VideoCard
│   │   ├── reading/                # ReadingCard
│   │   └── dashboard/              # WelcomeBanner, TodayPapers/Videos/Readings, QuickNav
│   ├── pages/                      # 7 page components
│   ├── data/                       # Mock data + constants
│   ├── services/                   # Update service (core business logic)
│   ├── hooks/                      # Custom React hooks
│   ├── stores/                     # Zustand state stores
│   ├── types/                      # TypeScript definitions
│   ├── utils/                      # Utility functions
│   ├── App.tsx                     # Root component with routing
│   ├── main.tsx                    # Entry point
│   └── index.css                   # Global styles
├── tests/
│   ├── setup.ts                    # Test environment config
│   └── unit/                       # Unit & integration tests
├── .trae/documents/                # PRD & architecture docs
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── vite.config.ts
└── vitest.config.ts                # Test configuration
```

---

## Getting Started

### Prerequisites

- Node.js >= 18
- npm >= 9

### Installation

```bash
# Clone the repository
git clone https://github.com/xjblsy/daily-English-essay-reading.git
cd daily-English-essay-reading

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173/`

### Available Scripts

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run preview   # Preview production build locally
npm run check     # TypeScript type checking
npm run lint      # ESLint code linting
npm run test      # Run all tests with coverage
```

---

## Deployment Guide

### GitHub Pages Deployment (Automated)

This project uses **GitHub Actions** for automated CI/CD:

#### How it works:

1. Push to `main` branch triggers the workflow
2. **Test Job**: Runs TypeScript checks + all unit/integration tests
3. **Build Job**: Builds the Vite production bundle (`npm run build`)
4. **Deploy Job**: Deploys `./dist` folder to GitHub Pages
5. **Health Check**: Verifies the deployed site is accessible

#### Manual Deployment:

```bash
# Option 1: Trigger via GitHub Actions UI
# Go to Actions > "CI/CD - Build & Deploy" > "Run workflow"

# Option 2: Command line deployment
npm run build
# Upload ./dist to your hosting provider
```

#### Environment Variables (if needed):

The deployment requires no environment variables for basic operation. The app runs entirely client-side.

#### Custom Domain (optional):

To use a custom domain with GitHub Pages:

1. Go to repository Settings > Pages > Custom domain
2. Enter your domain (e.g., `learn.yourdomain.com`)
3. Configure DNS records as instructed by GitHub
4. Enable HTTPS in Settings

---

## Content Update Mechanism

### Architecture

```
User opens app
    ↓
Check last update time (localStorage)
    ↓
≥ 24h since last update?
    ├─ YES → Fetch from arXiv API (with retry)
    │         ├─ Success → Use live data, mark as NEW
    │         └─ Failure → Use fallback data, log error
    │
    └─ NO  → Load cached data instantly
              Background refresh (optional)
```

### Retry Strategy

| Parameter | Value |
|-----------|-------|
| Max retries per request | 3 |
| Base delay | 1,000 ms |
| Backoff factor | 2x (exponential) |
| Max delay | 8,000 ms |
| Request timeout | 15 seconds |

### Data Sources

| Source | Type | Refresh Rate | Fallback |
|--------|------|-------------|----------|
| arXiv API | REST (XML) | Daily | Built-in curated list |
| BBC/TED Videos | Static links | N/A (pre-curated) | Same |
| IELTS Reading | Static links | N/A (pre-curated) | Same |

### Error Handling Flow

```
API Call Failed
    ↓
Log error with timestamp + details
    ↓
Increment failure counter
    ↓
Attempt retry (exponential backoff)
    ↓
All retries exhausted?
    ├─ YES → Switch to fallback data
    │         → Mark source as 'fallback'
    │         → Still serve content to user
    │         → Record error in update status
    └─ NO  → Next retry attempt
```

### Logging System

All update operations are logged to `localStorage` under key `englearn_update_logs`:

```typescript
interface LogEntry {
  timestamp: string;   // ISO 8601
  level: 'info' | 'warn' | 'error';
  message: string;
  details?: unknown;   // Additional context
}
```

- Max 100 entries retained (FIFO)
- Viewable in System Monitor panel
- Console output mirrors localStorage

---

## Testing

### Test Framework

- **Runner**: Vitest
- **Environment**: jsdom (browser simulation)
- **Coverage**: v8 provider with threshold enforcement

### Test Categories

#### Unit Tests (`tests/unit/`)

| File | What it Tests |
|------|--------------|
| `updateService.test.ts` | Core update logic: fallback, retry, logging, status tracking |
| `favoriteStore.test.ts` | Favorites CRUD: add/remove/duplicate/type-filter/persistence |
| `historyStore.test.ts` | History CRUD: add/reorder/clear/limit/persistence |
| `apiHelpers.test.ts` | XML parsing: valid input, empty input, multiple entries, whitespace cleanup |

#### Running Tests

```bash
# Run all tests
npm run test

# Run with verbose output
npx vitest run --reporter=verbose

# Run specific test file
npx vitest run tests/unit/updateService.test.ts

# Watch mode (development)
npx vitest

# Coverage report
npx vitest run --coverage
# Report generated at: coverage/index.html
```

### Coverage Thresholds

| Metric | Minimum |
|--------|---------|
| Lines | 60% |
| Functions | 50% |
| Branches | 40% |
| Statements | 60% |

### Adding New Tests

1. Create test file in `tests/unit/` or `tests/integration/`
2. Name pattern: `*.test.ts` or `*.test.tsx`
3. Import from `../../src/...` (resolved by vitest alias)

```typescript
import { describe, it, expect } from 'vitest';
import { myFunction } from '../../src/utils/myModule';

describe('myFunction', () => {
  it('should work correctly', () => {
    expect(myFunction()).toBe('expected');
  });
});
```

---

## Monitoring & Maintenance

### Built-in Health Dashboard

Navigate to **Settings > System Monitor** (or extend the sidebar nav) to view:

- **arXiv API Status**: Reachability + response latency
- **Local Storage Health**: Available space + usage
- **Content Update Source**: Live API vs fallback data
- **Update Statistics**: Success/failure counts, consecutive failures
- **Activity Log**: Recent update operations with timestamps

### Maintenance Checklist

#### Weekly
- [ ] Review health dashboard for any warnings/errors
- [ ] Check update logs for recurring failures
- [ ] Verify fallback data is still relevant/current

#### Monthly
- [ ] Review and update fallback paper/video/reading lists
- [ ] Check arXiv API endpoint changes
- [ ] Review dependency security advisories (`npm audit`)
- [ ] Verify GitHub Actions workflow runs successfully

#### Quarterly
- [ ] Evaluate adding new content sources
- [ ] Review user settings defaults
- [ ] Performance audit (load time, bundle size)

### Troubleshooting

| Issue | Likely Cause | Solution |
|-------|-------------|----------|
| No papers loading | arXiv API blocked by CORS | App auto-falls back to built-in data |
| Favorites lost | localStorage cleared | Data is client-only; no cloud backup |
| Slow initial load | First-time API fetch | Subsequent loads use cache |
| Build fails on CI | Dependency version mismatch | Run `npm ci` in fresh environment |

---

## License

This project is for personal learning use.
