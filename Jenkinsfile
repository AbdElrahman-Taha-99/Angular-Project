pipeline {
    agent {
        docker {
            image 'docker.io/ataha99/my-angular-agent:latest' // your built Docker agent
            args '-u root:root' // run as root to avoid permission issues
            reuseNode true
            alwaysPull true
        }
    }

    stages {
        stage('Check Node.js & Chromium') {
            steps {
                sh '''
                    node -v
                    npm -v
                    chromium --version
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                // use npm ci if package-lock.json exists, else npm install
                script {
                    if (fileExists('package-lock.json')) {
                        sh 'npm ci'
                    } else {
                        sh 'npm install'
                    }
                }
            }
        }

        stage('Lint') {
            steps {
                sh '''
                    npm run lint || true
                    npm run lint:fix || true
                    npm run format || true
                '''
            }
        }

        stage('Run Tests') {
            steps {
                sh 'npm test -- --watch=false --browsers=ChromeHeadlessNoSandbox'
            }
        }
    }
}
