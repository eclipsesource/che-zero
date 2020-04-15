# che-zero

## Local Multi-User Che on Minikube

* Install virtualbox ([https://www.virtualbox.org/wiki/Downloads](https://www.virtualbox.org/wiki/Downloads))
* Install kubectl ([https://kubernetes.io/docs/tasks/tools/install-kubectl/](https://kubernetes.io/docs/tasks/tools/install-kubectl/))
* Install minikube ([https://kubernetes.io/docs/tasks/tools/install-minikube/](https://kubernetes.io/docs/tasks/tools/install-minikube/))
* Install helm ([https://helm.sh/docs/intro/install/](https://helm.sh/docs/intro/install/))
* Install chectl ([https://github.com/che-incubator/chectl#installation](https://github.com/che-incubator/chectl#installation))
* Start minikube: `minikube start --memory=8192 --cpus=4 --disk-size=50g --vm-driver=virtualbox`
* Install self-signed certificates for local multi user setup: [https://www.eclipse.org/che/docs/che-7/installing-che-in-tls-mode-with-self-signed-certificates/](https://www.eclipse.org/che/docs/che-7/installing-che-in-tls-mode-with-self-signed-certificates/)
* Start che: `chectl server:start --platform=minikube --installer=operator --self-signed-cert --multiuser --skip-cluster-availability-check`

## Links

[https://keycloak-che.192.168.99.100.nip.io/](https://keycloak-che.192.168.99.100.nip.io/)

[https://che-che.192.168.99.100.nip.io/](https://che-che.192.168.99.100.nip.io/)

[https://che-che.192.168.99.100.nip.io/swagger](https://che-che.192.168.99.100.nip.io/swagger)


## Config options for Web App

* Get settings from [https://che-che.192.168.99.100.nip.io/api/keycloak/settings](URL)

## Allow redirects/CORS from Web App

* go to [https://keycloak-che.192.168.99.100.nip.io/](URL)
*  Clients -> Che-public -> add localhost:3000 to "Valid Redirect URIs" and "Web Origins"

## Open CHE API for Web App

* Disable Operator `kubectl scale --replicas=0 deployment/che-operator -n che` because the operator will undo the changes we make in the next step. 
* `kubectl edit configmap che -n che`
```
CHE_CORS_ENABLED: "true"
CHE_CORS_ALLOW__CREDENTIALS: "false"
CHE_CORS_ALLOWED__ORIGINS: "*"
CHE_WSAGENT_CORS_ENABLED: "true"
CHE_WSAGENT_CORS_ALLOW__CREDENTIALS: "true"
CHE_WSAGENT_CORS_ALLOWED__ORIGINS: "NULL"
```
* `kubectl scale --replicas=0 deployment/che -n che`
* `kubectl scale --replicas=1 deployment/che -n che`