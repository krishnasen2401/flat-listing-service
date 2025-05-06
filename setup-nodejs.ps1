# setup-nodejs.ps1
# 1. Start MongoDB in Docker (exposed on port 27017)
docker run -d --name mongodb -p 27017:27017 -e MONGO_INITDB_DATABASE=flatlisting mongo:6

# 2. Get host IP for Minikube to use
$hostIP = (Get-NetIPAddress -AddressFamily IPv4 `
           | Where-Object {$_.InterfaceAlias -notlike "*Loopback*" -and $_.IPAddress -notlike "169.*"} `
           | Select-Object -First 1).IPAddress

Write-Host "Host IP for MongoDB: $hostIP"

# 3. Replace HOST_IP in template and save as node-deployment.yaml
$template = @"
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
        ports:
        - containerPort: 3000
        env:
        - name: MONGO_URL
          value: "mongodb://$hostIP:27017/flatlisting"
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
"@

$template | Set-Content -Path ".\node-deployment.yaml"

# 4. Build Docker image inside Minikube
minikube image build -t flat-listing-service .

# 5. Apply the deployment
kubectl apply -f node-deployment.yaml

Write-Host "`n✅ Node.js app deployed and connected to MongoDB on host ($hostIP:27017)"
