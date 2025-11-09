#!/bin/bash

# Script to apply theme system updates to all HTML files

echo "🎨 Applying theme system updates..."

# 1. Update base.css to import theme-dropdown.css
echo "📝 Updating base.css..."
if ! grep -q "theme-dropdown.css" src/styles/base.css; then
    sed -i '' "s|@import './theme-selector.css';|@import './theme-selector.css';\n@import './theme-dropdown.css';|" src/styles/base.css
    echo "   ✓ Added theme-dropdown.css import"
fi

# 2. Backup HTML files
echo "💾 Creating backups..."
for file in home.html projects.html about.html contact.html; do
    if [ -f "$file" ]; then
        cp "$file" "${file}.theme-backup"
        echo "   ✓ Backed up $file"
    fi
done

# 3. Create the new header HTML snippet
cat > /tmp/theme-dropdown-header.html << 'EOF'
            <div class="header-actions">
                <!-- Unified Theme Dropdown -->
                <div class="theme-dropdown">
                    <button class="theme-dropdown-trigger" aria-label="Change theme">
                        <svg class="sun-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="5"></circle>
                            <line x1="12" y1="1" x2="12" y2="3"></line>
                            <line x1="12" y1="21" x2="12" y2="23"></line>
                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                            <line x1="1" y1="12" x2="3" y2="12"></line>
                            <line x1="21" y1="12" x2="23" y2="12"></line>
                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                        </svg>
                        <svg class="moon-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                        </svg>
                        <svg class="chevron-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <polyline points="6 9 12 15 18 9"></polyline>
                        </svg>
                    </button>
                    <div class="theme-dropdown-content">
                        <!-- Mode Options -->
                        <div class="theme-section">
                            <h4 class="theme-section-title">Mode</h4>
                            <button class="theme-option" data-mode="light">
                                <div class="theme-option-visual mode-light"></div>
                                <span>Light</span>
                            </button>
                            <button class="theme-option" data-mode="dark">
                                <div class="theme-option-visual mode-dark"></div>
                                <span>Dark</span>
                            </button>
                            <button class="theme-option" data-mode="auto">
                                <div class="theme-option-visual mode-auto"></div>
                                <span>Auto</span>
                            </button>
                        </div>

                        <!-- Color Theme Options -->
                        <div class="theme-section">
                            <h4 class="theme-section-title">Color</h4>
                            <button class="theme-option" data-theme="navy">
                                <div class="theme-option-visual">
                                    <span style="background: #2d3561;"></span>
                                    <span style="background: #e6a955;"></span>
                                </div>
                                <span>Navy</span>
                            </button>
                            <button class="theme-option" data-theme="emerald">
                                <div class="theme-option-visual">
                                    <span style="background: #047857;"></span>
                                    <span style="background: #f59e0b;"></span>
                                </div>
                                <span>Emerald</span>
                            </button>
                            <button class="theme-option" data-theme="purple">
                                <div class="theme-option-visual">
                                    <span style="background: #7c3aed;"></span>
                                    <span style="background: #ec4899;"></span>
                                </div>
                                <span>Purple</span>
                            </button>
                            <button class="theme-option" data-theme="slate">
                                <div class="theme-option-visual">
                                    <span style="background: #334155;"></span>
                                    <span style="background: #0ea5e9;"></span>
                                </div>
                                <span>Slate</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
EOF

echo "🔄 Updating HTML files..."

# Function to update each HTML file
update_html_file() {
    local file=$1
    echo "   Processing $file..."

    # Use Python to do the replacement (more reliable than sed for multi-line)
    python3 << PYTHON
import re

with open('$file', 'r') as f:
    content = f.read()

# Pattern to match the header-actions section
pattern = r'<div class="header-actions">.*?</div>\s*</div>\s*</header>'

# Read the new header content
with open('/tmp/theme-dropdown-header.html', 'r') as f:
    new_header = f.read()

# Add closing tags
new_header += '\n        </div>\n    </header>'

# Replace
content = re.sub(pattern, new_header, content, flags=re.DOTALL)

# Replace dark-mode.js with theme-manager.js
content = content.replace('dark-mode.js', 'theme-manager.js')

# Write back
with open('$file', 'w') as f:
    f.write(content)

print(f"      ✓ Updated $file")
PYTHON
}

# Update all HTML files
for file in home.html projects.html about.html contact.html; do
    if [ -f "$file" ]; then
        update_html_file "$file"
    fi
done

# Clean up temp file
rm /tmp/theme-dropdown-header.html

echo ""
echo "✅ Theme system updates complete!"
echo ""
echo "Changes applied:"
echo "  • Updated base.css with theme-dropdown.css import"
echo "  • Replaced header-actions in all HTML files with unified dropdown"
echo "  • Changed script imports from dark-mode.js to theme-manager.js"
echo ""
echo "Backups created:"
echo "  • home.html.theme-backup"
echo "  • projects.html.theme-backup"
echo "  • about.html.theme-backup"
echo "  • contact.html.theme-backup"
echo ""
echo "🎉 Your site now has a unified theme dropdown with:"
echo "   - Light/Dark/Auto modes"
echo "   - Navy, Emerald, Purple, and Slate color themes"
echo ""
echo "Refresh your browser to see the changes!"
