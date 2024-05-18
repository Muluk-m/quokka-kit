#!/bin/bash

docker run --rm --privileged -v $(pwd):/app -v ~/.npmrc:~/.npmrc -w /app node:16-slim bash -c "bash ./bin/preinstall.sh"