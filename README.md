# Demo Web Shop – Playwright TypeScript Automation Framework

A maintainable end-to-end test automation framework for the [Demo Web Shop](https://demowebshop.tricentis.com/) application, built using **Playwright, TypeScript, and the Page Object Model (POM)**.

The framework is designed to support reusable page objects, organized test data, cross-browser testing, reporting, and CI/CD integration.

## Architecture Overview

```text
Playwright_Antigravity/
├── src/
│   ├── data/                  # JSON test data
│   ├── fixtures/              # Custom Playwright fixtures
│   │   └── testFixtures.ts
│   ├── pages/                 # Page Object Model classes
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
│   └── utils/                 # Reusable utilities
│       ├── dataGenerator.ts
│       └── helpers.ts
├── tests/                     # Test specifications
│   ├── auth.spec.ts
│   ├── register.spec.ts
│   ├── search.spec.ts
│   ├── category.spec.ts
│   ├── cart.spec.ts
│   ├── wishlist.spec.ts
│   └── checkout.spec.ts
├── Jenkinsfile                # Jenkins pipeline
├── package.json               # Dependencies and npm scripts
├── playwright.config.ts       # Playwright configuration
└── tsconfig.json              # TypeScript configuration
```

*Note: This structure describes the intended project layout. Update the file and folder names if your actual repository differs.*

## Prerequisites

Install the following before running the tests:

- Node.js 18 or later
- npm
- Git
- Visual Studio Code or another TypeScript-compatible editor

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/HemanthK1532/Playwright_Antigravity.git
cd Playwright_Antigravity
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Install Playwright Browsers

```bash
npx playwright install
```

To install only specific browsers:

```bash
npx playwright install chromium firefox webkit
```

## Test Execution

### Run All Tests

```bash
npx playwright test
```

### Run Tests in Headed Mode

```bash
npx playwright test --headed
```

### Run Tests in Debug Mode

```bash
npx playwright test --debug
```

### Run Tests in a Specific Browser

If the corresponding scripts are configured in `package.json`:

```bash
npm run test:chromium
npm run test:firefox
npm run test:webkit
```

### Run Individual Test Modules

If the corresponding scripts are configured in `package.json`:

```bash
npm run test:auth
npm run test:register
npm run test:search
npm run test:category
npm run test:cart
npm run test:wishlist
npm run test:checkout
```

### Run Smoke and Regression Tests

If the project has the appropriate tags and npm scripts configured:

```bash
npm run test:smoke
npm run test:regression
```

Check `package.json` for the exact scripts supported by your project.

## Reporting and Debugging

### HTML Report

After test execution, open the Playwright HTML report using:

```bash
npx playwright show-report
```

If the project defines a custom reporting script, you can use that instead.

### Debug Failed Tests

Run tests in debug mode:

```bash
npx playwright test --debug
```

If tracing is enabled, inspect a trace ZIP file using:

```bash
npx playwright show-trace path/to/trace.zip
```

Screenshots, videos, and traces depend on the settings configured in `playwright.config.ts`.

### Allure Reports

If Allure is configured in the project and the relevant npm scripts and dependencies are installed, use the commands defined in `package.json` to generate and open Allure reports.

## Jenkins CI/CD Integration

The repository includes a `Jenkinsfile` intended for Jenkins pipeline integration.

Depending on the implemented pipeline configuration, it can support:

- Automated dependency installation
- Playwright browser installation
- Execution of selected test suites
- Browser-specific test execution
- Publishing test reports
- Archiving screenshots, traces, and other test artifacts

Configure Jenkins with the appropriate Node.js environment, dependencies, and browser requirements before running the pipeline.

## Key Framework Features

- **Page Object Model (POM):** Separates page-specific actions and locators from test logic.
- **Reusable Components:** Promotes code reuse and maintainability.
- **Data-Driven Testing:** Organizes test data using JSON files.
- **Custom Fixtures:** Supports reusable test setup and configuration.
- **Cross-Browser Testing:** Supports Chromium, Firefox, and WebKit when configured.
- **Test Organization:** Separates test specifications by functional area.
- **Reporting and Debugging:** Uses Playwright reporting and debugging capabilities.
- **CI/CD Integration:** Provides a foundation for automated execution through Jenkins.

## Application Under Test

[Demo Web Shop](https://demowebshop.tricentis.com/)

## Author

**Hemanth Kassetty**

GitHub: [HemanthK1532](https://github.com/HemanthK1532)