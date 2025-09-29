pipeline {
    agent {
        docker {
            image 'docker.io/ataha99/my-angular-agent:latest' // your built Docker agent
            // mount jenkins ssh keys 
            // and docker socket to run docker commands inside the agent
            args '-u root:root -v /var/lib/jenkins/.ssh:/root/.ssh:ro -v /var/run/docker.sock:/var/run/docker.sock'
            reuseNode true
            alwaysPull true
        }
    }

    environment {
        REGISTRY = "docker.io/ataha99"
        IMAGE_NAME = "angular-app"
        VERSION = "${env.BUILD_NUMBER}"
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

        stage('Build and Unit Tests') {
            steps {
                // use npm ci if package-lock.json exists, else npm install
                echo "📦 Installing npm dependencies..."
                sh '''
                npm ci                 
                echo "💅🏻 Running linting and formatting..."
                npm run lint || true
                npm run lint:fix || true
                npm run format || true
                '''
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
            }
        }
        stage('NPM Audit') {
            steps {
                sh '''
                echo "🔐 Running npm audit..."
                npm audit --json || true > npm-audit.json
                '''
                archiveArtifacts artifacts: 'npm-audit.json', fingerprint: true
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                echo "🐳 Building Docker image..."
                docker build -t $REGISTRY/$IMAGE_NAME:$VERSION .
                docker tag $REGISTRY/$IMAGE_NAME:$VERSION $REGISTRY/$IMAGE_NAME:latest
                '''
            }
        }
        
        stage('Trivy Scan') {
            steps {
                sh '''
                echo "🛡️ Running Trivy image scan..."
                trivy image --exit-code 0 --severity HIGH,CRITICAL --format json \
                    -o trivy-report.json $REGISTRY/$IMAGE_NAME:$VERSION
                '''
                archiveArtifacts artifacts: 'trivy-report.json', fingerprint: true
            }
        }

        stage('Push to Registry') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'DockerHub', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                    sh '''
                    echo "$DOCKER_PASS" | docker login -u "$DOCKER_USER" --password-stdin
                    docker push $REGISTRY/$IMAGE_NAME:$VERSION
                    docker push $REGISTRY/$IMAGE_NAME:latest
                    '''
                }
            }
        }
        stage('Deploy to EC2') {
            steps {
                sh '''
                echo "🚀 Triggering Ansible deployment..."
                ssh ansible@34.235.88.160 "ansible-playbook ~/ansible-playbooks/deploy-angular.yml -i ~/ansible-playbooks/inventory.ini"
                '''
            }
        }
        stage('Acceptance/E2E + Performance Tests') {
            steps {
                script {
                    sh '''
                    echo "🧪 Running Cypress + k6 tests on AWS Test EC2..."
                    ssh ubuntu@3.88.179.247 "
                    cd ~/angular-e2e &&
                    git pull &&
                    npm ci &&
                    xvfb-run -a npx cypress run --browser chromium --reporter junit --reporter-options 'mochaFile=cypress/reports/results-[hash].xml,toConsole=true'
                    echo '🔥 Running k6 performance tests...' &&
                    mkdir -p ~/angular-e2e/performance/results &&
                    k6 run --summary-export=performance/results/results.json performance/performance-test.js
                    "
                    '''
                }
   
            }
            post {
                always {
                    echo "📤 Archiving E2E test results..."

                    // Copy reports back to Jenkins
                    sh '''
                    scp -r ubuntu@3.88.179.247:~/angular-e2e/cypress/reports ./e2e-artifacts || true
                    scp -r ubuntu@3.88.179.247:~/angular-e2e/performance/results ./perf-artifacts || true
                    '''

                    // Archive inside Jenkins
                    archiveArtifacts artifacts: 'e2e-artifacts/**', fingerprint: true
                    archiveArtifacts artifacts: 'perf-artifacts/**', fingerprint: true

                    // Upload to S3 (same bucket as unit tests or another one)
                    sh '''
                    echo "🏳️ Sending test artifacts to Ansible host..."
                    scp -r test-artifacts ansible@34.235.88.160:/tmp/test-artifacts
                    scp -r e2e-artifacts ansible@34.235.88.160:/tmp/e2e-artifacts
                    scp -r perf-artifacts ansible@34.235.88.160:/tmp/perf-artifacts
                    '''
                }
            }

        }
        stage('OWASP ZAP Scan') {
            steps {
                script {
                    sh """
                    echo "🕷️ Running OWASP ZAP DAST scan on E2E instance..."
                    ssh ubuntu@3.88.179.247 '
                        docker run --rm --network host \
                        -v ~/zap-results:/zap/wrk/:rw \
                        ghcr.io/zaproxy/zaproxy:latest \
                        zap-baseline.py -t http://54.157.237.38:8080 -r report.html -m 2
                    '
                    """
                }
            }
            post {
                always {
                    sh '''
                    scp -r ubuntu@3.88.179.247:~/zap-results/* ./zap-artifacts/ || true
                    '''
                    archiveArtifacts artifacts: 'zap-artifacts/**', fingerprint: true
                    sh '''
                    echo "🏳️ Sending security tests artifacts to Ansible host..."
                    scp npm-audit.json ansible@34.235.88.160:/tmp/npm-audit.json
                    scp trivy-report.json ansible@34.235.88.160:/tmp/trivy-report.json
                    ssh ansible@34.235.88.160 "mkdir -p /tmp/zap-artifacts"
                    scp -r zap-artifacts/* ansible@34.235.88.160:/tmp/zap-artifacts/
                    '''

                    sh '''
                    echo "🪣 Uploading test Artifacts to S3 Bucket."
                    ssh ansible@34.235.88.160 "ansible-playbook ~/ansible-playbooks/upload-test-artifacts.yml"
                    '''
                }
            }
        }

    }
}
