docker pull mongo:latest
docker run -d \
  --name mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_DATABASE=flatlisting \
  mongo:latest
 
 only after mongodb is running then do

First run setup-nodejs.ps1

then these

docker build -t flat-listing-service:latest . (optional should be built by last step as well)
minikube docker-env
minikube -p minikube docker-env --shell powershell | Invoke-Expression
& minikube -p minikube docker-env | Invoke-Expression
kubectl apply -f node-deployment.yaml