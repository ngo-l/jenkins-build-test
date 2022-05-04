//demo pr merge build test 07
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

     environment {

        //Deployment env

        //project credentials or env

    }

    stages{
                stage('master env test') {
                  when {
                       load "envvars"
                        GIT_BRANCH = "master"
                        environment(name: "ENV", value: "production")
                  }
                  steps {
                      container('buildah') {
                        load "envvars"
                          echo "${env.DB_URL}"
                          echo "${env.DB_URL2}"
                          }
                      }
            }

              stage('staging env test') {
                  when {
                        load "envvars"
                        GIT_BRANCH = "staging"
                        environment(name: "ENV", value: "staging")
                  }
                  steps {
                      container('buildah') {
                          echo "staging demo "
                          }
                      }
                }
    }  
}