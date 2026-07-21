# Continuous Integration & Continuous Deployment (CI/CD) Guide

Implementing CI/CD for our vanilla JavaScript game is crucial for maintaining performance, preventing bugs, and streamlining our development process. This document outlines why we need it and how our pipeline is set up.

## 1. Why Our Team Needs CI/CD

*   **Prevents "It Works on My Machine" Syndrome:** We all use different setups. CI ensures the code is tested in a sterile, neutral environment every time someone tries to merge their code.
*   **Enforces Clean Code (Linting):** Vanilla JS can get messy. By adding ESLint to our pipeline, the CI will automatically block Pull Requests if someone forgets a semicolon, leaves unused variables, or writes sloppy syntax that could affect performance.
*   **Protects the Main Branch:** The `main` branch must always be a working, playable version of our game that hits the 60 FPS target. CI acts as a bouncer, running tests on a Pull Request *before* it is allowed to be merged.
*   **Automated Deployment:** Instead of manual uploads, the CD pipeline can automatically deploy the latest version of the game to our live URL whenever code is successfully merged to `main`.

---

## 2. Option A: Gitea Actions Workflow (Recommended)

Since our repository is hosted on Gitea, we can use Gitea Actions. It requires zero extra server setup and integrates directly into our repository.

**Setup Instructions:**
1. Create a folder in the root of the project named `.gitea/workflows/`.
2. Inside that folder, create a file named `ci-cd.yaml` and paste the following code:

```yaml
name: Make Your Game CI/CD

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install Dependencies
        run: npm install

      - name: Lint JavaScript
        run: npm run lint

  deploy:
    needs: build-and-test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest

    steps:
      - name: Checkout Repository
        uses: actions/checkout@v3

      - name: Deploy to Server
        run: |
          echo "Deploying the vanilla JS/HTML files to the web server..."
          # Replace this with actual SCP/SSH commands for our server
```

---

## 3. Option B: Jenkins Pipeline (Alternative)

If we are required to use a standalone Jenkins server, we will use a `Jenkinsfile` in the root of our repository instead.

```groovy
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Setup & Install') {
            steps {
                sh 'npm install'
            }
        }

        stage('Lint Code') {
            steps {
                sh 'npm run lint'
            }
        }

        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                echo 'Deploying plain HTML/JS files to the web server...'
                // Replace with actual SCP/SSH commands
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline succeeded! Game is live.'
        }
        failure {
            echo 'Pipeline failed! Check the logs for JavaScript syntax errors.'
        }
    }
}
```

---

## 4. Prerequisites for the Pipeline

Because we are strictly using plain JS and HTML without frameworks, we don't need a heavy build process. We just need to initialize a basic `package.json` to hold our linter rules. 

Before the pipeline can work, someone on the team needs to run these commands locally and push the resulting files to the repo:
1. `npm init -y`
2. `npm install eslint --save-dev`
3. Add a script to `package.json`: `"lint": "eslint ./*.js"`
