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
                stage('load env test') {
                  steps {
                      container('buildah') {
                        load "envvars"
                          }
                      }    
            }

              stage('staging env test') {

              when{
                expression {
                  return env.GIT_BRANCH == "origin/master"
                }
              }
                  steps {
                      container('buildah') {
                          echo "${GIT_REPO}"
                          echo "${GIT_BRANCH}"
                          }
                      }
                }

              stage('env test') {

                  steps {
                      container('buildah') {
                          echo "${APPIMG}"

                          }
                      }
                }                
    }  
}