#!/bin/bash

# Function to display usage information
function usage() {
    echo "Usage: $0 <username> <del_all>"
    exit 1
}

# Function to check if the correct number of arguments are provided
function validate_input() {
    if [ "$#" -ne 2 ]; then
        usage
    fi
}

# Function to kill all processes for the specified user
function kill_user_processes() {
    local username="$1"
    echo "Killing all processes for user $username..."
    sudo killall -u "$username"
    if [ $? -ne 0 ]; then
        echo "Warning: Failed to kill processes for user $username, or no processes found."
    fi
}

# Function to delete the user
function delete_user() {
    local username="$1"
    local del_all="$2"

    if [ "$del_all" == "true" ]; then
        echo "Deleting user $username and their home directory..."
        sudo userdel -r "$username"
    else
        echo "Deleting user $username..."
        sudo userdel "$username"
    fi

    if [ $? -ne 0 ]; then
        echo "Error: Failed to delete user $username."
        exit 1
    fi
}

# Function to confirm user deletion
function confirm_user_deletion() {
    local username="$1"

    if id "$username" &>/dev/null; then
        echo "User $username has not been deleted successfully."
        exit 1
    else
        echo "User $username deleted successfully."
    fi
}

# Main script execution
function main() {
    validate_input "$@"
    
    local username="$1"
    local del_all="$2"

    kill_user_processes "$username"
    delete_user "$username" "$del_all"
    confirm_user_deletion "$username"
}

# Run the main function with all arguments
main "$@"
