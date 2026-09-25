# Web Design Guidelines

Review UI code for Web Interface Guidelines compliance.

## Overview

A comprehensive set of interface design and implementation rules focused on accessibility, focus management, forms, motion, typography, content handling, performance, touch interactions, responsive layouts, theming, and copy.

## Usage

Reference this skill when asked to:
- Review UI and frontend components
- Check accessibility (ARIA, keyboard navigation, contrast)
- Audit UX and design patterns
- Validate forms and focus management
- Review typography, copy, and internationalization

## Rules Overview

1. **Accessibility**: Form controls, aria-labels, semantic HTML, skip links, media captions.
2. **Focus States**: Visible focus ring, outline replacements, `:focus-within`, `:focus-visible`.
3. **Forms**: Meaningful autocomplete, label associations, inline errors, hit targets.
4. **Animation**: `prefers-reduced-motion`, compositor-friendly properties, interruptible motion.
5. **Typography**: Proper ellipsis (`…`), curly quotes, `tabular-nums`, `text-wrap: balance`.
6. **Content Handling**: Text truncation, empty states, handling variable content length.
7. **Performance**: Virtualization for large lists, layout thrashing prevention, image dimensions.
8. **Navigation & State**: URL state sync, link tags vs buttons, deep linking.
9. **Touch & Interaction**: `touch-action: manipulation`, `overscroll-behavior`, hit targets.
10. **Hydration & Dark Mode**: `color-scheme`, theme color, hydration error prevention.
