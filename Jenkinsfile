//demo merge test 
pipeline {
    agent {
        kubernetes {
            yaml '''
apiVersion: v1
kind: Pod
spec:
  containers:
  - name: buildah
    image: ngol/buildah:v1
    securityContext:
      privileged: true
    command:
    - cat
    tty: true
  - name: kubectl
    image: lachlanevenson/k8s-kubectl:v1.8.8
    command:
    - cat
    tty: true   
  tolerations:
  - key: "kubernetes.azure.com/scalesetpriority"
    operator: "Equal"
    value: "spot"
    effect: "NoSchedule"   

'''
            defaultContainer 'shell'
        }
    }
   stages {              
    stage('Build image') {
      steps {
        git url: "https://github.com/ngo-l/jenkins-build-test",branch: 'master'  
        container('buildah') {        
            withCredentials([sshUserPrivateKey(credentialsId: "9bcc9b80-6899-4b4b-8aa5-eb0080545418", keyFileVariable: 'keyfile')]) {
                // start ssh-agent
                sh "mkdir ~/.ssh/"
                sh 'ssh-agent /bin/bash'           
                // add private key to ssh-agent, check if private key is successfully added and git clone using the private key
                sh 'eval $(ssh-agent) && ssh-add ${keyfile} && ssh-add -l && ssh-keyscan github.com  >> ~/.ssh/known_hosts && git clone git@github.com:ngo-l/jenkins-build-test.git'
                }
            sh 'pwd && ls ./'
            //sh 'buildah bud -t betalabsk8sacr.azurecr.io/ngo/dev:test1'
            sh 'buildah images '
        }
      }
    }

        stage('Push image') {
      steps {
        container('buildah') {
            withCredentials([usernamePassword(credentialsId: 'betalabsk8sacr', passwordVariable: 'PWD', usernameVariable: 'USER')]) {
                  sh "buildah login -u=${USER} -p=${PWD} betalabsk8sacr.azurecr.io"                 
                  sh "buildah images"
                  //sh "buildah push betalabsk8sacr.azurecr.io/ngo/dev:test1"
            }
        }
      }
    }

  }
}