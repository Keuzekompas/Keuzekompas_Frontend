# Keuzekompas Frontend

## Project Overview
Keuzekompas Frontend is a web application built with [Next.js](https://nextjs.org/) (App Router), [React](https://react.dev/), and [TypeScript](https://www.typescriptlang.org/). It serves as a tool for students to explore and choose study modules ("KeuzeModule"). The application features internationalization (Dutch/English), theme toggling, and module recommendation capabilities.

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **State Management:** React Context API
- **Internationalization:** i18next, react-i18next
- **Testing:** Jest, React Testing Library
- **Linting:** ESLint

## Architecture & Conventions

### Directory Structure
- `app/`: Main application source code (Next.js App Router).
    - `components/`: Reusable UI components.
    - `context/`: React Context providers (Language, Theme, Recommendations).
    - `hooks/`: Custom React hooks (e.g., `useDebounce`).
    - `i18n/`: Internationalization configuration and locales.
    - `modules/`, `profile/`, `login/`, `favorites/`, `ai/`: Feature-specific routes.
    - `types/`: TypeScript type definitions.
- `lib/`: Business logic and data fetching functions (e.g., `modules.ts`).
- `utils/`: General utility functions (e.g., `apiFetch.ts`).
- `__test__`/`__tests__`: Unit and integration tests.
- `public/`: Static assets.

### Data Fetching
- **`utils/apiFetch.ts`**: A wrapper around the native `fetch` API. It handles:
    - Base URL configuration (`NEXT_PUBLIC_API_BASE_URL`).
    - Default headers (Content-Type).
    - Authentication credentials (`include`).
    - Error handling (redirects on 401, custom `ApiError`).
- **`lib/`**: Contains specific data fetching functions (e.g., `getModules`, `getFavoriteModules`) that utilize `apiFetch`.

### Internationalization (i18n)
- Configured in `app/i18n/i18n.ts`.
- Supports 'NL' (Dutch) and 'EN' (English).
- `LanguageContext` manages the current language state and syncs with `localStorage` and the `i18n` instance.

### Styling
- Tailwind CSS is used for styling.
- Global styles are defined in `app/globals.css`.
- PostCSS is configured in `postcss.config.mjs`.

## Building and Running

### Prerequisites
- Node.js (ensure compatibility with Next.js 16)
- npm, yarn, pnpm, or bun

### Scripts
- **Development Server:**
    ```bash
    npm run dev
    ```
    Runs the app at `http://localhost:3000`.

- **Production Build:**
    ```bash
    npm run build
    ```
    Builds the application for production.

- **Start Production Server:**
    ```bash
    npm run start
    ```
    Runs the built application.

- **Linting:**
    ```bash
    npm run lint
    ```
    Runs ESLint to check for code quality issues.

- **Testing:**
    ```bash
    npm run test
    ```
    Runs Jest tests.
    ```bash
    npm run test:watch
    ```
    Runs Jest in watch mode.

## Testing
- Tests are located in `__test__` and `__tests__` directories.
- `jest.config.js` and `jest.setup.js` configure the testing environment.
- Tests cover components (e.g., `LanguageSwitch`, `ThemeToggle`) and logic.
