#!/bin/bash

# Build script to create a distribution-ready ZIP file

EXTENSION_NAME="automatic-tab-group-chrome"
ZIP_FILE="${EXTENSION_NAME}.zip"

# Remove existing ZIP if it exists
if [ -f "$ZIP_FILE" ]; then
    rm "$ZIP_FILE"
    echo "Removed existing $ZIP_FILE"
fi

# Create ZIP file excluding unnecessary files
zip -r "$ZIP_FILE" . \
    -x "*.git*" \
    -x "*.DS_Store" \
    -x "create-icons.sh" \
    -x "build.sh" \
    -x "README.md" \
    -x "*.zip"

echo "Created $ZIP_FILE"
echo "Ready for Chrome Web Store submission!"


