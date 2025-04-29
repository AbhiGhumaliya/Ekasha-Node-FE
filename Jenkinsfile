pipeline {
    agent any

    environment {
        CI = 'false'
    }

    stages {
        stage('Build') {
            steps {
                sh '''
                    yarn install
                    yarn build
                '''
                // sh 'cd /var/lib/jenkins/workspace/Ekashafrontend/build && zip -r frontend-build.zip *'
            }
        }

        stage('SonarQube Analysis') {
            steps {
                script {
                    // def scannerHome = tool name: 'SonerQube_5.0.1.3006', type: 'hudson.plugins.sonar.SonarRunnerInstallation'
                    withSonarQubeEnv('SonarQubeServer') {
                        sh '''
                            ${JENKINS_HOME}/tools/hudson.plugins.sonar.SonarRunnerInstallation/SonerQube_5.0.1.3006/bin/sonar-scanner \
                            -Dsonar.host.url=http://10.1.4.16:9000 \
                            -Dsonar.login=${SonarQubeSecretKey} \
                            -Dsonar.projectKey=Ekashafrontend \
                            -Dsonar.projectName=Ekashafrontend
                        '''
                    }
                }
            }
        }
    }
}
