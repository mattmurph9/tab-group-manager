#!/usr/bin/env python3
"""
Script to create icons for the Chrome extension.
Requires Pillow: pip install Pillow
Creates rounded rectangle icons with "TGM" text, matching Chrome's tab group style.
"""

import os
from PIL import Image, ImageDraw, ImageFont

ICON_DIR = "icons"
SIZES = [16, 48, 128]

# Chrome tab group color (blue)
BG_COLOR = '#1a73e8'
TEXT_COLOR = 'white'

def create_rounded_rectangle_icon(size):
    """Create a rounded rectangle icon with TGM text, matching Chrome tab group style."""
    # Create transparent image
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Calculate border radius based on size (more rounded corners)
    # Chrome tab groups use roughly 8-12px radius on larger sizes
    # Ensure border radius is at least 1 to avoid division by zero
    border_radius = max(1, min(size // 4, 12)) if size > 0 else 3
    padding = max(1, size // 16)  # Small padding from edges
    
    # Draw rounded rectangle (Chrome tab group style)
    left = padding
    top = padding
    right = size - padding
    bottom = size - padding
    
    # Ensure we have a valid rectangle
    if right <= left or bottom <= top:
        right = size - 1
        bottom = size - 1
        left = 1
        top = 1
    
    # Ensure border radius doesn't exceed half the rectangle size
    rect_width = right - left
    rect_height = bottom - top
    max_radius = min(rect_width, rect_height) // 2
    border_radius = min(border_radius, max_radius) if max_radius > 0 else 1
    
    # Draw rounded rectangle with blue background
    draw.rounded_rectangle(
        [(left, top), (right, bottom)],
        radius=border_radius,
        fill=BG_COLOR
    )
    
    # Try to use a bold font, fallback to default if not available
    # Ensure minimum font size to avoid division by zero in font rendering
    font_size = max(8, int(size * 0.35))  # Smaller font size so text fits better, minimum 8px
    font = None
    
    # Try different font paths
    font_paths = [
        "/System/Library/Fonts/Helvetica.ttc",
        "/System/Library/Fonts/Supplemental/Helvetica.ttc",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    ]
    
    for font_path in font_paths:
        try:
            font = ImageFont.truetype(font_path, font_size)
            # Test if font works by trying to get bbox
            test_bbox = draw.textbbox((0, 0), "TGM", font=font)
            if test_bbox[2] > test_bbox[0] and test_bbox[3] > test_bbox[1]:
                break
        except:
            continue
    
    if font is None:
        # Fallback to default font
        font = ImageFont.load_default()
    
    # Draw "TGM" text in white
    text = "TGM"
    # Get text bounding box to center it - wrap in try/except to handle font errors
    try:
        bbox = draw.textbbox((0, 0), text, font=font)
    except Exception as e:
        # If font fails, use default font with adjusted size
        font = ImageFont.load_default()
        bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    # Ensure we have valid text dimensions
    if text_width == 0:
        text_width = 1
    if text_height == 0:
        text_height = 1
    
    # Calculate position to center text
    x = (size - text_width) // 2
    y = (size - text_height) // 2 - bbox[1]  # Adjust for baseline
    
    draw.text((x, y), text, fill=TEXT_COLOR, font=font)
    
    return img

# Create icons directory if it doesn't exist
os.makedirs(ICON_DIR, exist_ok=True)

# Create icons with rounded rectangle design matching Chrome tab groups
for size in SIZES:
    img = create_rounded_rectangle_icon(size)
    icon_path = os.path.join(ICON_DIR, f"icon{size}.png")
    img.save(icon_path)
    print(f"Created {icon_path}")

print("Icons created successfully!")


