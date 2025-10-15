# Picfluencer Wireframes
## Visual Layout Reference

---

## Authentication Screen - Detailed Wireframe

### Full Screen Layout (iPhone 14 Pro Max - 430x932px)

```
┌────────────────────────────────────────┐ 0px
│                                        │
│                                        │ 40px (Safe area top)
│        [📱 PICFLUENCER LOGO]          │
│                                        │ 60px
│     Welcome to Picfluencer            │ 100px
│   Get started quickly with             │ 130px
│    anonymous sign-in or create        │
│       an account                       │ 145px
│                                        │
│                                        │ 190px (Space)
├────────────────────────────────────────┤ 210px
│ Quick Start                            │
│                                        │
│  ┌──────────────────────────────────┐  │ 250px
│  │ Continue as Guest                │  │ 280px
│  └──────────────────────────────────┘  │
│                                        │ 300px
│  No sign-up required. Your data       │ 320px
│  will be saved and you can create     │ 335px
│  an account later.                     │
│                                        │ 360px
├────────────────────────────────────────┤ 390px
│                                        │
│      ──────────────────────────        │ 410px
│              OR                        │ 425px
│      ──────────────────────────        │ 440px
│                                        │ 460px
├────────────────────────────────────────┤ 480px
│ Sign In with Your Account              │
│                                        │
│  ┌──────────────────────────────────┐  │ 520px
│  │ 🔵 Sign in with Google           │  │ 550px
│  └──────────────────────────────────┘  │ 570px
│                                        │ 585px
│  ┌──────────────────────────────────┐  │ 600px
│  │ 🖤 Sign in with Apple            │  │ 630px
│  └──────────────────────────────────┘  │ 650px
│                                        │
│                                        │ 680px (Space - scrollable)
│                                        │
└────────────────────────────────────────┘ 932px
```

### Responsive Breakpoints

#### Small Screen (iPhone SE - 375x667px)
```
┌──────────────────────────┐
│     [📱 LOGO]            │ 30px top
│                          │
│ Welcome to Picfluencer   │ 80px
│ Get started quickly...   │ 120px
│                          │
│ ┌──────────────────────┐ │ 160px
│ │ Continue as Guest    │ │ 185px
│ └──────────────────────┘ │
│                          │ 205px
│ No sign-up required... │ 225px
│                          │ 250px
│ ──────────────────────   │ 270px
│          OR              │ 280px
│ ──────────────────────   │ 290px
│                          │ 310px
│ ┌──────────────────────┐ │ 330px
│ │ Sign in with Google  │ │ 355px
│ └──────────────────────┘ │
│                          │ 370px
│ ┌──────────────────────┐ │ 390px
│ │ Sign in with Apple   │ │ 415px
│ └──────────────────────┘ │
│                          │ 435px
└──────────────────────────┘ 667px
```

#### Tablet (iPad - 768x1024px)
```
┌────────────────────────────────────────────────────────────┐
│                                                            │
│            [📱 PICFLUENCER LOGO]                          │ 60px
│                                                            │
│          Welcome to Picfluencer                           │ 120px
│    Get started quickly with anonymous sign-in...         │ 160px
│                                                            │
│                                                            │ 220px
│    ┌────────────────────────────────────────────────┐     │ 260px
│    │  Continue as Guest                             │     │ 310px
│    └────────────────────────────────────────────────┘     │
│    No sign-up required. Your data will be saved...       │ 340px
│                                                            │ 380px
│    ──────────────────────────────────────────────────     │ 400px
│                    OR                                      │ 415px
│    ──────────────────────────────────────────────────     │ 430px
│                                                            │ 480px
│    ┌────────────────────────────────────────────────┐     │ 520px
│    │  Sign in with Google                           │     │ 570px
│    └────────────────────────────────────────────────┘     │
│                                                            │ 590px
│    ┌────────────────────────────────────────────────┐     │ 630px
│    │  Sign in with Apple                            │     │ 680px
│    └────────────────────────────────────────────────┘     │
│                                                            │
└────────────────────────────────────────────────────────────┘ 1024px
```

