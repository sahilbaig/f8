#!/bin/bash

# Check if the correct number of arguments are provided
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <group_to_add> <username>"
    exit 1
fi

group_to_add="$1"
username="$2"

# Add the user to the specified group
sudo usermod -aG "$group_to_add" "$username"

# Check if the command was successful
if [ $? -eq 0 ]; then
    echo "User $username added to group $group_to_add successfully."
else
    echo "Failed to add user $username to group $group_to_add."
fi
