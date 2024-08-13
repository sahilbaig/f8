#!/bin/bash

# Function to display usage
usage() {
    echo "Usage: $0 <username> <password>"
    exit 1
}

# Function to check if the user exists
check_user_exists() {
    local username="$1"
    if ! id "$username" &>/dev/null; then
        echo "User $username does not exist."
        exit 1
    fi
}

# Function to change the user's password
change_password() {
    local username="$1"
    local password="$2"
    echo "$username:$password" | sudo chpasswd

    # Check if the password change was successful
    if [ $? -eq 0 ]; then
        echo "Password for user $username changed successfully."
    else
        echo "Failed to change password for user $username."
        exit 1
    fi
}

# Main script execution
main() {
    # Check if the correct number of arguments are provided
    if [ "$#" -ne 2 ]; then
        usage
    fi

    local username="$1"
    local password="$2"

    # Perform operations
    check_user_exists "$username"
    change_password "$username" "$password"
}

# Call the main function with all script arguments
main "$@"