---

## Profile Screen - Detailed Wireframe

### Full Screen Layout (iPhone 14 Pro Max - 430x932px)

```
┌────────────────────────────────────────┐ 0px (Safe area top: 50px)
│                                        │
│            ╔════════╗                  │ 80px
│            ║   J    ║                  │ 130px
│            ╚════════╝                  │ 180px
│                                        │ 200px
│         John Doe                       │ 240px
│                                        │ 265px
│   ┌──────────────────────────────────┐ │ 285px
│   │  Anonymous Account               │ │ 310px
│   └──────────────────────────────────┘ │
│                                        │ 330px
├────────────────────────────────────────┤ 360px
│ Account Information                    │
│                                        │
│ User ID                                │ 390px
│ cuid_1234567890abcdef...               │ 410px
│ ─────────────────────────────────────  │ 425px
│                                        │
│ Email                                  │ 450px
│ (Anonymous - No email)                 │ 470px
│ ─────────────────────────────────────  │ 485px
│                                        │
│ Name                                   │ 510px
│ John Doe                               │ 530px
│ ─────────────────────────────────────  │ 545px
│                                        │
│ Email Verified                         │ 570px
│ No                                     │ 590px
│ ─────────────────────────────────────  │ 605px
│                                        │
│ Account Type                           │ 630px
│ Anonymous                              │ 650px
│                                        │ 665px
├────────────────────────────────────────┤ 685px
│ Session Information                    │
│                                        │
│ Session ID                             │ 715px
│ sess_1234567890abcdef...               │ 735px
│ ─────────────────────────────────────  │ 750px
│                                        │
│ Created At                             │ 775px
│ Oct 15, 2025                           │ 795px
│ ─────────────────────────────────────  │ 810px
│                                        │
│ Updated At                             │ 835px
│ Oct 15, 2025                           │ 855px
│                                        │
│ (Continue scrolling...)                │
│                                        │
└────────────────────────────────────────┘ 932px
```

### Profile Screen - Bottom Section (Scrollable)

```
┌────────────────────────────────────────┐
│ (Scrolled down)                        │
│                                        │
├────────────────────────────────────────┤
│ ┌──────────────────────────────────────┐│
│ │ ⚠️  UPGRADE YOUR ACCOUNT             ││ Alert Box
│ │                                      ││
│ │ You're currently using an            ││
│ │ anonymous account. Create a full     ││
│ │ account to save your progress and    ││
│ │ access all features.                 ││
│ │                                      ││
│ │  ┌──────────────────────────────┐   ││
│ │  │  Create Account              │   ││
│ │  └──────────────────────────────┘   ││
│ │                                      ││
│ └──────────────────────────────────────┘│
│                                        │
│                                        │ 30px space
│ ┌──────────────────────────────────────┐│
│ │  ↗ Sign Out                          ││ Red, outlined
│ └──────────────────────────────────────┘│
│                                        │
│                                        │ 30px bottom safe area
└────────────────────────────────────────┘
```

---

## Button Component Details

### Standard Button
```
┌──────────────────────────────────────┐
│                                      │ 16px top padding
│    Continue as Guest                 │ Text (16pt, bold)
│                                      │ 16px bottom padding
└──────────────────────────────────────┘
← 20px left →                ← 20px right →
```

### Button with Icon (Social)
```
┌──────────────────────────────────────┐
│ 🔵  Sign in with Google              │
│ 24px  16px left      16px right      │
└──────────────────────────────────────┘
```

### Button States

#### Enabled
```
┌──────────────────────────────────────┐
│ Continue as Guest                    │ Primary color
└──────────────────────────────────────┘
```

#### Pressed
```
╔══════════════════════════════════════╗
║ Continue as Guest                    ║ Darker shade / scaled
╚══════════════════════════════════════╝
```

#### Loading
```
┌──────────────────────────────────────┐
│           ⟳ Loading...               │ Spinner animation
└──────────────────────────────────────┘
```

