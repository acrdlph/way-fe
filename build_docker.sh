#!/bin/sh

DOCKER_LOGIN="$(aws ecr get-login --no-include-email --region eu-central-1)"

$DOCKER_LOGIN

echo "Building static content"

./node_modules/.bin/gulp build --hostname ecs-eu-dev-1571006243.eu-central-1.elb.amazonaws.com --port 8080

echo "Building docker image"

docker build -t waitlist-fe .

echo "Tagging image"

CURRENT_HASH="$(git rev-parse --abbrev-ref HEAD)-$(git rev-parse HEAD | cut -c1-6)"

docker tag waitlist-fe 614992511822.dkr.ecr.eu-central-1.amazonaws.com/waitlist-fe:$CURRENT_HASH

echo "Pushing image to repo"

docker push 614992511822.dkr.ecr.eu-central-1.amazonaws.com/waitlist-fe:$CURRENT_HASH

echo "Deploying to eu-dev"

./ecs-deploy-0ab06b -r eu-central-1 -c eu-dev -n wailist-fe-dev -i 614992511822.dkr.ecr.eu-central-1.amazonaws.com/waitlist-fe:$CURRENT_HASH
