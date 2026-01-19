pipeline {
  agent any
  environment {
    REGISTRY = "192.168.1.17:5000"
    IMAGE_NAME = "${JOB_BASE_NAME}"
  }
  stages {
    stage('Checkout') { steps { checkout scm } }
    stage('Determine') {
      steps {
        script {
          if (env.BRANCH_NAME == 'production') {
            env.IMG_TAG = 'latest'; env.DEPLOY_DIR = '/srv/docker/production'
          } else if (env.BRANCH_NAME == 'staging') {
            env.IMG_TAG = 'staging'; env.DEPLOY_DIR = '/srv/docker/staging'
          } else {
            env.IMG_TAG = "${env.BRANCH_NAME}-${env.BUILD_NUMBER}"; env.DEPLOY_DIR = '/srv/docker/staging'
          }
        }
      }
    }
    stage('Build') {
      steps {
        sh "docker build -t ${REGISTRY}/${IMAGE_NAME}:${IMG_TAG} ."
      }
    }
    stage('Push') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'registry-creds', usernameVariable: 'REG_USER', passwordVariable: 'REG_PASS')]) {
          sh "echo $REG_PASS | docker login ${REGISTRY} -u $REG_USER --password-stdin"
        }
        sh "docker push ${REGISTRY}/${IMAGE_NAME}:${IMG_TAG}"
      }
    }
    stage('Deploy') {
      steps {
        sshagent (credentials: ['deploy-ssh-key']) {
          sh "ssh -o StrictHostKeyChecking=no deploy@your.server.ip 'cd ${DEPLOY_DIR} && docker compose pull && docker compose up -d --remove-orphans'"
        }
      }
    }
  }
  post {
    always {
      echo "Cleaning up dangling images..."
      sh "docker image prune -f"
    }
    failure {
      // Ensure the strings are enclosed in double quotes for ${} interpolation
      echo "Build Failed. Check logs at: ${env.BUILD_URL}"
      // If you are using mail, ensure the braces match exactly:
    script {
        echo "Sending failure notification..."
    }
    }
  }
}