#### Disabled
```
┌──────────────────────────────────────┐
│ Continue as Guest                    │ 50% opacity
└──────────────────────────────────────┘
```

---

## Card Component Details

### Info Card (Account Information)
```
┌──────────────────────────────────────┐ 12px radius
│ User ID                  cuid_123... │ 16px padding
├──────────────────────────────────────┤
│ Email                    user@ex... │ 1px divider
├──────────────────────────────────────┤
│ Name                     John Doe    │
└──────────────────────────────────────┘

1px border all around
Light gray (#EEEEEE or similar)
```

### Upgrade Alert Card
```
┌──────────────────────────────────────┐
│ ⚠️                                    │ Icon 24px
│                                      │
│ Upgrade Your Account                 │ Title 18pt bold
│                                      │ 8px space
│ You're currently using an anonymous  │ Message text
│ account. Create a full account to    │ 14pt, 70% opacity
│ save your progress and access all    │
│ features.                            │
│                                      │ 20px space
│  ┌──────────────────────────────┐   │
│  │ Create Account               │   │ Button 14pt
│  └──────────────────────────────┘   │
│                                      │ 20px padding bottom
└──────────────────────────────────────┘

Background: Primary color at 10% opacity
Border: 1px Primary color
Border radius: 12px
Padding: 20px
```

---

## Typography Hierarchy

### Auth Screen
```
╔════════════════════════════════════════╗
║      Welcome to Picfluencer           ║ 28pt Bold (Title)
║                                        ║
║    Get started quickly with            ║ 16pt Regular (Subtitle)
║   anonymous sign-in or create          ║
║        an account                      ║
╚════════════════════════════════════════╝

Quick Start                              ← 18pt Semi-bold (Section)

┌──────────────────────────────────────┐
│ Continue as Guest                    │ ← 16pt Semi-bold (Button)
└──────────────────────────────────────┘

No sign-up required. Your data will    ← 14pt Regular (Small text)
be saved and you can create an
account later.
```

### Profile Screen
```
        ╔════════╗
        ║   J    ║                       ← Avatar 100x100px
        ╚════════╝

       John Doe                          ← 28pt Bold (Name)

  ┌──────────────────────────────────┐
  │  Anonymous Account               │  ← 14pt Medium Badge
  └──────────────────────────────────┘

Account Information                      ← 18pt Semi-bold (Section)

User ID                                  ← 14pt Regular (Label)
cuid_1234567890abcdef...                ← 14pt Regular (Value, 70% opacity)
```

---

## Color Application Guide

### Primary Button (Guest Sign-In)
```
Background:     Primary Color (#007AFF or brand color)
Text:           White (#FFFFFF)
Border:         None
Shadow:         Subtle elevation shadow
On Press:       Darken by 10-15%
Disabled:       50% opacity
```

### Social Sign-In Buttons

#### Google Button
```
Option A (Official Google):
Background:     White (#FFFFFF)
Text:           Google Blue + Text (#1F2937)
Border:         1px Light Gray
Icon:           Google G Logo (24px)

Option B (Filled):
Background:     Google Blue (#4285F4)
Text:           White (#FFFFFF)
Border:         None
Icon:           Google G Logo (24px)
```

#### Apple Button
```
Background:     Black (#000000) or Dark (#1C1C1E)
Text:           White (#FFFFFF)
Border:         None (or 1px light border)
Icon:           Apple Logo (24px white)
```

### Card Styling
```
Background:     Light Gray Tint or Transparent
Border:         1px Light Gray (#EEEEEE or #E5E5EA)
Border Radius:  12px
Shadow:         Subtle (1-2px blur, low opacity)
Padding:        16px
```

### Alert/Upgrade Box
```
Background:     Primary Color @ 10% opacity
Border:         1px Primary Color
Icon:           Primary Color
Text:           Normal text
Button:         Primary Color background, white text
```

### Destructive Button (Sign Out)
```
Background:     Transparent
Border:         1px Red (#FF3B30)
Text:           Red (#FF3B30)
Icon:           Red (#FF3B30)
On Press:       Light red background fill
```

