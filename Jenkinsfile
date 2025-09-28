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
                    echo "🔎 Checking Node.js, npm, and Chromium versions..."
                    node -v
                    npm -v
                    chromium --version
                '''
            }
        }

        stage('Install Dependencies') {
            steps {
                // use npm ci if package-lock.json exists, else npm install
                echo "📦 Installing npm dependencies..."
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
                echo "💅🏻 Running linting and formatting..."
                npm run lint || true
                npm run lint:fix || true
                npm run format || true
                '''
            }
        }

        stage('Run Tests') {
            steps {
                sh '''
                echo "🤖 Running tests with coverage..."
                npm test -- --watch=false --browsers=ChromeHeadlessNoSandbox --code-coverage
                '''
                sh '''
                echo "📜 Creating test artifacts..."
                mkdir -p test-artifacts
                cp -r coverage test-artifacts/ || true
                '''
                archiveArtifacts artifacts: 'test-artifacts/**', fingerprint: true
                
                sh '''
                echo "🏳️ Sending test artifacts to Ansible host..."
                scp -r test-artifacts ansible@34.235.88.160:/tmp/test-artifacts
                '''
            }
        }
    }
}
