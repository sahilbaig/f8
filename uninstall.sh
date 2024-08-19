#!/bin/bash

# Define the destination directories
DEST_DIR="/opt/F8Tech/backend"
SERVICE_DIR="/etc/systemd/system"
SUDOERS_FILE="/etc/sudoers.d/F8Tech"
SERVICE_FILES=("F8-Backend-Test.service" "F8-Backend.service")

# Stop and disable the services
for SERVICE_FILE in "${SERVICE_FILES[@]}"; do
    if systemctl is-active --quiet "$SERVICE_FILE"; then
        sudo systemctl stop "$SERVICE_FILE"
    fi
    if systemctl is-enabled --quiet "$SERVICE_FILE"; then
        sudo systemctl disable "$SERVICE_FILE"
    fi
done

# Remove the service files
for SERVICE_FILE in "${SERVICE_FILES[@]}"; do
    if [ -f "$SERVICE_DIR/$SERVICE_FILE" ]; then
        sudo rm -f "$SERVICE_DIR/$SERVICE_FILE"
    fi
done

# Remove the sudoers file
if [ -f "$SUDOERS_FILE" ]; then
    sudo rm -f "$SUDOERS_FILE"
    echo "Sudoers file removed: $SUDOERS_FILE"
fi

# Reload the systemd daemon to apply changes
sudo systemctl daemon-reload

# Remove ttyd binary
if [ -f /usr/local/bin/ttyd ]; then
    echo "Removing ttyd..."
    sudo rm -f /usr/local/bin/ttyd
    echo "ttyd removed."
fi

# Optional: Only remove specific packages if they are not needed by other software
echo "Removing terminal dependencies used by ttyd..."
sudo apt-get remove --purge -y libwebsockets-dev libjson-c-dev
sudo apt-get autoremove -y
echo "Terminal dependencies used by ttyd removed."

# Remove the destination directory
sudo rm -rf "$DEST_DIR"

echo "Uninstallation complete. The project directory, service files, sudoers file, ttyd, and specific terminal dependencies have been removed."