---

## Spacing Grid (8pt baseline)

```
8pt   × 0.5x = 4px   (very small)
8pt   × 1x   = 8px   (tiny)
8pt   × 2x   = 16px  (small)
8pt   × 3x   = 24px  (medium)
8pt   × 4x   = 32px  (large)
8pt   × 5x   = 40px  (extra large)
```

### Applied Spacing
```
Container edges:        20px (2.5x grid)
Section spacing:        24px (3x grid)
Item spacing:           12px (1.5x grid)
Button height:          50px (custom, 44pt minimum)
Button padding:         16px vertical, 24px horizontal
Card padding:           16px (2x grid)
Divider spacing:        30px top/bottom
```

---

## Safe Areas & Platform Considerations

### iOS Safe Area
```
Top:    50px (varies: notch, Dynamic Island)
Bottom: 34px (varies: home indicator)
Left:   0px
Right:  0px
```

### Android Safe Area
```
Top:    24px (status bar)
Bottom: 0px (nav bar varies)
Left:   0px
Right:  0px

Note: Android uses gesture navigation in newer versions
```

### Layout Protection
```
┌────────────────────────────────────────┐ 0px
│ ▀▀▀▀ STATUS BAR / NOTCH ▀▀▀▀         │ 50px (iOS)
├────────────────────────────────────────┤ 50px start
│                                        │
│     SAFE CONTENT AREA                  │
│                                        │
├────────────────────────────────────────┤ 932-34px (iOS)
│ ▄▄▄▄ HOME INDICATOR / NAV BAR ▄▄▄▄   │ 932px (iOS)
└────────────────────────────────────────┘ 932px

Keep interactive elements out of safe area edges!
```

---

## Dark Mode Variants

### Light Mode
```
Background:     #FFFFFF
Primary Text:   #000000
Secondary Text: #666666 (70% opacity)
Borders:        #EEEEEE
Cards:          #F9F9F9 (subtle tint)
Buttons:        Primary color filled
```

### Dark Mode
```
Background:     #1C1C1E
Primary Text:   #FFFFFF
Secondary Text: #A0A0A0 (70% opacity)
Borders:        #333333
Cards:          #2C2C2E
Buttons:        Primary color filled (adjusted for dark)
```

---

## Error & Success States

### Error Alert
```
┌────────────────────────────────────────┐
│ ⚠️ Sign In Failed                      │ Orange/Red icon
│                                        │
│ Unable to sign in. Please try again.   │
│                                        │
│ [RETRY]  [TRY ANOTHER METHOD]        │
└────────────────────────────────────────┘
```

### Success Toast (Non-intrusive)
```
             ┌──────────────────────────┐
             │ ✓ Signed in successfully! │ Green icon
             └──────────────────────────┘
                 (Auto-dismiss after 2-3s)
```

### Loading Full-Screen
```
┌────────────────────────────────────────┐
│                                        │
│                                        │
│           ⟳ Signing in...             │ Spinner + text
│                                        │
│                                        │
│                                        │
└────────────────────────────────────────┘
```

---

## Export Requirements for Development

### Icons (needed)
- [ ] Google logo (24pt @ 1x, 2x, 3x)
- [ ] Apple logo (24pt @ 1x, 2x, 3x)
- [ ] User avatar placeholder (100x100pt)
- [ ] Warning/info icon (24pt, 80pt)
- [ ] Check icon (success)
- [ ] Sign out arrow (20pt)
- [ ] App logo/branding

### Assets (needed)
- [ ] Splash screen image
- [ ] App icon (180x180pt, rounded 48pt corners)
- [ ] Tab bar icons (all variants)
- [ ] Illustration assets (if applicable)

### Design Tokens (to document)
- [ ] Color codes (hex, RGB, HSL)
- [ ] Font families and weights
- [ ] Font sizes and line heights
- [ ] Spacing values
- [ ] Border radius values
- [ ] Shadow/elevation definitions
- [ ] Animation timing functions

