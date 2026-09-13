# WhatsAppMSG — Brand Design System & Development Standards

## 1. Brand direction

WhatsAppMSG is a B2B WhatsApp API, messaging, automation and AI platform.

The visual language should feel:

- Professional
- Enterprise SaaS
- Fast and modern
- Trustworthy
- Communication-first
- AI-ready
- Clean rather than overly decorative

**Primary visual rule:** use the logo's green family consistently across the public website, dashboard, developer portal, inbox, AI screens and mobile UI.

---

## 2. Approved brand palette

| Token | HEX | Main use |
|---|---|---|
| Deep Green | `#013B23` | Dark text, deep surfaces, high-contrast areas |
| Dark Green | `#006736` | Strong brand elements |
| Brand Green | `#05A222` | Primary actions, active states |
| Bright Green | `#1CD72C` | Highlights, success, glow |
| Emerald | `#039B56` | Secondary brand color |
| Teal Green | `#07CF74` | Gradient transitions, interactive accents |
| Lime | `#6AEB31` | Highlight / gradient start |
| Ink | `#14201C` | Main dark UI text |
| Primary Text | `#1F2A26` | Headings/body |
| Secondary Text | `#5F7069` | Supporting text |
| Muted Text | `#8A9993` | Metadata/placeholders |
| Border | `#E2EAE6` | Borders/dividers |
| Surface | `#F6FAF8` | Soft sections/cards |
| Surface Green | `#E9F9EE` | Active item backgrounds, badge tints |
| Border Green | `#C4EBD0` | Green badge/card borders |
| White | `#FFFFFF` | Main background |

### Core brand gradient

`#6AEB31 → #1CD72C → #07CF74 → #039B56`

Use this for:

- Logo highlights
- Hero accents
- Primary visual graphics
- AI/automation highlights
- Important decorative elements

Do **not** use the gradient on every button or every section.

---

## 3. UI color rules

### Primary CTA

Use `#05A222` as the default primary action.

Examples:

- Get Started
- Connect WhatsApp
- Create Campaign
- Send Message
- Create AI Agent

Hover/active can move toward `#006736`.

### Success

Use the brand green family for:

- Connected
- Active
- Delivered
- Read
- Online
- Successful

### Dark text

Prefer `#14201C` / `#1F2A26` instead of pure black.

### Background

Default website background:

`#FFFFFF`

Soft section background / Dashboard background:

`#F6FAF8`

This keeps the product bright, clean, and professional.

---

## 4. Recommended visual hierarchy

### Public website

- White background
- Deep green/charcoal typography
- Green CTA
- Green gradient hero accents
- Soft green glow
- Large whitespace
- Rounded SaaS cards

### Dashboard

- White or `#F6FAF8` application background
- White cards (`#FFFFFF`, border `#E2EAE6`, soft green shadow)
- Deep green/charcoal text (`#14201C`, `#1F2A26`)
- Green active navigation state (`bg-[#E9F9EE] text-[#006736]`)
- Green status indicators (`#05A222`)
- Full-width content alignment with sidebar
- Very limited gradient usage

### AI screens

Use the same WhatsAppMSG green base, with a restrained secondary indigo/purple accent only when AI needs to be visually distinguished.

### Developer portal

Keep it integrated with the main application:

- Integrated inside `DashboardLayout` with Main Sidebar & Header
- White cards on `#F6FAF8` surface background
- Deep green/charcoal typography
- Green status indicators
- Code blocks with sleek dark surfaces (`#14201C`) and bright green syntax (`#1CD72C`)

---

## 5. Button system

### Primary
- Background: `#05A222`
- Text: `#FFFFFF`
- Hover: `#006736`
- Border: `#05A222`

### Secondary
- Background: `#E9F9EE`
- Text: `#006736`
- Hover: `#D9F3E2`
- Border: `#C4EBD0`

### Outline
- Background: transparent
- Border: `#05A222`
- Text: `#006736`
- Hover: `#F6FAF8`

