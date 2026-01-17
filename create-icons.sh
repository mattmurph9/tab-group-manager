#!/bin/bash

# Script to create placeholder icons for the Chrome extension
# Requires ImageMagick (install with: brew install imagemagick on macOS)

ICON_DIR="icons"
SIZES=(16 48 128)

# Create icons directory if it doesn't exist
mkdir -p "$ICON_DIR"

# Check if ImageMagick is installed
if ! command -v convert &> /dev/null; then
    echo "ImageMagick not found. Installing..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        if command -v brew &> /dev/null; then
            brew install imagemagick
        else
            echo "Please install ImageMagick manually: https://imagemagick.org/script/download.php"
            exit 1
        fi
    else
        echo "Please install ImageMagick manually: https://imagemagick.org/script/download.php"
        exit 1
    fi
fi

# Create icons with a simple design (blue square with "TG" text)
for size in "${SIZES[@]}"; do
    convert -size ${size}x${size} xc:"#1a73e8" \
            -gravity center \
            -pointsize $((size/2)) \
            -fill white \
            -font Arial-Bold \
            -annotate +0+0 "TG" \
            "${ICON_DIR}/icon${size}.png"
    echo "Created ${ICON_DIR}/icon${size}.png"
done

echo "Icons created successfully!"


