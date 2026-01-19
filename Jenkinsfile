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
            env.IMG_TAG = 'prod' ?: sh(script: "git rev-parse --abbrev-ref HEAD", returnStdout: true).trim(); env.DEPLOY_DIR = '/srv/docker/production'
          } else if (env.BRANCH_NAME == 'staging') {
            env.IMG_TAG = 'staging' ?: sh(script: "git rev-parse --abbrev-ref HEAD", returnStdout: true).trim(); env.DEPLOY_DIR = '/srv/docker/staging'
          } else {
            env.IMG_TAG = "${env.BRANCH_NAME}-${env.BUILD_NUMBER}"; env.DEPLOY_DIR = '/srv/docker/staging'
          }
        }
      }
    }
    stage('Build') {
      steps {
        sh "docker build -f /srv/dockerfiles/frontend/Dockerfile -t frontend:staging ."
        sh "docker build -f /srv/dockerfiles/backend/Dockerfile -t backend:staging ."

        sh "docker tag frontend:staging ${REGISTRY}/frontend:staging"
        sh "docker tag backend:staging ${REGISTRY}/backend:staging"
      }
    }
    stage('Push') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'registry-creds', usernameVariable: 'REG_USER', passwordVariable: 'REG_PASS')]) {
          sh "echo $REG_PASS | docker login ${REGISTRY} -u $REG_USER --password-stdin"
        }
        sh "docker push ${REGISTRY}/frontend:staging"
        sh "docker push ${REGISTRY}/backend:staging"
      }
    }
    stage('Deploy') {
      steps {
        sshagent (credentials: ['deploy-ssh-key']) {
          sh "ssh -o StrictHostKeyChecking=no blackcrow@192.168.1.17 'cd ${DEPLOY_DIR} && docker compose pull && docker compose up -d --remove-orphans'"
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
