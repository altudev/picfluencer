# Picfluencer Authentication & Profile Screens
## UX/Design Specifications

This document outlines the specifications for the authentication and profile screens in the Picfluencer mobile app. The UX/design team should use this as a reference for creating visual designs.

---

## 1. Authentication Screen (`auth.tsx`)

### Purpose
The first screen users see when they open the app. It allows them to sign in quickly with multiple authentication methods.

### Key Features

#### 1.1 Authentication Methods (3 options only)
We will have **exactly 3 sign-in methods**:

1. **Anonymous Sign-In (Guest Mode)**
   - Button label: "Continue as Guest"
   - Purpose: Allow users to start using the app immediately without creating an account
   - Benefits: No friction, users can explore the app first
   - Data: Creates an anonymous user account that can be upgraded later

2. **Google Sign-In**
   - Button with Google branding
   - Uses user's Google account for authentication
   - Auto-populates email and name if available
   - Industry standard, users are familiar with this

3. **Apple Sign-In**
   - Button with Apple branding
   - Available on iOS devices
   - Can be hidden or disabled on Android/Web
   - Provides privacy-focused authentication

### Layout Structure

```
┌─────────────────────────────────────┐
│         Welcome to Picfluencer      │  ← Header with app name/logo
│  Get started with content creation  │  ← Subtitle/tagline
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│     Quick Start - Sign In Options   │  ← Section title
├─────────────────────────────────────┤
│                                     │
│    [🔐 Continue as Guest]           │  ← Prominent button (primary color)
│    Start using the app right now    │  ← Supporting text
│                                     │
└─────────────────────────────────────┘

    ─────────────────────────────────
              OR
    ─────────────────────────────────

┌─────────────────────────────────────┐
│      Sign In with Your Account      │  ← Section title
├─────────────────────────────────────┤
│                                     │
│    [🔵 Sign in with Google]         │  ← Full-width button
│                                     │
│    [🖤 Sign in with Apple]          │  ← Full-width button (iOS only)
│                                     │
│    Already have an account?         │  ← Optional help text
│    Learn more about features →      │
│                                     │
└─────────────────────────────────────┘

```

### Screen Elements

#### Header Section
- **Logo/Branding**: Picfluencer logo or icon at the top
- **Title**: "Welcome to Picfluencer" (or your branded greeting)
- **Subtitle**: "Get started quickly with anonymous sign-in or create an account"
- **Visual Treatment**:
  - Center-aligned text
  - Use brand colors
  - Leave whitespace above for visual hierarchy

#### Anonymous Sign-In Section
- **Section Title**: "Quick Start"
- **Main Button**:
  - Label: "Continue as Guest"
  - Style: Filled button (primary brand color)
  - Size: Full width with padding (16-20px margins)
  - Padding: 16px vertical, 24px horizontal
  - Border radius: 12px
  - State: Show loading spinner during authentication
- **Supporting Text**:
  - "No sign-up required. Your data will be saved and you can create an account later."
  - Size: Small, secondary color
  - Opacity: 70%

#### Divider
- **Style**: Horizontal line with "OR" text in the middle
- **Color**: Light gray/border color
- **Spacing**: 30px vertical on both sides

