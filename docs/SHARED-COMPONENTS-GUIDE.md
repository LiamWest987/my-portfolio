# Shared Header & Footer Components Guide

## Overview
Created reusable header and footer components to ensure consistency across all pages.

---

## Files Created

1. **[src/js/components/header.js](../src/js/components/header.js)** - Shared header component
2. **[src/js/components/footer.js](../src/js/components/footer.js)** - Shared footer component
3. **[src/js/layout.js](../src/js/layout.js)** - Layout manager

---

## How to Update Each Page

### Step 1: Replace Header HTML

**In each HTML file (home.html, projects.html, about.html, contact.html):**

**Remove this:**
```html
<!-- Header / Navigation -->
<header class="header">
    <div class="header-content">
        <!-- ... entire header content ... -->
    </div>
</header>
```

**Replace with:**
```html
<!-- Header Container -->
<div id="header-container"></div>
```

---

### Step 2: Replace Footer HTML

**Remove this:**
```html
<!-- Footer -->
<footer class="footer">
    <div class="footer-content">
        <!-- ... entire footer content ... -->
    </div>
</footer>
```

**Replace with:**
```html
<!-- Footer Container -->
<div id="footer-container"></div>
```

---

### Step 3: Add Layout Script

**At the bottom of each page, before the closing `</body>` tag:**

```html
<!-- Shared Layout Components -->
<script type="module">
    import { initLayout, getCurrentPage } from '/src/js/layout.js';
    import '/src/js/dark-mode.js';

    // Load header and footer
    initLayout(getCurrentPage());
</script>

<!-- Page-specific scripts -->
<script type="module" src="/src/js/[page-name].js"></script>
```

---

## Example: projects.html

### Before (Long)
```html
<body>
    <div class="background-animation">...</div>

    <!-- Header / Navigation -->
    <header class="header">
        <div class="header-content">
            <a href="home" class="logo">
                <span class="logo-bracket">&lt;</span>Portfolio<span class="logo-accent"> /&gt;</span>
            </a>
            <nav>
                <ul class="nav-links">
                    <li><a href="home">Home</a></li>
                    <li><a href="projects" class="active">Projects</a></li>
                    <li><a href="about">About & Skills</a></li>
                    <li><a href="contact">Contact</a></li>
                </ul>
            </nav>
            <div class="header-actions">
                <button class="theme-toggle" aria-label="Toggle dark mode">
                    <!-- SVG icons -->
                </button>
            </div>
        </div>
    </header>

    <main>
        <!-- Page content -->
    </main>

    <!-- Footer -->
    <footer class="footer">
        <div class="footer-content">
            <p class="footer-text">© 2024 Liam West...</p>
            <p class="footer-tagline">...</p>
        </div>
    </footer>

    <script type="module" src="/src/js/dark-mode.js"></script>
    <script type="module" src="/src/js/main.js"></script>
</body>
```

### After (Clean)
```html
<body>
    <div class="background-animation">...</div>

    <!-- Header Container -->
    <div id="header-container"></div>

    <main>
        <!-- Page content -->
    </main>

    <!-- Footer Container -->
    <div id="footer-container"></div>

    <!-- Shared Layout -->
    <script type="module">
        import { initLayout, getCurrentPage } from '/src/js/layout.js';
        import '/src/js/dark-mode.js';
        initLayout(getCurrentPage());
    </script>

    <!-- Page-specific scripts -->
    <script type="module" src="/src/js/main.js"></script>
</body>
```

---

## Benefits

### ✅ **Single Source of Truth**
- Update header once → affects all pages
- Update footer once → affects all pages
- No more inconsistencies

### ✅ **Auto Active State**
- `getCurrentPage()` detects current page
- Automatically highlights correct nav link

### ✅ **Easy to Maintain**
- Logo text in one place
- Navigation links in one place
- Footer text in one place

### ✅ **Dynamic Year**
- Footer automatically shows current year
- No manual updates needed

---

## Customization

### Change Logo Text
Edit [src/js/components/header.js](../src/js/components/header.js):
```javascript
<span class="logo-bracket">&lt;</span>Liam West<span class="logo-accent"> /&gt;</span>
// Change "Liam West" to whatever you want
```

### Change Navigation Links
Edit the nav links array in header.js:
```javascript
<li><a href="home" class="${currentPage === 'home' ? 'active' : ''}">Home</a></li>
// Add, remove, or modify links here
```

### Change Footer Text
Edit [src/js/components/footer.js](../src/js/components/footer.js):
```javascript
<p class="footer-text">
    © ${new Date().getFullYear()} Liam West. Built with Vite & Vanilla JavaScript
</p>
```

---

## Pages to Update

- [ ] home.html
- [ ] projects.html
- [ ] about.html
- [ ] contact.html

---

## Testing Checklist

After updating all pages:

- [ ] Header appears on all pages
- [ ] Footer appears on all pages
- [ ] Logo says "Liam West" consistently
- [ ] Active nav link highlights correctly on each page
- [ ] Dark mode toggle works
- [ ] Footer shows current year
- [ ] All links work correctly
