# che-zero

## Disclaimer

* This readme assumes that 192.168.99.100 is the IP for minikube. You can find the IP on your setup using ` minikube ip`
* Che setups are a bit brittle (Che Updates, Kubernetes Updates, Minikube Updates) so parts of this setup may be out of date. The following versions were used as of writing:
  * minikube version: v1.7.3
  * Kubernetes Server Version: Major:"1", Minor:"17", GitVersion:"v1.17.3"
  * Chectl version: chectl/7.11.0 linux-x64 node-v10.19.0

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

* Get settings from [https://che-che.192.168.99.100.nip.io/api/keycloak/settings](https://che-che.192.168.99.100.nip.io/api/keycloak/settings)

## Allow redirects/CORS from Web App

* go to [https://keycloak-che.192.168.99.100.nip.io/](https://keycloak-che.192.168.99.100.nip.io/) and log in to the admin console (User: admin | Password: admin)
* Navigate Clients -> Che-public -> add localhost:3000 to "Valid Redirect URIs" and "Web Origins". See the existing entries and create similar ones using the local host URL (Add http and https urls. urls end with /*/ for "Valid Redirect URIs")

## Open CHE API for Web App

* Disable Operator `kubectl scale --replicas=0 deployment/che-operator -n che` because the operator will undo the changes we make in the next step. 
* `kubectl edit configmap che -n che` and add the following (the keys should not exist yet)
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