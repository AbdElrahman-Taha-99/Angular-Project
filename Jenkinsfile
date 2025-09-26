pipeline {
    agent {
        docker {
            image 'ataha99/my-angular-agent:latest' // your built Docker agent
            reuseNode true
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
                sh 'npm test -- --watch=false --browsers=ChromeHeadless'
            }
        }
    }
}
