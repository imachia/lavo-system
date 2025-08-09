#!/bin/bash

# Configurações
VPS_USER="seu-usuario"
VPS_HOST="seu-servidor"
IMAGE_NAME="lavo-system"
TAG="latest"

# Build da imagem
echo "Building Docker image..."
docker build -t $IMAGE_NAME:$TAG .

# Salvando imagem
echo "Saving image to file..."
docker save $IMAGE_NAME:$TAG > ${IMAGE_NAME}.tar

# Enviando para VPS
echo "Uploading to VPS..."
scp ${IMAGE_NAME}.tar $VPS_USER@$VPS_HOST:/tmp/

# Carregando imagem na VPS
echo "Loading image on VPS..."
ssh $VPS_USER@$VPS_HOST "docker load < /tmp/${IMAGE_NAME}.tar"

# Limpeza
echo "Cleaning up..."
rm ${IMAGE_NAME}.tar

echo "Done! Now you can deploy the stack in Portainer"
