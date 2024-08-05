#!/bin/bash

# Check if the correct number of arguments is provided
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <log_file_path> <size>"
    exit 1
fi

LOG_FILE="$1"
SIZE="$2"

# Check if the log file exists
if [ ! -f "$LOG_FILE" ]; then
    echo "Error: Log file '$LOG_FILE' does not exist."
    exit 1
fi

# Output the specified number of lines from the log file
sudo tail -n "$SIZE" "$LOG_FILE"