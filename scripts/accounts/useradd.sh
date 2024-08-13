#!/bin/bash

# Function to display usage information
function usage() {
    echo "Usage: $0 <username> <password>"
    exit 1
}

# Function to check if the correct number of arguments are provided
function validate_input() {
    if [ "$#" -ne 2 ]; then
        usage
    fi
}

# Function to check if the user already exists
function user_exists() {
    if id "$1" &>/dev/null; then
        echo "Error: User $1 already exists."
        exit 1
    fi
}

# Function to create a new user with a home directory and bash shell
function create_user() {
    sudo useradd -m -s /bin/bash "$1"
    if [ $? -ne 0 ]; then
        echo "Error: Failed to create user $1."
        exit 1
    fi
}

# Function to set the password for the new user
function set_password() {
    echo "$1:$2" | sudo chpasswd
    if [ $? -ne 0 ]; then
        echo "Error: Failed to set password for user $1."
        exit 1
    fi
}

# Function to confirm that the user has been created successfully
function confirm_user_creation() {
    if id "$1" &>/dev/null; then
        echo "User $1 created successfully."
    else
        echo "Error: Failed to create user $1."
        exit 1
    fi
}

# Main script execution
function main() {
    validate_input "$@"
    
    local username="$1"
    local password="$2"

    user_exists "$username"
    create_user "$username"
    set_password "$username" "$password"
    confirm_user_creation "$username"
}

# Run the main function with all arguments
main "$@"
