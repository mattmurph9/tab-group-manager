# Screenshot Guide for Chrome Web Store

## Requirements

- **Minimum**: 1 screenshot required
- **Maximum**: 5 screenshots
- **Dimensions**: 1280x800 pixels OR 640x400 pixels
- **Format**: PNG or JPEG
- **File size**: Reasonable (under 1MB each recommended)

## Recommended Screenshots

### Screenshot 1: Options Page (Main UI)
**What to show:**
- The options page with rules configured
- Show multiple rules with different colors
- Show tag-based URL patterns

**How to capture:**
1. Open Chrome and navigate to `chrome://extensions/`
2. Click the extension icon → "Open Settings" (or right-click → Options)
3. Make sure you have 2-3 sample rules configured
4. Take a screenshot of the full options page

**Tips:**
- Show rules that demonstrate the feature (e.g., GitHub, Work tools, News)
- Make sure rules are enabled and visible
- Capture the entire page in one shot

### Screenshot 2: Tag-Based Pattern Input
**What to show:**
- The tag input field in action
- Multiple URL patterns as tags
- The modal form

**How to capture:**
1. Click "+ Add Rule" button
2. Add multiple URL patterns (create tags)
3. Show the form with tags visible
4. Take screenshot

**Tips:**
- Add 3-4 different URL patterns as tags
- Show different colors selected
- Fill in all fields to show the complete form

### Screenshot 3: Extension Popup
**What to show:**
- The popup interface when clicking the extension icon

**How to capture:**
1. Click the extension icon in the Chrome toolbar
2. Wait for the popup to appear
3. Take a screenshot

**Tips:**
- Shows the rules count
- Shows "Open Settings" button
- Clean, simple interface

### Screenshot 4: Tabs Automatically Grouped
**What to show:**
- Chrome tabs organized into groups
- Different colored groups
- Show the automatic organization working

**How to capture:**
1. Open several tabs that match your rules
2. Show them automatically grouped with colors
3. Take a screenshot of the tab bar

**Tips:**
- Open tabs from different domains (GitHub, work tools, etc.)
- Show 3-4 different colored groups
- Make it clear tabs are organized

### Screenshot 5: Multiple Patterns per Rule (Optional)
**What to show:**
- A rule with multiple URL patterns
- Demonstrates the tag feature

**How to capture:**
1. Edit a rule to show multiple tags
2. Show it in the rule card display
3. Take a screenshot

## How to Take Screenshots

### On macOS:
1. Press `Cmd + Shift + 4` to select area
2. Or use `Cmd + Shift + 3` for full screen, then crop
3. Screenshots saved to Desktop

### On Windows:
1. Press `Win + Shift + S` for Snipping Tool
2. Select the area you want
3. Save the screenshot

### Chrome DevTools (Recommended):
1. Open DevTools (`F12` or `Cmd+Option+I`)
2. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Windows)
3. Type "Capture screenshot" and select area
4. Or use `Cmd+Shift+P` → "Capture node screenshot" for specific elements

## Resizing/Cropping

If your screenshots need resizing:

### Using Preview (macOS):
1. Open screenshot in Preview
2. Tools → Adjust Size
3. Set to 1280x800 or 640x400
4. Save

### Using Online Tools:
- [Canva](https://www.canva.com/) - Free, easy resizing
- [Photopea](https://www.photopea.com/) - Free online Photoshop alternative
- [Squoosh](https://squoosh.app/) - Google's image optimizer

### Using Command Line (macOS/Linux):
```bash
# Using ImageMagick
convert screenshot.png -resize 1280x800 resized.png

# Using sips (macOS built-in)
sips -z 800 1280 screenshot.png --out resized.png
```

## Tips for Great Screenshots

1. **Use sample data**: Create realistic examples (GitHub, work tools, etc.)
2. **Show key features**: Tag-based patterns, colors, automatic grouping
3. **Keep it clean**: Hide personal information, use sample data
4. **Consistent styling**: Use the same browser theme across all screenshots
5. **Light theme**: Chrome Web Store looks better with light theme screenshots
6. **High quality**: Make sure text is readable and UI elements are clear

## Sample Data to Use

**Rule Examples:**
- **GitHub**: `github.com` → Blue group named "GitHub"
- **Work**: `slack.com`, `gmail.com` → Green group named "Work"
- **News**: `news.ycombinator.com`, `reddit.com` → Red group named "News"

## File Naming

Name your screenshots clearly:
- `screenshot-1-options-page.png`
- `screenshot-2-tag-input.png`
- `screenshot-3-popup.png`
- `screenshot-4-grouped-tabs.png`
- `screenshot-5-multiple-patterns.png`

## Final Checklist

Before uploading:
- [ ] All screenshots are 1280x800 OR 640x400 pixels
- [ ] At least 1 screenshot is included
- [ ] Screenshots clearly show extension features
- [ ] Text is readable
- [ ] No personal information visible
- [ ] File sizes are reasonable (under 1MB each)
