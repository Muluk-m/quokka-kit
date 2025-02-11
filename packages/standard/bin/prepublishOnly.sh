#!/bin/bash

docker run --rm --privileged \
  -v $(pwd):/app \
  -v $HOME/.npmrc:/root/.npmrc \
  -w /app \
  node:16-slim bash -c "bash ./bin/preinstall.sh"