docker pull mongo:latest
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_DATABASE=flatlisting \
  mongo:latest
 
 only after mongodb is running then do

First run setup-nodejs.ps1

then these

kubectl delete deployment flat-listing-service (if deployed)
kubectl delete service flat-listing-service  (if deployed)

docker build -t flat-listing-service:latest . (optional should be built by last step as well)
minikube docker-env
minikube -p minikube docker-env --shell powershell | Invoke-Expression
& minikube -p minikube docker-env | Invoke-Expression
kubectl apply -f node-deployment.yaml

after deployment 
check using kubectl.exe get pods or kubectl rollout status deployment/flat-listing-service
kubectl.exe port-forward svc/flat-listing-service 3000:3000