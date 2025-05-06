param(
    [Parameter(Mandatory=$false)]
    [string]$mongoUrl = "mongodb://<HOST_IP>:27017/flatlisting"
)

# 1. Generate node-deployment.yaml
Write-Host "Generating node-deployment.yaml with MongoDB URL: $mongoUrl"
$yaml = @"
apiVersion: apps/v1
kind: Deployment
metadata:
  name: flat-listing-service
spec:
  replicas: 1                     # number of pod replicas
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
        imagePullPolicy: IfNotPresent  # prefer local image
        ports:
        - containerPort: 3000         # container listens on 3000
        env:
        - name: MONGO_URL             # inject MongoDB connection string
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
      port: 3000                   # exposed service port
      targetPort: 3000             # container port
  type: NodePort                  # NodePort for external access
"@
$yaml | Out-File -FilePath "node-deployment.yaml" -Encoding UTF8
Write-Host "node-deployment.yaml created."

# 2. Build Docker image locally
Write-Host "Building Docker image 'flat-listing-service:latest'..."
docker build -t flat-listing-service:latest .
if ($LASTEXITCODE -ne 0) {
    Write-Error "Docker build failed with exit code $LASTEXITCODE."
    exit 1
}
Write-Host "Docker image built successfully."

Write-Host "Script complete. You can now apply 'node-deployment.yaml' to your cluster."
