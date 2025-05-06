<#
.SYNOPSIS
    Sets up a Node.js app and MongoDB as a single-instance Kubernetes deployment inside Minikube.
.DESCRIPTION
    - Deletes any existing deployments and services for Node.js and MongoDB
    - Generates `node-deployment.yaml` and `mongo-deployment.yaml`
    - Builds the Node.js Docker image using Minikube's Docker
    - Deploys both Node.js and MongoDB into the Minikube cluster
.PARAMETER mongoUrl
    Not used anymore. MongoDB runs inside the cluster and service DNS is used.
#>
param()

# Step 0: Cleanup existing resources
Write-Host "Cleaning up existing Kubernetes resources..."
kubectl delete deployment flat-listing-service --ignore-not-found
kubectl delete service flat-listing-service --ignore-not-found
kubectl delete deployment mongo --ignore-not-found
kubectl delete service mongo --ignore-not-found

# Step 1: Generate MongoDB manifest
Write-Host "Generating mongo-deployment.yaml..."
$mongoYaml = @'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mongo
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mongo
  template:
    metadata:
      labels:
        app: mongo
    spec:
      containers:
      - name: mongo
        image: mongo:latest
        ports:
        - containerPort: 27017
        args: ["--bind_ip_all"]
        readinessProbe:
          tcpSocket:
            port: 27017
          initialDelaySeconds: 5
          periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: mongo
spec:
  selector:
    app: mongo
  ports:
  - protocol: TCP
    port: 27017
    targetPort: 27017
'@
$mongoYaml | Out-File -FilePath "mongo-deployment.yaml" -Encoding UTF8
Write-Host "mongo-deployment.yaml created."

# Step 2: Generate Node.js app deployment YAML
Write-Host "Generating node-deployment.yaml..."
$nodeYaml = @'
apiVersion: apps/v1
kind: Deployment
metadata:
  name: flat-listing-service
spec:
  replicas: 2
  selector:
    matchLabels:
      app: flat-listing-service
  template:
    metadata:
      labels:
        app: flat-listing-service
    spec:
      containers:
      - name: flat-listing-service
        image: flat-listing-service:latest
        imagePullPolicy: IfNotPresent
        ports:
        - containerPort: 3000
        env:
        - name: MONGO_URI
          value: "mongodb://mongo:27017/flatlisting"
---
apiVersion: v1
kind: Service
metadata:
  name: flat-listing-service
spec:
  selector:
    app: flat-listing-service
  ports:
  - protocol: TCP
    port: 3000
    targetPort: 3000
  type: NodePort
'@
$nodeYaml | Out-File -FilePath "node-deployment.yaml" -Encoding UTF8
Write-Host "node-deployment.yaml created."

# Step 3: Use Minikube Docker daemon
Write-Host "Switching to Minikube Docker environment..."
& minikube -p minikube docker-env | Invoke-Expression
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to switch to Minikube Docker environment."
    exit 1
}
Write-Host "Docker environment configured for Minikube."

# Step 4: Build Docker image for Node.js app
Write-Host "Building Docker image 'flat-listing-service:latest'..."
docker build -t flat-listing-service:latest .
if ($LASTEXITCODE -ne 0) {
    Write-Error "Docker build failed with exit code $LASTEXITCODE."
    exit 1
}
Write-Host "Docker image built successfully."

# Step 5: Apply MongoDB and Node.js deployments
Write-Host "Deploying MongoDB and Node.js app to Minikube..."
kubectl apply -f mongo-deployment.yaml
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to deploy MongoDB."
    exit 1
}
kubectl apply -f node-deployment.yaml
if ($LASTEXITCODE -ne 0) {
    Write-Error "Failed to deploy Node.js app."
    exit 1
}
Write-Host "Both services deployed."

Write-Host "Script complete. Node.js app and MongoDB are deployed inside Minikube."
