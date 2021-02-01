# che-zero

## Disclaimer

* This readme assumes that 192.168.99.100 is the IP for minikube. You can find the IP on your setup using ` minikube ip`.
* If your IP differs from the default, you can set it as environment variable `REACT_APP_CHE_DOMAIN`. E.g. if your Che runs on minikube with `export REACT_APP_CHE_DOMAIN=$(minikube ip).nip.io`
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

The Che API can be opened with or without using the Che operator.

### Without Che operator

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

### With Che operator

Set the required environment variables by patching the operator configuration.
The operator will then automatically restart affected deployments of Che.

```
kubectl patch checluster/eclipse-che -n che --type=merge --patch "$(cat che-cors-settings-patch.yaml)"
```

## Use different identify provider for login (Google Example)

### Google Example

* Do not use your company account for this!
* Go to https://console.developers.google.com/ and create a project
* Create new credentials. We want OAuth Client ID. 
* Choose web application as application type.
* Authorized redirct URI is https://keycloak-che.192.168.99.100.nip.io/auth/realms/che/broker/google/endpoint
* Note down client id and secret (Keepass)

### Enable in Keycloak

* Login to admin console
* Identify providers page -> Add provider... -> Google
* Enter client ID and Secret

### Skip Keycloak Login Page and go directely to Google

* Login to admin console in keycloak
* Authentication menu item -> Flows Tab -> Select Browser from Drop down -> In Identity Provider row select Actions -> Config
* Create authenticator config with "google" as Default identify provider