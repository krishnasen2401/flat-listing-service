# setup-nodejs.ps1

<#
.SYNOPSIS
    Generates Kubernetes YAML manifest and builds the Node.js Docker image.
.DESCRIPTION
    This script creates a `node-deployment.yaml` file with the correct MONGO_URL environment variable
    placeholder, then builds the Docker image for the flat-listing-service, tagging it as `flat-listing-service:latest`.
#>

param(
    [string]$mongoUrl = "mongodb://<HOST_IP>:27017/flatlisting"
)

# 1. Generate node-deployment.yaml
#    This manifest defines a Deployment and Service for the Node.js app.
#    The Deployment injects the MONGO_URL environment variable into the container.
Write-Host "Generating node-deployment.yaml..."
$yaml = @"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: flat-listing-service
spec:
  replicas: 2                     # number of pod replicas
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
        imagePullPolicy: IfNotPresent  # use local image when available
        ports:
        - containerPort: 3000         # container listens on port 3000
        env:
        - name: MONGO_URL             # MongoDB connection string
          value: "$mongoUrl"
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
      port: 3000                   # service port
      targetPort: 3000             # container port
  type: NodePort                  # expose as NodePort for external access
"@
$yaml | Out-File -FilePath "node-deployment.yaml" -Encoding UTF8
Write-Host "✔ node-deployment.yaml created."

# 2. Build Docker image
#    Builds the Docker image from the local Dockerfile in this directory.
Write-Host "Building Docker image 'flat-listing-service:latest'..."
try {
    docker build -t flat-listing-service:latest .
    Write-Host "✔ Docker image 'flat-listing-service:latest' built successfully."
} catch {
    Write-Error "Failed to build Docker image: $_"
    exit 1
}

Write-Host "Script complete. You can now apply 'node-deployment.yaml' to your cluster and run your image."
