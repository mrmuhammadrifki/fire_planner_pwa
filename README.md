# FIRE Planner PWA 🔥

A Progressive Web App for Gen Z to plan their path to Financial Independence and Retire Early (FIRE).

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4)

## 📖 Overview

FIRE Planner is a frontend-only financial planning application that helps users:

- **Calculate their FIRE number** - The amount needed for financial independence
- **Simulate portfolio growth** - Visualize compound growth over time
- **Track FIRE ladder progress** - Coast FI, Lean FI, Barista FI, FI, Fat FI
- **Learn FIRE principles** - Educational content for financial literacy

All data is stored locally in the browser - no backend required.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm 9+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd financials_pwa_apps

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run lint:fix` | Fix ESLint errors |
| `npm run format` | Format code with Prettier |
| `npm run typecheck` | Run TypeScript type checking |
| `npm run test` | Run unit tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run tests with coverage report |

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Authentication pages
│   │   ├── login/
│   │   └── register/
│   ├── dashboard/         # Main dashboard
│   ├── planner/           # Financial input form
│   ├── results/           # Charts and projections
│   ├── education/         # Learning content
│   │   └── [slug]/        # Dynamic article pages
│   ├── settings/          # App settings
│   ├── offline/           # Offline fallback
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Landing page
│   └── globals.css        # Global styles
├── components/
│   ├── auth/              # Authentication components
│   ├── charts/            # Chart.js components
│   ├── fire/              # FIRE-specific components
│   ├── layout/            # Layout components
│   ├── providers/         # React providers
│   ├── pwa/               # PWA components
│   └── ui/                # Reusable UI components
├── lib/
│   ├── api/               # Mock API layer
│   │   ├── auth.ts        # Authentication API
│   │   ├── client.ts      # API client utilities
│   │   └── storage.ts     # localStorage persistence
│   ├── fire/              # Core calculation logic
│   │   ├── metrics.ts     # FIRE metrics calculations
│   │   ├── simulate.ts    # Portfolio simulation
│   │   └── __tests__/     # Unit tests
│   └── validations.ts     # Zod schemas
├── store/                 # Zustand state management
├── data/                  # Static content (education articles)
└── types/                 # TypeScript type definitions
```

## 🧮 How Simulation Works

The FIRE simulation uses compound growth calculations:

### Core Formulas

1. **FIRE Number** = Annual Expenses ÷ Safe Withdrawal Rate
   ```
   Example: $48,000 ÷ 0.04 = $1,200,000
   ```

2. **Monthly Compound Growth**
   ```typescript
   portfolioValue = previousValue × (1 + monthlyReturn) + monthlyContribution
   ```

3. **Years to FI** - Iterative calculation until portfolio ≥ FIRE number

### Key Parameters

| Parameter | Default | Description |
|-----------|---------|-------------|
| Annual Return | 7% | Expected investment return |
| Safe Withdrawal Rate | 4% | The "4% rule" |
| Inflation Rate | 3% | For real return calculations |

## 🔥 FIRE Ladder Levels

| Level | Threshold | Description |
|-------|-----------|-------------|
| Drowning | < 1 month expenses | Negative net worth |
| Surviving | 1+ month emergency fund | Building safety net |
| Coast FI | ~15% + 20% saving rate | Can stop saving; growth reaches FI |
| Lean FI | ~40% of FI number | Cover basic expenses |
| Barista FI | ~60% of FI number | Part-time work covers rest |
| FI | 100% of FI number | Work is optional |
| Fat FI | 150%+ of FI number | Abundance with buffer |

## 📱 PWA Features

### Manifest
- App name and icons
- Standalone display mode
- Theme colors for mobile

### Service Worker
- Precaches essential assets
- Network-first strategy for pages
- Stale-while-revalidate for assets
- Offline fallback page

### Install Prompt
- "Install App" button appears when PWA criteria met
- Works on Chrome, Edge, Safari (iOS)

### Lighthouse Checklist
- [ ] Installable (manifest + service worker)
- [ ] Works offline (offline fallback page)
- [ ] Responsive design (mobile-first)
- [ ] Fast loading (< 3s on 4G)
- [ ] HTTPS required for production

## 🔄 Swapping Mock API with Real Backend

The mock API is designed to be easily replaced:

### 1. Update API Client (`src/lib/api/client.ts`)

```typescript
export const API_CONFIG = {
  baseUrl: process.env.NEXT_PUBLIC_API_URL || "https://your-api.com/api",
  timeout: 10000,
};
```

### 2. Replace Mock Functions

Replace functions in `auth.ts` and `storage.ts` with real API calls:

```typescript
// Before (mock)
export async function login(credentials) {
  await delay(800);
  // ... localStorage logic
}

// After (real API)
export async function login(credentials) {
  return apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}
```

### 3. Backend Requirements

The API should implement these endpoints:

```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh

GET  /api/user/profile
PUT  /api/user/profile

GET  /api/financial-data
POST /api/financial-data
PUT  /api/financial-data

POST /api/simulation/run
```

### Data Models

See `src/types/index.ts` for full TypeScript interfaces.

## 🎨 Design System

### Colors

| Token | Light | Dark | Usage |
|-------|-------|------|-------|
| primary | sky-500 | sky-400 | Main actions, links |
| fire | orange-500 | orange-400 | FIRE branding |
| wealth | green-500 | green-400 | Success, gains |
| surface | zinc-50 | zinc-950 | Backgrounds |

### Typography

- **Display**: Outfit (headings)
- **Body**: Inter (text)

### Components

See `src/components/ui/` for reusable components:
- Button (variants: primary, secondary, fire, wealth, ghost, danger)
- Input (with labels, errors, icons)
- Card (default, glass, gradient)
- Toast (success, error, info, warning)

## 🧪 Testing

### Run Tests

```bash
npm run test
```

### Test Coverage

```bash
npm run test:coverage
```

### Test Location

Unit tests for simulation functions are in:
`src/lib/fire/__tests__/fire.test.ts`

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 16 (App Router) | React framework |
| TypeScript 5 | Type safety |
| TailwindCSS 4 | Styling |
| Chart.js | Data visualization |
| react-hook-form + Zod | Form handling & validation |
| Zustand | State management |
| Jest | Unit testing |

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 Future Enhancements

- [ ] Backend integration (Node.js + PostgreSQL)
- [ ] User authentication with JWT
- [ ] Data sync across devices
- [ ] Goal tracking and milestones
- [ ] Investment allocation recommendations
- [ ] Social features (anonymized progress sharing)
- [ ] PDF export of results
- [ ] Multiple currency support with conversion
