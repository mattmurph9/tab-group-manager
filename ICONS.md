# Creating Extension Icons

You need to create three icon files for the extension to work properly:

- `icons/icon16.png` (16x16 pixels)
- `icons/icon48.png` (48x48 pixels)  
- `icons/icon128.png` (128x128 pixels)

## Quick Options:

### Option 1: Use Python Script (Recommended)
```bash
pip3 install Pillow
python3 create-icons.py
```

### Option 2: Use ImageMagick Script
```bash
brew install imagemagick  # macOS
# or apt-get install imagemagick  # Linux
./create-icons.sh
```

### Option 3: Create Manually
1. Create a simple 128x128 pixel image (can be a colored square with text)
2. Use any image editor (Photoshop, GIMP, online editors)
3. Export/resize to the three required sizes
4. Save as PNG files in the `icons/` directory

### Option 4: Use Online Tools
- Visit [Favicon Generator](https://www.favicon-generator.org/)
- Upload a 512x512 image
- Download the generated icons
- Extract the 16x16, 48x48, and 128x128 sizes

### Temporary Placeholder
If you just want to test the extension quickly, you can:
1. Create a simple colored square image (any color)
2. Save it as a PNG
3. Copy it three times with the names: `icon16.png`, `icon48.png`, `icon128.png`
4. Place them in the `icons/` directory

The extension will work with any icons - they're just for display purposes.


