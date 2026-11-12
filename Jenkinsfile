pipeline {
    agent any

    tools {
        nodejs 'NodeJS-20' // Configured under Jenkins Global Tool Configuration
    }

    options {
        timeout(time: 60, unit: 'MINUTES')
        buildDiscarder(logRotator(numToKeepStr: '30'))
        ansiColor('xterm')
    }

    parameters {
        choice(
            name: 'TEST_SUITE',
            choices: ['smoke', 'regression', 'all', 'checkout', 'auth'],
            description: 'Select the test suite tag or category to execute'
        )
        choice(
            name: 'BROWSER',
            choices: ['chromium', 'firefox', 'webkit', 'all'],
            description: 'Target browser for execution'
        )
        string(
            name: 'BASE_URL',
            defaultValue: 'https://demowebshop.tricentis.com',
            description: 'Target Application URL'
        )
    }

    environment {
        CI = 'true'
        BASE_URL = "${params.BASE_URL}"
        PLAYWRIGHT_BROWSERS_PATH = "${WORKSPACE}/.cache/ms-playwright"
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code from Git repository...'
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                echo 'Installing Node.js project dependencies...'
                bat 'npm ci || npm install'
            }
        }

        stage('Install Playwright Browsers') {
            steps {
                echo 'Installing target Playwright browsers...'
                script {
                    if (params.BROWSER == 'all') {
                        bat 'npx playwright install --with-deps'
                    } else {
                        bat "npx playwright install --with-deps ${params.BROWSER}"
                    }
                }
            }
        }

        stage('TypeScript Compilation & Lint') {
            steps {
                echo 'Verifying TypeScript types and syntax...'
                bat 'npx tsc --noEmit'
            }
        }

        stage('Execute Playwright Tests') {
            steps {
                echo "Executing suite: ${params.TEST_SUITE} on browser: ${params.BROWSER}..."
                script {
                    def browserArg = (params.BROWSER == 'all') ? '' : "--project=${params.BROWSER}"
                    def grepArg = ''

                    switch (params.TEST_SUITE) {
                        case 'smoke':
                            grepArg = '--grep @smoke'
                            break
                        case 'regression':
                            grepArg = '--grep @regression'
                            break
                        case 'checkout':
                            grepArg = 'tests/checkout.spec.ts'
                            break
                        case 'auth':
                            grepArg = 'tests/auth.spec.ts'
                            break
                        default:
                            grepArg = ''
                    }

                    // Execute tests allowing post-build reporting even if some tests fail
                    catchError(buildResult: 'UNSTABLE', stageResult: 'FAILURE') {
                        bat "npx playwright test ${grepArg} ${browserArg}"
                    }
                }
            }
        }

        stage('Generate Reports') {
            steps {
                echo 'Generating Allure & Playwright HTML reports...'
                script {
                    bat 'npm run report:allure:generate || true'
                }
            }
        }
    }

    post {
        always {
            echo 'Archiving test reports and failure artifacts...'
            
            // Publish Playwright HTML Report
            publishHTML(target: [
                allowMissing: true,
                alwaysLinkToLastBuild: true,
                keepAll: true,
                reportDir: 'playwright-report',
                reportFiles: 'index.html',
                reportName: 'Playwright Test Report'
            ])

            // Publish Allure Report (requires Allure Jenkins Plugin)
            allure([
                includeProperties: false,
                jdk: '',
                properties: [],
                reportBuildPolicy: 'ALWAYS',
                results: [[path: 'allure-results']]
            ])

            // Archive raw traces, screenshots, and videos on failure
            archiveArtifacts artifacts: 'test-results/**, allure-results/**', allowEmptyArchive: true
        }

        success {
            echo 'All Playwright tests passed successfully!'
        }

        unstable {
            echo 'Some tests failed. Check Playwright HTML & Allure reports for trace details.'
        }

        failure {
            echo 'Build or test execution encountered a critical failure.'
        }
    }
}
