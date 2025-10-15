# Picfluencer Design Checklist
## Quick Reference for Auth & Profile Screens

---

## Authentication Screen

### ✅ What to Include
- [ ] App logo/branding at top
- [ ] Welcome title and subtitle
- [ ] **"Continue as Guest"** button (prominent, primary color)
- [ ] Supporting text under guest button
- [ ] OR divider
- [ ] **"Sign in with Google"** button (full width)
- [ ] **"Sign in with Apple"** button (full width, iOS only)

### ❌ What NOT to Include
- ~~Email/password form~~ (Not needed, only social auth)
- ~~Magic link option~~ (Not needed)
- ~~Sign up form~~ (Use Google/Apple instead)

### Key Design Specs
- Guest button: Primary color fill, rounded corners, 16px padding
- Social buttons: Full width, 44pt minimum height, spaced 12-16px apart
- All buttons: Centered text, clear icons/branding
- Loading state: Replace text with spinner during auth

---

## Profile Screen

### ✅ What to Include
- [ ] User avatar (circular, 100x100pt) with first letter
- [ ] User name (large, bold)
- [ ] "Anonymous Account" badge (only for anonymous users)
- [ ] Account Information card with fields:
  - User ID
  - Email
  - Name
  - Email Verified status
  - Account Type
- [ ] Session Information card with fields:
  - Session ID
  - Created At
  - Updated At
- [ ] Upgrade prompt card (only for anonymous, with CTA button)
- [ ] Sign Out button (red, outlined, bottom of screen)

### ❌ What NOT to Include
- ~~Edit profile functionality~~ (Future release)
- ~~Profile picture upload~~ (Future release)
- ~~Settings panel~~ (Future release)

