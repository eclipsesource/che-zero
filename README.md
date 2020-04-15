# che-zero

## Local Multi-User Che on Minikube

* Install virtualbox ([https://www.virtualbox.org/wiki/Downloads](URL))
* Install kubectl ([https://kubernetes.io/docs/tasks/tools/install-kubectl/](URL))
* Install minikube ([https://kubernetes.io/docs/tasks/tools/install-minikube/](URL))
* Install helm ([https://helm.sh/docs/intro/install/](URL))
* Install chectl ([https://github.com/che-incubator/chectl#installation](URL))
* Start minikube: `minikube start --memory=8192 --cpus=4 --disk-size=50g --vm-driver=virtualbox`
* Install self-signed certificates for local multi user setup: [https://www.eclipse.org/che/docs/che-7/installing-che-in-tls-mode-with-self-signed-certificates/](URL)
* Start che: `chectl server:start --platform=minikube --installer=operator --self-signed-cert --multiuser --skip-cluster-availability-check`

## Config options for Web App

* Get settings from [https://che-che.192.168.99.100.nip.io/api/keycloak/settings](URL)

## Allow redirects/CORS from Web App

* go to [https://keycloak-che.192.168.99.100.nip.io/](URL)
*  Clients -> Che-public -> add localhost:3000 to "Valid Redirect URIs" and "Web Origins"