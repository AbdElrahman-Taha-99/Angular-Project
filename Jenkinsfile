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
                
                sh '''
                echo "🏳️ Sending test artifacts to Ansible host..."
                scp -r test-artifacts ansible@34.235.88.160:/tmp/test-artifacts
                '''
                sh '''
                echo "🪣 Uploading test Artifacts to S3 Bucket."
                ssh ansible@34.235.88.160 "ansible-playbook ~/ansible-playbooks/upload-test-artifacts.yml"
                '''
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
    }

}
