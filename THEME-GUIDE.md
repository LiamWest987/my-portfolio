# Theme Customization Guide

Your portfolio now uses a centralized theme system via CSS custom properties, making it easy to customize colors, spacing, and other design elements.

## Theme File Location

All theme variables are defined in:
```
src/styles/theme.css
```

## How to Customize

### 1. Colors

Edit the color variables in [src/styles/theme.css](src/styles/theme.css):

```css
:root {
    /* Primary Colors */
    --primary-color: #8B5CF6;        /* Main brand color (purple) */
    --primary-dark: #6D28D9;         /* Darker shade */
    --primary-light: #A78BFA;        /* Lighter shade */

    /* Background Colors */
    --background: #0F172A;           /* Main background (dark blue) */
    --card-bg: #1E293B;              /* Card/section backgrounds */
    --nav-bg: rgba(15, 23, 42, 0.95); /* Navigation background */

    /* Text Colors */
    --text-primary: #F8FAFC;         /* Main text (white) */
    --text-secondary: #CBD5E1;       /* Secondary text (light gray) */

    /* UI Colors */
    --border-color: rgba(139, 92, 246, 0.2);  /* Border color */
    --hover-color: rgba(139, 92, 246, 0.1);   /* Hover states */
}
```

### 2. Spacing

Adjust spacing scale:

```css
:root {
    --spacing-xs: 0.25rem;   /* 4px */
    --spacing-sm: 0.5rem;    /* 8px */
    --spacing-md: 1rem;      /* 16px */
    --spacing-lg: 1.5rem;    /* 24px */
    --spacing-xl: 2rem;      /* 32px */
    --spacing-xxl: 3rem;     /* 48px */
}
```

### 3. Typography

Customize font sizes and weights:

```css
:root {
    --font-family: 'Inter', sans-serif;

    /* Font Sizes */
    --font-size-xs: 0.75rem;   /* 12px */
    --font-size-sm: 0.875rem;  /* 14px */
    --font-size-md: 1rem;      /* 16px */
    --font-size-lg: 1.25rem;   /* 20px */
    --font-size-xl: 1.5rem;    /* 24px */
    --font-size-xxl: 2rem;     /* 32px */

    /* Font Weights */
    --font-weight-normal: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;
    --font-weight-extrabold: 800;
}
```

### 4. Shadows & Effects

Modify elevation levels:

```css
:root {
    --elevation-1: 0 1px 3px rgba(0, 0, 0, 0.12);
    --elevation-2: 0 3px 6px rgba(0, 0, 0, 0.15);
    --elevation-3: 0 10px 20px rgba(0, 0, 0, 0.15);
    --elevation-4: 0 14px 28px rgba(0, 0, 0, 0.25);
}
```

### 5. Animations

Adjust transition speeds:

```css
:root {
    --transition-fast: 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    --transition-medium: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    --transition-slow: 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### 6. Border Radius

Control roundness of elements:

```css
:root {
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 12px;
    --radius-xl: 16px;
    --radius-full: 9999px;
}
```

## Pre-Made Color Schemes

### Dark Blue (Current)
```css
--primary-color: #8B5CF6;
--background: #0F172A;
--card-bg: #1E293B;
```

### Ocean Blue
```css
--primary-color: #3B82F6;
--primary-dark: #1E40AF;
--primary-light: #60A5FA;
--background: #0C1222;
--card-bg: #1E293B;
```

### Emerald Green
```css
--primary-color: #10B981;
--primary-dark: #047857;
--primary-light: #34D399;
--background: #0A1F1A;
--card-bg: #1A2F2A;
```

### Sunset Orange
```css
--primary-color: #F59E0B;
--primary-dark: #D97706;
--primary-light: #FBBF24;
--background: #1A1410;
--card-bg: #2A2420;
```

### Deep Purple
```css
--primary-color: #9333EA;
--primary-dark: #6B21A8;
--primary-light: #A855F7;
--background: #1A0A2E;
--card-bg: #2A1A3E;
```

## Adding Dark/Light Mode Toggle

The theme system is ready for dark/light mode. To implement:

1. **Add theme toggle button** to your navigation
2. **Create JavaScript toggle**:

```javascript
// In script.js or new theme.js file
const themeToggle = document.getElementById('theme-toggle');
const currentTheme = localStorage.getItem('theme') || 'dark';

document.documentElement.setAttribute('data-theme', currentTheme);

themeToggle.addEventListener('click', () => {
    const theme = document.documentElement.getAttribute('data-theme');
    const newTheme = theme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});
```

3. **Add light mode variables** in theme.css:

```css
[data-theme="light"] {
    --primary-color: #8B5CF6;
    --primary-dark: #6D28D9;
    --primary-light: #A78BFA;
    --background: #FFFFFF;
    --card-bg: #F8FAFC;
    --text-primary: #0F172A;
    --text-secondary: #475569;
    --border-color: rgba(139, 92, 246, 0.2);
    --hover-color: rgba(139, 92, 246, 0.1);
}
```

## Testing Changes

After making changes to theme.css:

1. **In development**:
   ```bash
   npm run dev
   ```
   Changes will hot-reload automatically

2. **For production**:
   ```bash
   npm run build
   npm run preview
   ```

## Using Theme Variables in Custom Styles

When adding new CSS, always use theme variables:

```css
/* Good ✅ */
.my-element {
    background: var(--card-bg);
    color: var(--text-primary);
    padding: var(--spacing-md);
    border-radius: var(--radius-lg);
    transition: all var(--transition-medium);
}

/* Bad ❌ */
.my-element {
    background: #1E293B;
    color: #F8FAFC;
    padding: 16px;
    border-radius: 12px;
    transition: all 0.3s;
}
```

## Need Help?

- View live examples at https://cssgradient.io/ for color gradients
- Use https://coolors.co/ for color palette inspiration
- Check https://tailwindcss.com/docs/customizing-colors for color naming conventions
