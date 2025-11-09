# Theme System Update Instructions

## Files Created:
1. `/src/styles/complete-themes.css` - Complete theme definitions with all colors
2. `/src/styles/theme-dropdown.css` - New dropdown styles (to be created)
3. `/src/js/theme-manager.js` - Updated theme manager (to be created)

## Changes Needed:

### 1. Update home.html header (around line 52-90)
Replace the current header-actions div with the unified theme dropdown HTML (see theme-dropdown-html.txt)

### 2. Update base.css
Import complete-themes.css before new-theme.css

### 3. Copy updated files to other pages
Apply the same header changes to:
- projects.html
- about.html
- contact.html

## Color Themes Available:
- Navy & Amber (default)
- Emerald & Amber
- Purple & Pink
- Slate & Blue

Each with Light, Dark, and Auto modes.
