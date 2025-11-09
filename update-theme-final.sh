#!/bin/bash

echo "🎨 Applying final theme improvements..."

# 1. Update base.css to use improved-themes.css
echo "📝 Updating base.css..."
sed -i '' "s|@import './complete-themes.css';|@import './improved-themes.css';|" src/styles/base.css
echo "   ✓ Updated to use improved-themes.css"

# 2. Replace theme-manager.js with updated version
echo "📝 Replacing theme-manager.js..."
cp src/js/updated-theme-manager.js src/js/theme-manager.js
echo "   ✓ Updated theme manager (removed auto mode, slate dark default)"

# 3. Update base.css to use heading color variable
echo "📝 Adding heading color support..."
if ! grep -q "heading-color" src/styles/base.css; then
    cat >> src/styles/base.css << 'EOF'

/* Heading colors themed */
h1, h2, h3, h4, h5, h6 {
    color: var(--foreground);
}
EOF
    echo "   ✓ Added heading color theming"
fi

# 4. Create updated header HTML (without auto mode)
cat > /tmp/theme-dropdown-updated.html << 'EOF'
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
                        </div>

                        <!-- Color Theme Options -->
                        <div class="theme-section">
                            <h4 class="theme-section-title">Color</h4>
                            <button class="theme-option" data-theme="slate">
                                <div class="theme-option-visual">
                                    <span style="background: #334155;"></span>
                                    <span style="background: #0ea5e9;"></span>
                                </div>
                                <span>Slate</span>
                            </button>
                            <button class="theme-option" data-theme="navy">
                                <div class="theme-option-visual">
                                    <span style="background: #2d3561;"></span>
                                    <span style="background: #e6a955;"></span>
                                </div>
                                <span>Navy</span>
                            </button>
                            <button class="theme-option" data-theme="rose">
                                <div class="theme-option-visual">
                                    <span style="background: #9f1239;"></span>
                                    <span style="background: #f59e0b;"></span>
                                </div>
                                <span>Rose</span>
                            </button>
                            <button class="theme-option" data-theme="ocean">
                                <div class="theme-option-visual">
                                    <span style="background: #0c4a6e;"></span>
                                    <span style="background: #06b6d4;"></span>
                                </div>
                                <span>Ocean</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
EOF

echo "🔄 Updating HTML files..."

# Function to update HTML
update_html() {
    local file=$1
    python3 << PYTHON
import re

with open('$file', 'r') as f:
    content = f.read()

# Pattern to match the theme-dropdown section
pattern = r'<div class="theme-dropdown">.*?</div>\s*</div>\s*</div>'

# Read new header
with open('/tmp/theme-dropdown-updated.html', 'r') as f:
    new_header = f.read()

new_header += '\n        </div>\n    </header>'

# Replace
content = re.sub(pattern, new_header, content, flags=re.DOTALL)

with open('$file', 'w') as f:
    f.write(content)

print(f"   ✓ Updated $file")
PYTHON
}

for file in home.html projects.html about.html contact.html; do
    if [ -f "$file" ]; then
        update_html "$file"
    fi
done

rm /tmp/theme-dropdown-updated.html

echo ""
echo "✅ Theme improvements complete!"
echo ""
echo "Changes:"
echo "  • Default: Slate Dark mode"
echo "  • Removed: Auto mode"
echo "  • New themes: Rose (warm elegant), Ocean (cool sophisticated)"
echo "  • Removed: Emerald and Purple (replaced with better options)"
echo "  • Fixed: Headings now respect theme colors"
echo ""
echo "🎨 Themes available:"
echo "  1. Slate & Sky Blue (default dark)"
echo "  2. Navy & Amber (original)"
echo "  3. Rose & Gold (warm elegant)"
echo "  4. Ocean & Cyan (cool sophisticated)"
echo ""
echo "Refresh your browser to see the changes!"
