#!/bin/sh

# Build the `flipt-aws` docker image
docker build -t flipt-aws ./flipt-aws
echo "Succesfully build flipt-aws docker image..."

# Start the minikube cluster
minikube start
echo "Successfully started minikube cluster..."

# Load in the `flipt-aws` docker image
minikube image load flipt-aws:latest
echo "Successfully loaded flipt-aws image into the cluster..."

# Deploy minio
kubectl apply -f ./manifests/minio.yml

# Wait for minio to be rolled out
kubectl rollout status deploy/minio

# Start minio-job to create bucket
kubectl apply -f ./manifests/minio-job.yml

# Wait for job to complete creating the bucket on minio
kubectl wait --for=condition=complete --timeout=1m job/create-bucket
echo "Successfully created flipt bucket on minio..."

# Deploy `flipt-master` and `sample-app`
kubectl apply -f ./manifests/flipt.yml