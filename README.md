# Tab Group Manager Chrome Extension

A Chrome extension that automatically organizes new tabs into tab groups based on configurable URL pattern rules.

## Features

- 🎯 **Automatic Tab Grouping**: New tabs are automatically added to matching tab groups based on URL patterns
- ⚙️ **Configurable Rules**: Create custom rules with URL patterns, group names, and colors
- 🎨 **Color-Coded Groups**: Choose from 8 different colors for your tab groups
- 🔄 **Real-time Updates**: Rules can be enabled/disabled without restarting
- 💾 **Sync Storage**: Rules are synced across your Chrome browsers

## Project Structure

```
automatic-tab-group-chrome/
├── manifest.json          # Extension manifest (Chrome Extension v3)
├── background.js          # Service worker for tab monitoring
├── rules.js               # Rule management utilities
├── options.html           # Settings page HTML
├── options.js             # Settings page logic
├── options.css            # Settings page styles
├── popup.html             # Extension popup HTML
├── popup.js               # Popup logic
├── popup.css              # Popup styles
├── icons/                 # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md              # This file
```

## How It Works

1. **Tab Monitoring**: The background service worker listens for new tabs and tab updates
2. **Pattern Matching**: When a new tab is created, it checks the URL against all enabled rules
3. **Group Management**: If a match is found, the tab is added to the corresponding tab group (or a new group is created)
4. **Rule Configuration**: Users can add, edit, delete, and toggle rules from the options page

## Installation & Development

### Step 1: Create Extension Icons

You need to create icon files for the extension. You can:

**Option A: Use the provided Python script** (requires Pillow):
```bash
pip3 install Pillow
python3 create-icons.py
```

**Option B: Create manually**:
- Create three PNG images: 16x16, 48x48, and 128x128 pixels
- Save them as `icons/icon16.png`, `icons/icon48.png`, and `icons/icon128.png`
- You can use any image editor or online tools like [Favicon Generator](https://www.favicon-generator.org/)

**Option C: Use placeholder icons**:
- Download simple icon images from [Flaticon](https://www.flaticon.com/) or similar
- Or use a simple colored square as a temporary icon

### Step 2: Load the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable **Developer mode** (toggle in the top-right corner)
3. Click **Load unpacked**
4. Select the `automatic-tab-group-chrome` directory
5. The extension should now appear in your extensions list

### Step 3: Configure Rules

1. Click the extension icon in your toolbar
2. Click **Open Settings** (or right-click the extension icon → Options)
3. Click **+ Add Rule** to create your first rule
4. Fill in:
   - **Rule Name**: A descriptive name (e.g., "GitHub")
   - **URL Pattern**: The pattern to match (e.g., "github.com")
   - **Tab Group Name**: The name for the tab group (e.g., "GitHub")
   - **Tab Group Color**: Choose a color
   - **Enable**: Toggle to enable/disable the rule
5. Click **Save Rule**

### Step 4: Test the Extension

1. Open a new tab with a URL that matches one of your rules
2. The tab should automatically be added to the corresponding tab group
3. If the group doesn't exist, it will be created automatically

## Usage Examples

### Example 1: GitHub Tab Group
- **Pattern**: `github.com`
- **Group Name**: `GitHub`
- **Color**: Blue

Any tab opened with `github.com` in the URL will be added to the "GitHub" tab group.

### Example 2: Work Tools
- **Pattern**: `slack.com`
- **Group Name**: `Work`
- **Color**: Green

### Example 3: News Sites
- **Pattern**: `news.ycombinator.com`
- **Group Name**: `News`
- **Color**: Red

## Building for Distribution

### Step 1: Prepare for Release

1. Ensure all files are in place
2. Test the extension thoroughly
3. Update the version number in `manifest.json` if needed

### Step 2: Create a ZIP File

```bash
# From the project root directory
zip -r automatic-tab-group-chrome.zip . \
  -x "*.git*" \
  -x "*.DS_Store" \
  -x "create-icons.py" \
  -x "build.sh" \
  -x "README.md"
```

Or use the provided build script:
```bash
./build.sh
```

### Step 3: Publish to Chrome Web Store

1. Go to [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. Click **New Item**
3. Upload your ZIP file
4. Fill in the required information:
   - **Name**: Tab Group Manager
   - **Description**: Describe your extension
   - **Category**: Productivity
   - **Screenshots**: Add screenshots of the extension in action
   - **Privacy Policy**: You'll need to create a privacy policy (the extension only uses Chrome storage sync)
5. Submit for review

### Step 4: Update Privacy Policy

Since the extension uses Chrome storage sync, you should create a privacy policy that states:
- The extension stores configuration data locally using Chrome's sync storage
- No data is sent to external servers
- All data remains on the user's device

## Troubleshooting

### Extension not grouping tabs

1. Check that rules are enabled in the options page
2. Verify the URL pattern matches the tab's URL
3. Check the browser console for errors (right-click extension icon → Inspect popup → Console)
4. Ensure you have the necessary permissions

### Tabs not syncing across devices

- Chrome sync storage has size limits (100KB per item)
- If you have many rules, they might not sync
- Consider using `chrome.storage.local` instead of `chrome.storage.sync` for large datasets

### Group creation issues

- Chrome's tab groups API requires at least one tab to create a group
- The extension handles this by temporarily using an existing tab, then ungrouping it if it doesn't match

## Permissions Explained

- **tabs**: Required to access tab information and group tabs
- **tabGroups**: Required to create and manage tab groups
- **storage**: Required to save and sync rule configurations
- **<all_urls>**: Required to check URLs of all tabs

## Browser Compatibility

- Chrome 89+ (tab groups API support)
- Edge 89+ (Chromium-based)

## Development Notes

- The extension uses Chrome Extension Manifest V3
- Background script runs as a service worker
- Pattern matching is currently simple substring matching (can be enhanced with regex)
- Tab groups are created on-demand when the first matching tab is opened

## Future Enhancements

- [ ] Regex pattern support for more flexible matching
- [ ] Import/export rules
- [ ] Rule priority/ordering
- [ ] Multiple patterns per rule
- [ ] Wildcard support
- [ ] Tab group auto-collapse options
- [ ] Statistics and analytics

## License

MIT License - feel free to modify and distribute

## Support

For issues or questions, please open an issue on the project repository.


