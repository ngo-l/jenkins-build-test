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


    stages{
                stage('master env test') {
                  steps {
                      container('buildah') {
                            echo env.BRANCH_NAME 
                            sh 'printenv'
                            sh 'echo $GIT_BRANCH'
                            echo "${env.GIT_BRANCH}"
                          }
                      }    
            }

              stage('staging env test') {
                  when {
                    //GIT_BRANCH 'origin/master'
                        //expression { env.GIT_BRANCH = "origin/master" }
                        expression { env.GIT_BRANCH ==~ /(master)/ }
                  }
                  steps {
                      container('buildah') {
                        load "envvars"
                          echo "${env.DB_URL}"
                          echo "${env.DB_URL2}"
                          }
                      }
                }
    }  
}