### Ghost
- Background: transparent
- Text: `#006736`
- Hover: `#F6FAF8`

### Danger
- Background: `#D64545`
- Text: `#FFFFFF`
- Hover: `#B73333`

---

## 6. Status system

| Status | Color |
|---|---|
| Connected / Active | `#05A222` |
| Delivered / Read | `#039B56` |
| Processing | `#07CF74` |
| Warning | `#D99A00` |
| Error / Failed | `#D64545` |
| Disabled | `#8A9993` |

Brand green should remain the dominant success color.

---

## 7. Border radius

Recommended SaaS radius:

- Small: `8px` (`rounded-lg`)
- Medium: `12px` (`rounded-xl`)
- Large: `16px` (`rounded-2xl`)
- Card: `16px`–`20px` (`rounded-2xl`)
- Hero/large visual: `24px` (`rounded-3xl`)

Avoid excessive pill-shaped UI except for:

- Status badges
- Tags
- Filters
- Compact controls

---

## 8. Shadows

Use soft, low-contrast shadows.

Preferred direction:

`0 8px 30px rgba(1, 59, 35, 0.04)`

For floating/featured cards:

`0 16px 50px rgba(1, 59, 35, 0.08)`

Avoid heavy black shadows.

---

## 9. Typography

Recommended:

- **Inter** for the application UI
- **Inter Tight** or **Plus Jakarta Sans** for marketing headings if desired

General hierarchy:

- Hero: bold / 56–72px desktop
- H1: 40–48px
- H2: 24–32px
- H3: 18–20px
- Body: 14–16px
- Small/meta: 12–13px

Use high font weight for headings, but keep body copy regular and readable.

---

## 10. Logo usage

The approved WhatsAppMSG logo uses:

- Glossy green ribbon-style W
- Dark charcoal lettering
- Green MSG
- WhatsApp-style communication symbolism

**Sidebar Logo Rules:**
1. **Expanded Sidebar:** Display full `/images/logo.png` cleanly without duplicate brand text overlay.
2. **Collapsed Sidebar:** Display icon `/images/svgicon.png` centered.
3. Avoid placing the logo on dark/busy backgrounds.

---

## 11. Tailwind usage

Map the design tokens into Tailwind rather than repeatedly writing random green values.

Example:

```tsx
<button className="bg-[#05A222] hover:bg-[#006736] text-white">
  Get Started
</button>
```

For repeated production usage, prefer CSS variables/design tokens so the entire product can be rebranded centrally.

---

## 12. Brand consistency rule

Across **every WhatsAppMSG screen**:

`White + Deep Green/Charcoal + Brand Green`

should be the base visual language.

Green gradients are accents, not the entire UI.

The same palette must be used in:

- Public website
- Login/Register
- Dashboard
- Inbox
- Contacts
- WhatsApp management
- Templates
- Campaigns
- Automation
- AI
- Analytics
- Billing
- Developer portal
- Team
- Settings
- Mobile responsive UI

---

## 13. CSS token file

The companion file `whatsappmsg-brand.css` (and `src/index.css`) contains the reusable CSS variables and gradients for the project:

```css
:root {
  --color-deep-green: #013B23;
  --color-dark-green: #006736;
  --color-brand-green: #05A222;
  --color-bright-green: #1CD72C;
  --color-emerald: #039B56;
  --color-teal-green: #07CF74;
  --color-lime: #6AEB31;
  --color-ink: #14201C;
  --color-primary-text: #1F2A26;
  --color-secondary-text: #5F7069;
  --color-muted-text: #8A9993;
  --color-border: #E2EAE6;
  --color-surface: #F6FAF8;
  --color-surface-green: #E9F9EE;
  --color-border-green: #C4EBD0;
  --brand-gradient: linear-gradient(135deg, #6AEB31 0%, #1CD72C 30%, #07CF74 70%, #039B56 100%);
}
```

---

## 14. File & Folder Structure Guidelines (Mandatory)

All new code, features, components, and pages **must follow the established project folder architecture**:

