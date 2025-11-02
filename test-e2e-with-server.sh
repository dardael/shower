#!/bin/bash

# Start the server in background
echo "Starting server..."
npm run build > /dev/null 2>&1
npm run start > server.log 2>&1 &
SERVER_PID=$!

# Wait for server to be ready
echo "Waiting for server to start..."
for i in {1..30}; do
  if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "Server is ready!"
    break
  fi
  echo "Waiting for server... ($i/30)"
  sleep 2
done

if ! curl -s http://localhost:3000 > /dev/null 2>&1; then
  echo "Server failed to start"
  kill $SERVER_PID
  exit 1
fi

# Run e2e tests
echo "Running e2e tests..."
npx playwright test

# Cleanup
echo "Cleaning up..."
kill $SERVER_PID

echo "Tests completed!"