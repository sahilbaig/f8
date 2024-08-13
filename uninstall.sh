#!/bin/bash

# Define the destination directories
DEST_DIR="/opt/F8Tech/backend"
SERVICE_DIR="/etc/systemd/system"
SUDOERS_FILE="/etc/sudoers.d/F8Tech"
SERVICE_FILES=("F8-Backend-Test.service" "F8-Backend.service")

# Stop and disable the services
for SERVICE_FILE in "${SERVICE_FILES[@]}"; do
    sudo systemctl stop "$SERVICE_FILE"
    sudo systemctl disable "$SERVICE_FILE"
done

# Remove the service files
for SERVICE_FILE in "${SERVICE_FILES[@]}"; do
    sudo rm -f "$SERVICE_DIR/$SERVICE_FILE"
done

# Remove the sudoers file
if [ -f "$SUDOERS_FILE" ]; then
    sudo rm -f "$SUDOERS_FILE"
    echo "Sudoers file removed: $SUDOERS_FILE"
fi

# Reload the systemd daemon to apply changes
sudo systemctl daemon-reload

# Remove the destination directory
sudo rm -rf "$DEST_DIR"

echo "Uninstallation complete. The project directory, service files, and sudoers file have been removed."