```
src/
├── assets/                  # Static assets (images, icons, svgs)
├── components/
│   ├── layout/              # App layout wrappers (Sidebar, Header, PageContainer, MobileNav)
│   └── ui/                  # Reusable UI primitives (Button, Badge, Input, Table, Dropdown, Modal, Tabs, Avatar, Loader)
├── features/                # Feature-based domain modules
│   ├── ai/                  # AI Dashboard, Agents, KnowledgeBase, AISettings
│   ├── analytics/           # Analytics & Metrics pages/components
│   ├── auth/                # Login, Register, ForgotPassword, ResetPassword
│   ├── automation/          # Workflow & Automation builders
│   ├── billing/             # Plans, Invoices, Subscription management
│   ├── campaigns/           # Broadcast campaign creation & details
│   ├── contacts/            # Contact list, CRM, tags, segments
│   ├── dashboard/           # Main business overview & KPI cards
│   ├── developers/          # Developer API, Keys, Webhooks, Logs, Docs
│   ├── inbox/               # Live chat messaging & agent inbox
│   ├── public/              # Landing page, Features, Pricing, About, Contact
│   ├── settings/            # Account, Business profile, Security
│   ├── team/                # Team members, Roles & Permissions
│   ├── templates/           # WhatsApp HSM template manager
│   └── whatsapp/            # Cloud API numbers, QR scanner, Connection setup
├── hooks/                   # Custom shared React hooks (e.g. useAuth, useDebounce)
├── layouts/                 # Root route layouts (DashboardLayout, PublicLayout, AuthLayout, DeveloperLayout)
├── routes/                  # Central routing (AppRoutes.tsx, routeConfig.ts, ProtectedRoute.tsx)
├── services/                # API client layer & Axios/Fetch services
├── store/                   # Global state management (Zustand / Context)
├── types/                   # Shared TypeScript models and interfaces
└── utils/                   # Shared helpers, formatters, and constants (constants.ts)
```

### Feature Module Subfolder Convention

Each domain inside `src/features/<feature_name>/` must follow this structure:

```
src/features/<feature_name>/
├── components/              # Subcomponents specific to this feature
├── pages/                   # Route-level page components
├── types.ts                 # Feature-specific TypeScript interfaces
└── api.ts                   # Feature-specific API queries & mutations (optional)
```

---

## 15. Code Standards & Architecture Rules

Developers and AI assistants working on this codebase **must adhere to the following rules**:

1. **Strict TypeScript:**
   - Always define explicit interfaces or types for props, state, and API payloads.
   - Avoid `any`. Use strict typing and generics where appropriate.

2. **Component Reusability:**
   - Always reuse base primitives from `src/components/ui/` (`Button`, `Badge`, `Input`, `Table`, `Dropdown`, `Modal`, `Tabs`, `Avatar`) instead of recreating custom raw HTML buttons or inputs.
   - Ensure all layout pages are wrapped in `PageContainer` with standard fullWidth behavior.

3. **Consistent Theme Tokens:**
   - Never introduce random hex codes or arbitrary blue/dark slate backgrounds on SaaS dashboard pages.
   - All backgrounds must follow `#F6FAF8` (surface) and `#FFFFFF` (cards).
   - All primary actions must use `#05A222` (Brand Green) with hover `#006736`.

4. **No Black/Dark Sidebar:**
   - Keep the sidebar clean and light (`bg-white` with `border-r border-[#E2EAE6]`).
   - Use `svgicon.png` when collapsed and `logo.png` when expanded.

5. **Clean Routing:**
   - All protected application views (including Developers API, Team, Settings, Billing, Templates, AI, etc.) must remain nested under `DashboardLayout` so the Main Sidebar & Header remain accessible.
   - Routes and paths must be centralized in `src/utils/constants.ts` (`ROUTES` object).

6. **Zero Build & Lint Errors:**
   - Run `npm run build` or `oxlint` to verify code compiles cleanly before committing any modifications.