### Key Design Specs
- Avatar background: Primary color
- Cards: Border radius 12px, light border, subtle shadows
- Field rows: Use dividers between rows
- Scrollable content: Ensure sign out button always accessible
- Sign out: Red color (#FF3B30), full width, bordered style

---

## Component Specifications

### Buttons
```
Height:         44-50px (minimum touch target 44pt)
Padding:        16px vertical × 24px horizontal
Border Radius:  12px
Font:           16pt, semi-bold
States:
  - Enabled:    Full opacity, interactive
  - Disabled:   50% opacity, not interactive
  - Loading:    Show spinner, disabled state
  - Pressed:    Slight dimming or scale
```

### Cards
```
Padding:        16px
Border:         1px light gray
Border Radius:  12px
Shadow:         Subtle elevation
Background:     Slightly tinted or transparent
```

### Text Fields (if needed later)
```
Height:         50px
Padding:        16px horizontal
Border Radius:  12px
Border:         1px
Font:           16pt
Placeholder:    70% opacity
```

### Icons
- All icons use Material Icons or Apple SF Symbols (iOS)
- Size: 24-28pt for buttons, 80pt for empty states
- Color: Primary color or text color depending on context

---

## Color Palette Needed From Brand Team

| Element | Color | Opacity |
|---------|-------|---------|
| Primary Button | `#007AFF` or brand color | 100% |
| Secondary Text | — | 70% |
| Borders | — | 30% |
| Disabled State | — | 50% |
| Destructive Action | `#FF3B30` (red) | 100% |
| Success/Accent | — | 100% |

---

## Spacing Reference

```
Container padding:        20px
Section spacing:          24px
Button height:            44-50px
Button vertical padding:  16px
Button horizontal padding: 24px
Gap between buttons:      12-16px
Card padding:             16px
Divider vertical space:   30px
```

---

## Typography Hierarchy

| Use Case | Font Size | Weight | Example |
|----------|-----------|--------|---------|
| Screen Title | 28pt | Bold | "Welcome to Picfluencer" |
| Section Title | 18pt | Semi-bold | "Account Information" |
| Button Text | 16pt | Semi-bold | "Continue as Guest" |
| Body Text | 16pt | Regular | User name, email |
| Small Text | 14pt | Regular | Field labels, hints |
| Caption | 12pt | Regular | Supporting text |

---

## Platform Differences

### iOS
- Show Apple Sign-In button prominently
- Respect safe area (notch/Dynamic Island)
- Use system fonts (SF Pro Display)
- Light/dark mode support

### Android
- **Hide Apple Sign-In button** completely
- Respect status bar and nav bar
- Use system fonts
- Light/dark mode support

### Web
- Responsive layout (mobile-first)
- Show all buttons (Apple hidden if needed)
- Keyboard navigation support
- Tab order: Guest → Google → Apple → fields → buttons

---

## Dark Mode Considerations

```
Dark Mode Background:     #1C1C1E or similar
Dark Mode Text:           #FFFFFF or light gray
Dark Mode Borders:        #333333 or similar
Dark Mode Card Background: #2C2C2E or similar
Colors should still pass WCAG AA contrast (4.5:1 minimum)
```

---

## Accessibility Requirements

- [ ] All buttons minimum 44x44pt touch target
- [ ] Color contrast ratio ≥ 4.5:1 (WCAG AA)
- [ ] Text sizes scalable (support up to 200%)
- [ ] No color-only differentiators (use icons/text)
- [ ] Screen reader labels for all interactive elements
- [ ] Focus indicators visible on keyboard nav
- [ ] Error messages clear and actionable

---

## Animation Recommendations (Optional)

```
Page Transitions:       200-300ms fade or slide
Button Press:           100ms scale animation (0.95x)
Loading Spinner:        Smooth 360° rotation
Section Expand:         300ms slide + fade
Toast/Alert Appear:     200ms fade in
Toast/Alert Dismiss:    200ms fade out
```

---

## Sign-In Button Styling

### Anonymous Button
- Label: "Continue as Guest"
- Style: **Filled** (primary color)
- Icon: Optional (lock or person icon)
- Emphasis: This should be the most prominent button

### Google Button
- Label: "Sign in with Google"
- Style: Can be white background with Google blue text OR Google's official style
- Icon: Official Google G logo
- Note: Use Google's official button guidelines

### Apple Button
- Label: "Sign in with Apple"
- Style: Black background with white text (iOS style)
- Icon: Official Apple logo
- Note: Only show on iOS
- Apple requirement: If using social login, Apple Sign-In must be available

---

## Error Handling Visual Design

### Network Error
```
Title:   "No Connection"
Message: "Please check your internet and try again"
Button:  "Retry"
Icon:    Cloud with X or warning icon
Style:   Alert dialog or toast
```

### Auth Failed
```
Title:   "Sign In Failed"
Message: "Unable to sign in. Please try again."
Button:  "Retry" or "Try Another Method"
Icon:    Warning icon
Style:   Alert dialog or toast
```

### Session Expired
```
Title:   "Session Expired"
Message: "Your session has expired. Please sign in again."
Button:  "Sign In"
Auto-redirect: To auth screen
```

---

## User Feedback States

1. **Signing In**
   - Show loading spinner on button or full screen
   - Disable all interactive elements
   - Show for minimum 1 second (even if quick)

2. **Success**
   - Brief success message (optional)
   - Auto-redirect to next screen (Profile)
   - No need for confirmation

3. **Error**
   - Show error alert with clear message
   - Provide retry button
   - Highlight the failed method

4. **Signing Out**
   - Confirmation alert: "Are you sure?"
   - Two buttons: "Cancel" and "Sign Out" (red)
   - On confirm, show brief loading
   - Redirect to auth screen

---

## Design Handoff Checklist

Before sending to developers:

- [ ] High-fidelity mockups created
- [ ] Color values documented (hex codes)
- [ ] Font families and weights finalized
- [ ] Icon assets exported (iOS + Android resolutions)
- [ ] Spacing/measurements annotated (pt or dp)
- [ ] All states shown (default, hover, active, disabled, loading)
- [ ] Dark mode variants designed
- [ ] Animations/transitions specified (timing in ms)
- [ ] Safe areas marked (iOS notch, Android nav bar)
- [ ] Accessibility specs reviewed
- [ ] Design system/component library ready
- [ ] Design tokens documented
- [ ] Platform-specific variations noted

---

## Questions Before Design Kickoff

1. **Brand Identity**:
   - What's the primary brand color?
   - Logo preferred orientation/size?
   - Any brand mascot/character?

2. **Tone & Style**:
   - Playful or professional?
   - Minimalist or detailed?
   - Any design trends to avoid?

3. **Visual Preferences**:
   - Prefer illustrations or flat design?
   - Any reference apps/designs you like?
   - Specific animation style preference?

4. **MVP Scope**:
   - Are we supporting dark mode from day 1?
   - Web version needed immediately?
   - Tablet/iPad optimizations needed?

5. **User Base**:
   - Age group of primary users?
   - Any regional considerations?
   - Accessibility priorities?

---

## Design System Integration

Ensure consistency with:
- [ ] App-wide button styles
- [ ] Typography hierarchy
- [ ] Color palette/tokens
- [ ] Spacing/grid system
- [ ] Icon library and style
- [ ] Animation/motion principles
- [ ] Dark mode implementation
- [ ] Accessibility standards

