# Demo Web Shop - Enterprise Playwright TypeScript Automation Framework

A production-grade, maintainable end-to-end automation test framework built with **Playwright**, **TypeScript**, and **Page Object Model (POM)** for the [Demo Web Shop](https://demowebshop.tricentis.com/) application.

---

## 🏛 Architecture Overview

```
Playwright_Antigravity/
├── src/
│   ├── data/                   # Test data (JSON) - credentials, products, error messages
│   │   ├── checkout.json
│   │   ├── negativeScenarios.json
│   │   ├── products.json
│   │   └── users.json
│   ├── fixtures/               # Custom Playwright test fixtures
│   │   └── testFixtures.ts
│   ├── pages/                  # Page Object Model (POM) representations
│   │   ├── BasePage.ts
│   │   ├── HomePage.ts
│   │   ├── RegisterPage.ts
│   │   ├── LoginPage.ts
│   │   ├── SearchPage.ts
│   │   ├── CategoryPage.ts
│   │   ├── ProductDetailsPage.ts
│   │   ├── CartPage.ts
│   │   ├── WishlistPage.ts
│   │   ├── CheckoutPage.ts
│   │   └── CustomerAccountPage.ts
│   └── utils/                  # Reusable utilities & dynamic generators
│       ├── dataGenerator.ts
│       └── helpers.ts
├── tests/                      # Test specifications organized by domain
│   ├── auth.spec.ts
│   ├── register.spec.ts
│   ├── search.spec.ts
│   ├── category.spec.ts
│   ├── cart.spec.ts
│   ├── wishlist.spec.ts
│   └── checkout.spec.ts
├── Jenkinsfile                 # Declarative CI/CD pipeline
├── package.json                # Dependencies and runner scripts
├── playwright.config.ts        # Playwright runner configuration
└── tsconfig.json               # TypeScript compiler configuration
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18.0 or later recommended)
- npm (v9.0 or later)

### Installation
1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd Playwright_Antigravity
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Install Playwright browsers:
   ```bash
   npx playwright install chromium firefox webkit
   ```

---

## 🧪 Test Execution Commands

### Run All Tests
```bash
npx playwright test
```

### Run by Browser Project
```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

### Run by Tag
- **Smoke Tests**:
  ```bash
  npm run test:smoke
  ```
- **Regression Tests**:
  ```bash
  npm run test:regression
  ```

### Run Specific Test Modules
```bash
npm run test:auth
npm run test:register
npm run test:search
npm run test:category
npm run test:cart
npm run test:wishlist
npm run test:checkout
```

### Run in Headed Mode
```bash
npm run test:headed
```

---

## 📊 Reporting & Debugging

### Playwright HTML Report
```bash
npm run report:html
```

### Allure Reports
1. Generate the report from raw results:
   ```bash
   npm run report:allure:generate
   ```
2. Open the Allure report in browser:
   ```bash
   npm run report:allure:open
   ```

### Debugging Failed Tests & Traces
Traces, screenshots, and videos are recorded automatically on test failures into `test-results/`.
Inspect traces using the Playwright Trace Viewer:
```bash
npx playwright show-trace test-results/<test-run-folder>/trace.zip
```

---

## 🔄 Jenkins CI/CD Integration

The repository includes a ready-to-run declarative `Jenkinsfile`.
- Configurable build parameters: `TEST_SUITE` (`smoke`, `regression`, `all`, etc.) and `BROWSER` (`chromium`, `firefox`, etc.).
- Automated dependency caching and browser installation.
- Integrated publishing for both Playwright HTML Report and Allure Report.
- Automatic archiving of failure traces, screenshots, and execution logs.
