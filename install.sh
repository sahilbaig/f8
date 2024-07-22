#!/bin/bash

# Define the source and destination directories
SOURCE_DIR="$(pwd)"
DEST_DIR="/opt/F8Tech/backend"
SERVICE_DIR="/etc/systemd/system"
CONFIG_DIR="$SOURCE_DIR/config"
SCRIPT_DIR="$SOURCE_DIR/scripts"
SUDOERS_FILE="/etc/sudoers.d/f8Tech"

# Define your specific service files
SERVICE_FILES=("F8-Backend-Test.service" "F8-Backend.service")

# Create the destination directory if it doesn't exist
if [ ! -d "$DEST_DIR" ]; then
    sudo mkdir -p "$DEST_DIR"
fi

# Copy the contents of the source directory to the destination directory
sudo cp -r "$SOURCE_DIR"/* "$DEST_DIR"

# Install dependencies in the destination directory
cd "$DEST_DIR"
npm install

# Create the systemd service directory if it doesn't exist
if [ ! -d "$SERVICE_DIR" ]; then
    sudo mkdir -p "$SERVICE_DIR"
fi

# Copy the service files to /etc/systemd/system and handle conflicts
for SERVICE_FILE in "${SERVICE_FILES[@]}"; do
    if [ -f "$SERVICE_DIR/$SERVICE_FILE" ]; then
        echo "Service file $SERVICE_FILE already exists. Removing the old file."
        sudo rm "$SERVICE_DIR/$SERVICE_FILE"
    fi
    sudo cp "$CONFIG_DIR/$SERVICE_FILE" "$SERVICE_DIR"
done

# Reload the systemd daemon to recognize the new service files
sudo systemctl daemon-reload

# Start and enable the services
for SERVICE_FILE in "${SERVICE_FILES[@]}"; do
    sudo systemctl start "$SERVICE_FILE"
    sudo systemctl enable "$SERVICE_FILE"
done

# Make all Python and .sh scripts in the /scripts directory and its subdirectories executable
if [ -d "$SCRIPT_DIR" ]; then
    sudo find "$SCRIPT_DIR" -type f \( -name "*.py" -o -name "*.sh" \) -exec chmod +x {} \;
else
    echo "No /scripts directory found in the current directory."
fi

# Create and configure the sudoers file for f8Tech
echo "Creating and configuring sudoers file for f8Tech..."
sudo bash -c "echo 'ALL ALL=(ALL) NOPASSWD: /opt/F8Tech/backend/scripts/**' > $SUDOERS_FILE"

# Ensure the sudoers file has correct permissions
sudo chmod 440 "$SUDOERS_FILE"

echo "Setup complete. The project has been copied to $DEST_DIR, dependencies have been installed, services have been set up and started, and script permissions and sudo access have been configured."
