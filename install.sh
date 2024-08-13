#!/bin/bash

SOURCE_DIR="$(pwd)"
DEST_DIR="/opt/F8Tech/backend"
SERVICE_DIR="/etc/systemd/system"
CONFIG_DIR="$SOURCE_DIR/config"
SCRIPT_DIR="$DEST_DIR/scripts"
SUDOERS_FILE="/etc/sudoers.d/f8Tech"
SERVICE_FILES=("F8-Backend.service")

create_directory() {
    local dir=$1
    if [ ! -d "$dir" ]; then
        sudo mkdir -p "$dir"
    fi
}

copy_files() {
    sudo cp -r "$SOURCE_DIR"/* "$DEST_DIR"
}

install_nodejs() {
    if ! node -v | grep -q 'v20'; then
        echo "Node.js v20 or greater is not installed. Installing Node.js v20..."
        curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
        sudo apt-get install -y nodejs
        echo "Node.js v20 installed successfully."
    else
        echo "Node.js v20 or greater is already installed."
    fi
}

install_dependencies() {
    cd "$DEST_DIR"
    npm install
}

setup_services() {
    for SERVICE_FILE in "${SERVICE_FILES[@]}"; do
        if [ -f "$SERVICE_DIR/$SERVICE_FILE" ]; then
            echo "Service file $SERVICE_FILE already exists. Removing the old file."
            sudo rm "$SERVICE_DIR/$SERVICE_FILE"
        fi
        sudo cp "$CONFIG_DIR/$SERVICE_FILE" "$SERVICE_DIR"
    done

    sudo systemctl daemon-reload

    for SERVICE_FILE in "${SERVICE_FILES[@]}"; do
        sudo systemctl start "$SERVICE_FILE"
        sudo systemctl enable "$SERVICE_FILE"
    done
}

make_scripts_executable() {
    if [ -d "$SCRIPT_DIR" ]; then
        sudo find "$SCRIPT_DIR" -type f \( -name "*.py" -o -name "*.sh" \) -exec chmod +x {} \;
    else
        echo "No /scripts directory found in the current directory."
    fi
}

configure_sudoers() {
    echo "Creating and configuring sudoers file for f8Tech..."
    sudo bash -c "echo 'ALL ALL=(ALL) NOPASSWD: /opt/F8Tech/backend/scripts/**' > $SUDOERS_FILE"

    sudo find "$SCRIPT_DIR" -type f \( -name "*.py" -o -name "*.sh" \) | while read -r script; do
        sudo bash -c "echo 'ALL ALL=(ALL) NOPASSWD: $script' >> $SUDOERS_FILE"
    done

    sudo chmod 440 "$SUDOERS_FILE"
}

main() {
    create_directory "$DEST_DIR"
    copy_files
    install_nodejs
    install_dependencies
    create_directory "$SERVICE_DIR"
    setup_services
    make_scripts_executable
    configure_sudoers
    echo "Setup complete. The project has been copied to $DEST_DIR, dependencies have been installed, services have been set up and started, and script permissions and sudo access have been configured."
}

main
