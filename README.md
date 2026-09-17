# Swag Labs E2E Automation Framework

An enterprise-grade End-to-End (E2E) test automation framework for [Swag Labs](https://www.saucedemo.com/) built with **Playwright** and **TypeScript**.

---

## 🎯 Framework Objectives

The primary goal of this framework is to provide a reliable, maintainable, and completely deterministic test suite that models real-world user flows on SauceDemo while enforcing strict SDET engineering standards:

- **Zero Flakiness**: Eliminates race conditions and timing issues without using arbitrary sleeps (`waitForTimeout`) or brittle selectors.
- **Linear Readability ("Ponytail Simplicity")**: Test specifications read like pure business scenarios with no low-level DOM manipulation, branching logic, or loops.
- **Full Parallel Determinism**: High-speed test execution across isolated operating system workers with zero shared state.

---

## 🏛️ Architectural Decisions: Why It Was Built This Way

### 1. Layered Fixture Injections
In conventional frameworks, tests import `test` and `expect` directly from `@playwright/test` and copy-paste setup hooks (`beforeEach`, `afterEach`). 

In this architecture, tests import exclusively from `@fixtures/swaglabs-fixtures`:
- **Centralized Lifecycle Enforcement**: Automatically injects global test isolation, cookie resets, failure reporting, and browser error monitoring.
- **Elimination of Hook Duplication**: Setup and teardown contracts are maintained once inside fixture layers rather than scattered across test files.

### 2. Lazy Page Object Loading
All Page Objects (`loginPage`, `inventoryPage`, `cartPage`, `checkoutPage`) are exposed as fixtures.
- **On-Demand Instantiation**: Playwright only initializes a Page Object if the test signature explicitly destructures it (e.g. `async ({ loginPage }) => { ... }`).
- **Minimal Overhead**: Tests that only test authentication never waste CPU or memory creating inventory or checkout page instances.

### 3. Three-Level Page Object Model (POM) Hierarchy
Page Objects adhere to a strict 3-tier inheritance chain:
```
Level 1: pages/shared/BasePage.ts
  └─ Level 2: pages/swaglabs/BasePage.ts
       └─ Level 3: pages/swaglabs/{module}/{Module}Page.ts
```
- **Level 1 (`shared/BasePage`)**: Framework-level primitives (URL assertions, screenshot capture, universal DOM visibility guards).
- **Level 2 (`swaglabs/BasePage`)**: Application-specific infrastructure (React SPA loading synchronization, shared global header and sidebar access).
- **Level 3 (`LoginPage`, `InventoryPage`, `CartPage`, `CheckoutPage`)**: Concrete business domains exposing user actions and web-first assertions.

### 4. Component Object Pattern
Complex, repetitive, or embedded widgets (`HeaderComponent`, `SidebarComponent`, `ProductCardComponent`) are abstracted into component classes:
- Prevents DOM selector leakage into Page Objects.
- Promotes reuse: the same `HeaderComponent` is accessible across all Swag Labs pages.

### 5. Dynamic Getters for Locators
All element locators in Page and Component Objects are declared as **dynamic getters** (e.g., `get usernameInput(): Locator`):
- Avoids stale element reference errors by allowing Playwright to re-evaluate the DOM at the exact moment of action or assertion.
- Prohibits storing static `Locator` properties that risk referencing detached DOM nodes after page re-renders.

### 6. Auto-Fixtures as Quality Guards
- **`configureSnapshot`**: Resets cookies and storage before every test, enforcing hermetic isolation.
- **`consoleErrors`**: Attaches an event listener to `pageerror` and immediately fails the test if unhandled client-side JavaScript exceptions are emitted in the browser console.
- **`serverLogs`**: Automatically captures browser logs and attaches them as diagnostic artifacts in test reports when failures occur.
- **`authenticatedSession`**: Manages automated authentication when tests declare `test.use({ userRole: 'standard_user' })`.

### 7. One Test Per File (`.spec.ts`)
Each `.spec.ts` file contains exactly **one** `test()` block:
- Enables Playwright to run tests across independent OS worker processes without test-order dependencies or cross-test memory retention.
- Prevents cumulative state pollution between scenarios.

### 8. Strict TypeScript Typing
- Configured with `"strict": true` and module resolution path aliases (`@pages/*`, `@fixtures/*`, `@data/*`, `@components/*`, `@utils/*`).
- Static datasets (`users.json`, `snapshots.json`) are mapped to TypeScript types using `keyof typeof` in `data/types.ts` to prevent runtime string typos and guarantee compile-time safety.

---

## 📁 Repository Structure

```text
├── data/
│   ├── snapshots.json                           # Snapshot configuration catalogue
│   ├── swaglabs/
│   │   └── users.json                           # Credentials for SauceDemo accounts
│   └── types.ts                                 # Derived TypeScript types (keyof typeof)
├── fixtures/
│   ├── base-fixtures.ts                         # Auto-fixtures (snapshot, consoleErrors, serverLogs)
│   └── swaglabs-fixtures.ts                     # Project fixtures (lazy POMs, authenticatedSession)
├── pages/
│   ├── shared/
│   │   └── BasePage.ts                          # POM Level 1: Universal abstract base
│   └── swaglabs/
│       ├── BasePage.ts                          # POM Level 2: Swag Labs application base
│       ├── auth/
│       │   └── LoginPage.ts                     # POM Level 3: Login page
│       ├── inventory/
│       │   └── InventoryPage.ts                 # POM Level 3: Product inventory catalog
│       ├── cart/
│       │   └── CartPage.ts                      # POM Level 3: Shopping cart
│       ├── checkout/
│       │   └── CheckoutPage.ts                  # POM Level 3: Multi-step checkout
│       └── components/
│           ├── HeaderComponent.ts               # Component: App header & cart badge
│           ├── SidebarComponent.ts              # Component: Hamburger menu & navigation
│           └── ProductCardComponent.ts          # Component: Individual product cards
├── tests/
│   └── swaglabs/
│       ├── seed.spec.ts                         # Reference template (ignored by test runner)
│       ├── auth/
│       │   ├── Auth_Login_Success.spec.ts       # Test: Successful login with standard_user
│       │   └── Auth_Login_LockedUser.spec.ts    # Test: Locked user access denial banner
│       └── checkout/
│           └── Checkout_CompleteFlow_Success.spec.ts # Test: End-to-end purchasing flow
├── utils/
│   └── worker-url.ts                            # Multi-instance dynamic URL resolver per worker
├── globalSetup.ts                               # Pre-run target connectivity validation
├── package.json                                 # ESM module definition & scripts
├── playwright.config.ts                         # Playwright engine configuration
├── tsconfig.json                                # Strict TypeScript compiler configuration
└── utils.ts                                     # Root utility re-export
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: `v20.x` or higher
- **NPM**: `v10.x` or higher

### 1. Install Dependencies
```bash
npm install
```

### 2. Download Playwright Browsers
```bash
npx playwright install chromium
```

### 3. Run Static Type Checking
```bash
npm run typecheck
```

### 4. Execute Tests
Run all test suites:
```bash
npm test
```

Run tests on Chromium:
```bash
npx playwright test --project=chromium
```

Run a specific test in headed mode:
```bash
npx playwright test tests/swaglabs/checkout/Checkout_CompleteFlow_Success.spec.ts --headed
```

Run in interactive UI Mode:
```bash
npx playwright test --ui
```

---

## 👥 Supported Test Accounts (`data/swaglabs/users.json`)

All accounts share the default password `secret_sauce`:

| Role | Username | Test Objective |
| :--- | :--- | :--- |
| `standard_user` | `standard_user` | Baseline valid user flow |
| `locked_out_user` | `locked_out_user` | Authentication rejection & error validation |
| `problem_user` | `problem_user` | Defective UI asset handling |
| `performance_glitch_user` | `performance_glitch_user` | Latency and timeout threshold testing |
| `error_user` | `error_user` | Client-side error handling |
| `visual_user` | `visual_user` | Visual layout testing |
