pipeline {
    agent any

    environment {
        NODE_VERSION = '18'
    }

    stages {
        stage('Install Node.js') {
            steps {
                script {
                    // Install Node.js using nvm if available, else use system node
                    sh '''
                        if command -v nvm > /dev/null; then
                            . ~/.nvm/nvm.sh
                            nvm install $NODE_VERSION
                            nvm use $NODE_VERSION
                        fi
                        node -v
                        npm -v
                    '''
                }
            }
        }
        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }
    }
}