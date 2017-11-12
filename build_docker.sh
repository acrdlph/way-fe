#!/bin/sh

echo "Building static content"

npm run build

echo "Building docker image"

docker build -t waitlist-fe .

echo "Tagging image"

docker tag waitlist-fe:latest 614992511822.dkr.ecr.eu-central-1.amazonaws.com/waitlist-fe:latest

echo "Pushing image to repo"

docker push 614992511822.dkr.ecr.eu-central-1.amazonaws.com/waitlist-fe:latest
