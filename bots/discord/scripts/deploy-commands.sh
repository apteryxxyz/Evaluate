#!/usr/bin/env bash

ORIGINAL_DIR="$(pwd)"
SCRIPT_DIR="$(dirname $0)"

pushd $SCRIPT_DIR
ORIGINAL_DIR=$ORIGINAL_DIR pnpm tsx "scripts/deploy-commands.ts"
popd