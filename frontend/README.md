# maanak Frontend Architecture

This frontend is the user-facing layer of the METROSCAN Legal Metrology inspection platform. It is built as a Vite + React + TypeScript application that presents inspection workflows, compliance review tools, case management, evidence handling, analytics, and enforcement dashboards.

The frontend is organized around a route-based shell and a set of feature pages. It uses a composable UI architecture where shared layout components, global providers, feature pages, hooks, data, and services sit behind a single React application root.

## 1. High-Level Architecture

The frontend runtime is intentionally simple:

1. `main.tsx` mounts the React application.
2. `App.tsx` creates the app shell by wrapping the router in application providers.
3. `app/router/index.tsx` defines the route tree using `createBrowserRouter`.
4. `layout/MainLayout` and `layout/AuthLayout` provide the different UI environments.
5. Page components under `src/pages` represent the product’s user-facing business screens.

The architecture follows a classic feature-page layout:

- Layout and navigation are reusable across pages.
- Routes are declared centrally in the router.
- Pages are lazy loaded for code splitting.
- Providers decorate the UI with cross-cutting concerns such as toast messaging and case context.
- Feature folders keep the UI organized by business domain such as cases, inspection, rules, intelligence, and evidence.

## 2. Application Startup Flow

The startup flow is:

- `src/main.tsx` renders `<App />`
- `src/App.tsx` uses `AppProviders` and `RouterProvider`
- `src/app/providers/AppProviders.tsx` composes global providers
- `src/app/router/index.tsx` builds the route tree and maps URLs to pages

This separation is useful because it keeps routing, context, and layout concerns independent. If you want to add a new product screen, the main work is usually:

1. Add a new lazy page import in the router.
2. Add a route entry with the page element.
3. Build the page under `src/pages/...`.
4. Reuse existing layout, data, types, and shared UI components if possible.

## 3. Routing Model

The router in `src/app/router/index.tsx` is a nested browser router with two top-level areas:

- `/` and the authenticated application area using `MainLayout`
- `/login` using `AuthLayout`

The main flow is organized around the product workflow:

- Dashboard
- Inspection workflow pages
- Declaration workspace
- Applicability engine
- Font and PDP analysis
- Human verification
- Evidence vault
- Reports
- Cases and compliance intelligence
- Rule library
- Offline mode
- Settings

Routes are declared in a centralized array using `createBrowserRouter`. Because the router uses lazy loading for page modules, the app can split the UI into smaller bundles as the user navigates.

## 4. Provider and State Architecture

The global providers are defined in `src/app/providers/`:

- `AppProviders.tsx` composes the application providers
- `CaseContext.tsx` holds application case or inspection context
- `ToastContext.tsx` provides cross-component toast feedback

These providers wrap the routing tree so that the UI can expose contextual state without threading props through every screen. This is the correct place for cross-cutting, application-wide state that must be visible across many pages.

## 5. UI Layer Composition

The frontend uses a layered UI structure:

- `src/layouts/` contains the top-level page wrappers for the main app and Auth screens.
- `src/components/common/` contains reusable navigation and UI widgets such as the sidebar, top bar, modal search, shortcuts, status badge, and toast system.
- `src/components/views/` contains the classic view components that are used by the feature pages or screens.
- `src/pages/` is the route-oriented page layer.

This preserves separation of responsibilities:

- `components/common` defines infrastructure UI.
- `components/views` or scaffolder screens expose page content.
- `pages` act as the route boundary and orchestration layer.

## 6. Feature Domain Organization

The codebase is grouped by business and product domain rather than a single flat screen file layout.

Important folders:

- `src/features/auth/` → login and authentication concepts
- `src/features/cases/` → case management and inspection case workflows
- `src/features/compliance/` → compliance and rule evaluation UI
- `src/features/dashboard/` → dashboard and executive metrics
- `src/features/evidence/` → evidence vault and digital evidence concepts
- `src/features/inspection/` → scanning, compliance X-Ray, declaration, and inspection verification
- `src/features/intelligence/` → analytics, heatmaps, ecommerce comparison, and manufacturer intelligence
- `src/features/offline/` → offline queue and field sync pattern support
- `src/features/reports/` → report and notice generation concepts
- `src/features/settings/` → user and admin settings

The `src/hooks/` folder contains reusable custom hooks such as route navigation, keyboard shortcuts, inspection case handling, and toasts.

## 7. Data and Type Model

The frontend uses TypeScript types and mock data to model the UI.

- `src/types/` defines cross-cutting domain shapes and route-related types.
- `src/data/mockData.ts` provides sample data used for UI development and product demonstration.
- `src/services/` is where the frontend can interact with API or backend integration services.

This means the frontend is ready to separate view rendering from backend data handling. The current repository uses mock/data-driven screens while keeping a clean place to add real API adapters.

## 8. Styling and Design System

The frontend styling layer is intentionally light and modern:

- Vite is the build and development server.
- TypeScript performs compile-time safety.
- React Router v7 handles route navigation.
- `clsx` and `tailwind-merge` support safe conditional UI classes.
- `lucide-react` supplies icons.
- `Tailwind CSS` provides utility style primitives.

The UI follows a slate/dark-navigation product style with green, red, and amber compliance indicators across the application. The architecture does not enforce strict design tokens yet, but the styling intent is consistent throughout the UI.

## 9. Workflow Summary

A typical product workflow will look like this:

1. An officer opens the application and lands on the dashboard or login view.
2. The officer begins a new inspection from the route `/inspection/new`.
3. The package scan and compliance inspection screens are used to capture labels and evidence.
4. The review tools such as declaration workspace, ruling engine, font and PDP checks, and ecommerce comparison validate declarations.
5. Findings are routed into cases, evidence, reports, and analytics pages.
6. The enforcement dashboard and rule library provide governance, auditability, and reporting output.

## 10. Development Commands

From the frontend directory:

```bash
npm install
npm run dev
npm run build
npm run lint
npm run preview
```

## 11. Architectural Principles

The frontend is designed according to a few clear principles:

- Centralize route and UI composition.
- Use page-level lazy loading for scalable routing.
- Keep reusable UI in common components.
- Use providers for cross-cutting state.
- Group related screens by domain logic and workflow stage.
- Keep types and mock data explicit to support future backend integration.

That combination gives the UI a strong product structure while keeping expansion easy as the METROSCAN platform grows.

