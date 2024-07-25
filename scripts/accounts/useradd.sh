#!/bin/bash

# Check if the correct number of arguments are provided
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <username> <password>"
    exit 1
fi

username="$1"
password="$2"

# Create the user with a home directory and bash shell
sudo useradd -m -s /bin/bash "$username"

# Set the password for the new user
echo "$username:$password" | sudo chpasswd

# Confirm the user creation and password change
if id "$username" &>/dev/null; then
    echo "User $username created successfully."
else
    echo "Failed to create user $username."
fi
