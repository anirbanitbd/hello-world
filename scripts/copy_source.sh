#!/bin/bash

# Define the base deployment root
DEPLOYMENT_ROOT="/opt/codedeploy-agent/deployment-root"
DEST_DIR="/var/www/htm4"

# Locate the active deployment directory
DEPLOYMENT_DIR=$(find "$DEPLOYMENT_ROOT" -maxdepth 1 -type d -name "*" ! -name "deployment-instructions" ! -name "deployment-logs" ! -name "ongoing-deployment" | head -n 1)

if [ -z "$DEPLOYMENT_DIR" ]; then
    echo "No active deployment directory found!"
    exit 1
fi

# Check for deployment archive
DEPLOYMENT_ARCHIVE_DIR="$DEPLOYMENT_DIR/deployment-archive"

if [ -d "$DEPLOYMENT_ARCHIVE_DIR" ]; then
    echo "Copying files from $DEPLOYMENT_ARCHIVE_DIR to $DEST_DIR"

    # Ensure the destination directory exists
    mkdir -p "$DEST_DIR"

    # Copy files
    cp -r "$DEPLOYMENT_ARCHIVE_DIR"/* "$DEST_DIR"

    # Set permissions
    chown -R apache:apache "$DEST_DIR"
    chmod -R 755 "$DEST_DIR"

    echo "Files successfully copied to $DEST_DIR"
else
    echo "Deployment archive directory not found in $DEPLOYMENT_DIR!"
    exit 1
fi
