#!/bin/bash

# Check if port is provided
if [ -z "$1" ]; then
  echo "Usage: $0 <port>"
  exit 1
fi

PORT=$1

# Function to check if the port is still in use
is_port_in_use() {
  lsof -i :$PORT > /dev/null
  return $?
}

# Check if anything is running on the specified port
PID=$(lsof -t -i:$PORT)

if [ -n "$PID" ]; then
  echo "Port $PORT is in use by process $PID. Killing it..."
  kill -9 $PID
  echo "Process $PID killed."

  # Wait for the process to release the port
  sleep 2

  # Double-check if the port is still in use
  if is_port_in_use; then
    echo "Error: Port $PORT is still in use. Retrying..."
    kill -9 $(lsof -t -i:$PORT)
    sleep 2
    if is_port_in_use; then
      echo "Error: Port $PORT could not be freed."
      exit 1
    fi
  fi
else
  echo "Port $PORT is free."
fi

# Run the ttyd command
echo "Starting ttyd on port $PORT..."
ttyd -p $PORT --writable bash
