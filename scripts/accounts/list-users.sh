#!/bin/bash

echo "["

# Get each user entry
getent passwd | while IFS=: read -r name password uid gid gecos home shell; do
    # Only list normal users (typically UID >= 1000)
    if [ $uid -ge 1000 ]; then
        # Get groups for the user
        user_groups=$(id -nG $name | xargs)
        
        # Check if user has sudo privileges
        sudo_access="false"
        if echo "$user_groups" | grep -qw "sudo" || echo "$user_groups" | grep -qw "wheel"; then
            sudo_access="true"
        fi

        # JSON output
        echo "{"
        echo "  \"name\": \"$name\","
        echo "  \"groups\": \"$user_groups\","
        echo "  \"sudo\": \"$sudo_access\""
        echo "},"
    fi

done | sed '$ s/,$//'

echo "]"
