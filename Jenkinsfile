pipeline {
    agent any
    tools {
        nodejs "node18" // Ensure 'node18' matches the name configured in Jenkins global tool configuration
    }
    stages {
        stage('Check Node.js') {
            steps {
                sh '''
                    node -v
                    npm -v
                '''
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }
        stage('Lint') {
            steps {
                sh '''
                npm run lint
                npm run lint:fix
                npm run format
                '''
            }
        }
        stage('Install Chromium') {
            steps {
                sh '''
                RUN apt-get update && apt-get install -y chromium && rm -rf /var/lib/apt/lists/*
                '''
            }
        }
        stage('Run Tests') {
            steps {
                sh 'npm test --watch=false --browsers=ChromeHeadless'
            }
        }

    }
}