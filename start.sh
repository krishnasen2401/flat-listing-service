#!/bin/bash

echo "Starting MongoDB and Flatlisting Service..."

# Build and start the services defined in docker-compose.yml
docker-compose up --build

# Wait for the services to be fully up and running
echo "Docker Compose finished."
