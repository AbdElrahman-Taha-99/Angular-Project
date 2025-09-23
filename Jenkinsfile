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
    }
}