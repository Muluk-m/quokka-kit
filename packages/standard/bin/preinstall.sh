#!/bin/bash
set -eo pipefail

readonly PNPM_VERSION=8.15.4

display_info() {
    echo "npm registry: $(npm config get registry)"
    echo "node version: $(node -v)"
    echo "pnpm version: $(npx pnpm -v)"
    echo "$(whoami)"
}

install_pnpm() {
    npm install -g pnpm@"$PNPM_VERSION"
}

run_install() {
    install_pnpm
    echo "start install deps"
    pnpm install --force
    echo "end install deps"
}

run_build() {
    pnpm run build
}

main() {
    display_info

    if [ "$1" = "install" ]; then
        run_install
    else
        run_install
        run_build
    fi
}

main "$1"
