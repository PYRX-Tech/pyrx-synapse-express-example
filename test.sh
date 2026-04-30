#!/usr/bin/env bash
set -uo pipefail
source "$(dirname "$0")/../test-helpers.sh"
[[ -z "${SYNAPSE_API_KEY:-}" ]] && echo "Set SYNAPSE_API_KEY" && exit 1
BASE_URL="http://localhost:3000"

echo "Installing..."
npm install > /dev/null 2>&1

echo "Starting server on port 3000..."
npm run dev > /dev/null 2>&1 &
SERVER_PID=$!
trap "kill $SERVER_PID 2>/dev/null; wait $SERVER_PID 2>/dev/null" EXIT

wait_for_server "$BASE_URL" 15 || exit 1
echo "Server ready. Running tests..."
run_tests_standard
print_results
