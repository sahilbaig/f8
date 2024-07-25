#!/bin/bash

# Check if the correct number of arguments are provided
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <username> <del_all>"
    exit 1
fi

username="$1"
del_all="$2"

# Kill all processes for the specified user
sudo killall -u "$username"

# Delete the user
if [ "$del_all" == "true" ]; then
    sudo userdel -r "$username"
else
    sudo userdel "$username"
fi

# Confirm the user deletion
if id "$username" &>/dev/null; then
    echo "User $username has not been deleted successfully."
else
    echo "User $username deleted successfully."
fi
