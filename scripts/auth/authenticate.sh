#!/bin/bash

# Check if the script received exactly two arguments
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <username> <password>"
    exit 1
fi

username=$1
password=$2

# Function to check authentication
check() {
    # Use a here-document to simulate typing the password
    echo "$password" | su -c "exit" "$username" > /dev/null 2>&1
    if [ $? -eq 0 ]; then
        echo "True"
    else
        echo "False"
    fi
}

# Call the check function
check