#### Social Sign-In Section
- **Section Title**: "Sign In with Your Account"
- **Google Button**:
  - Label: "Sign in with Google"
  - Include Google logo (G icon)
  - Style: Filled button (white/light background with Google blue text, or use Google's official button style)
  - Size: Full width
  - Padding: 14px vertical
  - Border radius: 12px
- **Apple Button**:
  - Label: "Sign in with Apple"
  - Include Apple logo
  - Style: Filled button (dark/black background with white text on iOS)
  - Size: Full width
  - Padding: 14px vertical
  - Border radius: 12px
  - **Important**: Only show on iOS, hide on Android/Web
- **Button Spacing**: 12-16px between buttons

#### Loading State
- When user taps any sign-in button, show loading indicator
- Replace button text with spinner
- Disable all buttons during authentication
- Show for 1-3 seconds minimum (even if quick, for UX clarity)

### Loading Screen
While checking if user is already signed in:
- Show centered loading spinner
- Display "Loading..." or "Checking your account..."
- Full screen overlay with semi-transparent background (optional)

### Design Considerations

1. **Accessibility**
   - Buttons minimum 44x44pt touch target
   - Color not the only differentiator (use icons/text)
   - High contrast text/background
   - Clear button states (enabled, pressed, disabled)

2. **Responsive Design**
   - Should work on small (iPhone SE) to large screens (iPad)
   - Padding should scale appropriately
   - Text should be readable at all sizes

3. **Brand Consistency**
   - Use consistent primary and secondary colors
   - Font family matching app branding
   - Button styles consistent with rest of app

4. **Error States**
   - Network errors: "Unable to connect. Please check your internet."
   - Authentication failures: "Sign in failed. Please try again."
   - Show error in toast/alert with retry option

5. **Platform-Specific**
   - iOS: Show Apple button prominently (recommended by Apple)
   - Android: Hide Apple button
   - Web: Hide Apple button, consider showing more options

---

## 2. Profile Screen (`profile.tsx`)

### Purpose
Displays the current user's information, account details, session info, and provides sign-out functionality.

### Key Features

#### 2.1 User Profile Header
- **Avatar**:
  - Circular image (100x100pt)
  - Background color = brand primary color
  - Display first letter of user's name or email
  - If name is "John", show "J"
- **User Name**:
  - Large, bold text (28pt font)
  - Display user's full name or "Guest User" if anonymous
- **Account Type Badge** (for anonymous users only):
  - Rounded rectangle with light background
  - Text: "Anonymous Account"
  - Position: Below name
  - Color: Primary color with 20% opacity

#### 2.2 Account Information Section
Collapsible or static section showing:

| Field | Value Example |
|-------|---|
| **User ID** | `cuid_1234567890abcdef` |
| **Email** | `user@example.com` or "Anonymous (No email)" |
| **Name** | `John Doe` or "Anonymous User" |
| **Email Verified** | Yes/No |
| **Account Type** | Anonymous / Regular |

- **Layout**: Two-column layout (label on left, value on right)
- **Dividers**: Light gray line between rows
- **Card Style**:
  - Border radius: 12px
  - Border: 1px light border
  - Padding: 16px
  - Background: Slightly tinted or transparent

#### 2.3 Session Information Section
Shows current session details:

| Field | Value Example |
|-------|---|
| **Session ID** | `sess_1234567890abcdef...` (truncated) |
| **Created At** | `Oct 15, 2025` |
| **Updated At** | `Oct 15, 2025` |

- Same styling as Account Information section
- Help users understand their session status

#### 2.4 Upgrade Prompt (Anonymous Users Only)
- **Visibility**: Only shown for anonymous accounts
- **Design**:
  - Alert/callout box style
  - Icon: Warning/info icon with primary color
  - Title: "Upgrade Your Account"
  - Message: "You're currently using an anonymous account. Create a full account to save your progress and access all features."
  - Button: "Create Account" (secondary color, centered)
  - Background: Light tint of primary color
  - Border: 1px in primary color

#### 2.5 Sign Out Button
- **Position**: Bottom of screen (in scrollable content)
- **Style**:
  - Outlined/bordered button (not filled)
  - Text color: Red (#FF3B30)
  - Icon: Arrow/exit icon
  - Label: "Sign Out"
  - Border: Light gray
  - Size: Full width
  - Padding: 16px vertical

### Layout Structure

```
┌─────────────────────────────────────┐
│                                     │
│           [  J  ]                   │  ← Avatar circle with initial
│          John Doe                   │  ← User name
│                                     │
│   [Anonymous Account]               │  ← Badge (if applicable)
│                                     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Account Information                │  ← Section title
├─────────────────────────────────────┤
│ User ID:           cuid_123...      │
├─────────────────────────────────────┤
│ Email:             (No email)       │
├─────────────────────────────────────┤
│ Name:              John Doe         │
├─────────────────────────────────────┤
│ Email Verified:    No               │
├─────────────────────────────────────┤
│ Account Type:      Anonymous        │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│  Session Information                │  ← Section title
├─────────────────────────────────────┤
│ Session ID:        sess_123...      │
├─────────────────────────────────────┤
│ Created At:        Oct 15, 2025     │
├─────────────────────────────────────┤
│ Updated At:        Oct 15, 2025     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ ⚠️  Upgrade Your Account            │
│                                     │
│ You're currently using an           │
│ anonymous account. Create a full    │
│ account to save your progress and   │
│ access all features.                │
│                                     │
│   [Create Account]                  │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│   [➜ Sign Out]                      │
└─────────────────────────────────────┘
```

### Screen States

#### Loading State
- Full screen spinner
- "Loading profile..." text
- Prevent interaction

#### Not Signed In State
- Large centered icon (person icon)
- Title: "Not Signed In"
- Message: "Please sign in to view your profile"
- Button: "Go to Sign In" (primary color)
- This state occurs if session is lost mid-session

#### No User State (Edge Case)
- Same as not signed in state
- Safety fallback for error conditions

### Design Considerations

1. **Scrollable Content**
   - Use ScrollView for screens where content exceeds viewport
   - Ensure sign out button is always accessible with scroll
   - Add bottom padding for last item

2. **Data Display**
   - Use monospace font for technical IDs
   - Truncate long IDs with ellipsis
   - Format dates consistently (e.g., "Oct 15, 2025")

3. **User Feedback**
   - Confirmation alert before sign out: "Are you sure you want to sign out?"
   - Two buttons: Cancel, Sign Out (destructive)
   - Show error alert if sign out fails with retry option

4. **Accessibility**
   - Use semantic labels for all fields
   - Ensure sufficient color contrast
   - Make all interactive elements 44x44pt minimum

5. **Empty States**
   - If no session data, show "Not available" instead of blank
   - Gracefully handle missing fields

6. **Anonymous User Experience**
   - Make upgrade path clear and non-intrusive
   - Highlight benefits of creating full account
   - Don't pressure, just inform

---

## 3. Navigation Flow

### Entry Points
- **First time user**: Lands on Auth Screen
- **Returning user with active session**: Automatically redirected to Profile Screen
- **Session expired**: Redirected to Auth Screen

### Navigation Rules
- **From Auth Screen**:
  - After successful sign-in → Profile Screen (using `replace` to prevent back navigation)
  - Loading → Stay on Auth Screen

- **From Profile Screen**:
  - Cannot go back to Auth Screen (tab disabled/hidden while signed in)
  - After sign out → Auth Screen (using `replace`)
  - Upgrade button → Auth Screen for account creation (future feature)

### Tab Bar Visibility
- **When signed out**:
  - Show: "Sign In" tab
  - Hide: "Profile" tab

- **When signed in**:
  - Show: "Profile" tab
  - Hide: "Sign In" tab
  - Other tabs: "Home", "Explore" (always visible)

---

## 4. Design Tokens / Brand Variables

### Colors
- **Primary**: Your brand primary color (e.g., #007AFF or your brand blue)
- **Secondary**: Your brand secondary color
- **Accent**: Red for destructive actions (#FF3B30)
- **Text**: Primary text color (varies by light/dark mode)
- **Border**: Light gray border for cards
- **Background**: Light or dark based on theme

### Typography
- **Title/Heading**: Bold, 28pt
- **Section Title**: Semi-bold, 18pt
- **Body Text**: Regular, 16pt
- **Small Text**: Regular, 14pt
- **Caption**: Regular, 12pt

### Spacing
- **Container Padding**: 20px horizontal
- **Section Spacing**: 24px between sections
- **Button Padding**: 16px vertical, 24px horizontal
- **Card Padding**: 16px
- **Gap Between Buttons**: 12-16px

### Shadows/Elevation
- **Card Shadow**: Subtle elevation (iOS: light shadow, Android: material shadow)
- **Button Shadow**: On press, show slight depression

### Border Radius
- **Buttons**: 12px
- **Cards**: 12px
- **Avatar**: 50% (circle)
- **Badges**: 16px

---

## 5. Interaction Design

### Button States
- **Enabled**: Full opacity, tappable
- **Disabled**: 50% opacity, not tappable
- **Pressed/Active**: Slight dimming or background color shift
- **Loading**: Spinner animation, disabled state

### Feedback
- **Success**: Alert notification "Successfully signed in!"
- **Error**: Alert notification with error message and retry option
- **Loading**: Spinner on button or full screen

### Animations (Optional but recommended)
- **Page Transitions**: Smooth fade or slide
- **Button Press**: Quick scale animation (0.95x)
- **Loading Spinner**: Smooth rotation
- **Section Expansion**: Slide down with opacity fade

---

## 6. Platform-Specific Considerations

### iOS
- **Safe Area**: Respect notch/Dynamic Island
- **Apple Sign-In**: Mandatory if using other social auth
- **Status Bar**: Light/dark based on theme
- **Gestures**: Swipe back to previous screen (if applicable)

### Android
- **Safe Area**: Respect status bar and navigation bar
- **Apple Sign-In**: Hidden/disabled
- **Back Button**: Hardware back button should sign out after confirmation
- **Gestures**: Gesture navigation vs. 3-button navigation

### Web (if applicable)
- **Responsive**: Works on mobile-sized browsers
- **Keyboard Support**: Tab navigation, Enter to submit
- **Copy-paste**: Allow copying of user IDs and session info

---

## 7. Future Enhancements

These features are not needed for MVP but should be considered for future versions:

1. **Account Creation Flow**
   - After signing in with Google/Apple, allow editing profile
   - Add profile picture upload
   - Additional profile fields

2. **Session Management**
   - View all active sessions
   - Revoke other sessions
   - Device information

3. **Account Settings**
   - Privacy settings
   - Notification preferences
   - Dark mode toggle

4. **Two-Factor Authentication**
   - Optional 2FA setup
   - Recovery codes

5. **Account Deletion**
   - Permanent account deletion option
   - Confirmation and data backup warning

---

## 8. Quality Assurance Checklist

### Functionality
- [ ] Anonymous sign-in works on all platforms
- [ ] Google sign-in works and populates user data
- [ ] Apple sign-in works on iOS
- [ ] Loading states display correctly
- [ ] Error messages are clear and actionable
- [ ] Sign out clears session properly
- [ ] Navigation redirects work as expected

### Design/UX
- [ ] Buttons are 44x44pt minimum
- [ ] Text has sufficient contrast
- [ ] Responsive on small and large screens
- [ ] All interactive elements have clear states
- [ ] Consistent spacing and alignment
- [ ] Platform-specific elements hidden/shown correctly

### Accessibility
- [ ] Screen reader friendly
- [ ] High contrast mode supported
- [ ] Text sizes scalable
- [ ] No color-only differentiators
- [ ] Keyboard navigation works

### Performance
- [ ] Auth requests complete in <3 seconds
- [ ] Loading spinners smooth and performant
- [ ] No jank on state transitions
- [ ] Images/icons optimized

---

## 9. Design Assets Needed

1. **Logo/Icon**: Picfluencer logo for auth screen header
2. **Illustrations** (optional):
   - Empty state illustration for "Not Signed In"
   - Success illustration (optional)
3. **Icons**:
   - Google logo (use official)
   - Apple logo (use official)
   - Sign out icon
   - User/profile icon
   - Info icon for upgrade prompt
4. **Colors**: Brand color palette
5. **Typography**: Approved font families and weights

---

## 10. Developer Notes for Implementation

- **Current Status**: Auth screen shows email/password form, needs to be replaced with social buttons
- **Google Sign-In**: Will require Google Cloud setup and credentials
- **Apple Sign-In**: Requires Apple Developer account and certificate setup
- **Session Management**: Using Better Auth library for authentication
- **Storage**: Session data stored securely via expo-secure-store
- **Navigation**: Using Expo Router for navigation
- **State Management**: Using Better Auth's useSession() hook

---

## Questions for Design Team

1. Should there be a logo/branding on the auth screen?
2. What's the exact brand color palette we should use?
3. Should error states show as toasts or alerts?
4. Any specific font families preferred?
5. Should we have splash screen animations?
6. Preferred animation style (subtle vs. playful)?
7. Should profile screen show a background image/gradient?
8. Any dark mode specific considerations?

