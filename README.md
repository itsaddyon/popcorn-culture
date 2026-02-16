# Popcorn Culture

> A cinematic, motion-rich storefront built with React, Vite, Three.js, and Tailwind CSS.

## Overview

Popcorn Culture is an immersive e-commerce style frontend focused on strong visual storytelling and smooth interaction design. It combines a 3D hero scene, animated content flow, responsive layouts, cart interactions, and mobile-first UX touches.

## Live Experience

- 3D animated hero background
- Dynamic featured drops + category browsing
- Tap/click image reveal (grayscale to color)
- Side menu drawer with quick status
- Cart page with quantity controls and feedback toasts
- Sign-in popup flow
- Newsletter popup with celebration animation

## Feature Breakdown

### Visual and Motion

- Scroll + mouse reactive 3D vessel (`@react-three/fiber`, `@react-three/drei`)
- Framer Motion transitions for sections, popups, and menu panels
- Product image reveal interactions (desktop hover + mobile tap)

### Commerce UX

- Add-to-cart from featured and category product cards
- Real-time cart count in top navigation and side menu
- Cart page listing all selected items with increment/decrement controls
- Auto-remove item when quantity reaches zero

### Navigation and Layout

- Fixed top controls: `MENU`, `CART`, `LOGIN`
- Mobile-optimized slide-in menu
- Responsive section spacing and typography treatment

### Engagement Flows

- Login modal entry from top bar and side menu
- Newsletter subscribe success popup with celebration particles
- Quick visual toast when items are added/removed from cart

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | React 19 |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 4 |
| Motion | Framer Motion |
| 3D | three, @react-three/fiber, @react-three/drei |
| Linting | ESLint |

## Project Structure

```text
.
|- src/
|  |- App.jsx
|- App.jsx
|- index.html
|- package.json
|- tailwind.config.js
|- vite.config.js
|- eslint.config.js
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install

```bash
npm install
```

### Run in Development

```bash
npm run dev
```

### Run Lint

```bash
npm run lint
```

### Production Build

```bash
npm run build
npm run preview
```

## Mobile Testing (LAN)

To test directly on your phone (same Wi-Fi):

```bash
npm run dev -- --host 0.0.0.0 --port 5173
```

Then open:

```text
http://<your-local-ip>:5173/
```

## Social Links

- Instagram: [@popcornculture1](https://instagram.com/popcornculture1)
- WhatsApp: [+91 84095 36813](https://wa.me/918409536813)
- X: [@pop_corn_cult](https://x.com/pop_corn_cult)

## Roadmap

- Firebase authentication integration
- Persistent cart storage (user/session based)
- Backend order flow and checkout integration
- Admin product management layer
- Analytics and conversion tracking

## Contribution Notes

- Keep UI changes responsive across desktop and mobile.
- Preserve animated design language unless redesigning intentionally.
- Run `npm run lint` before pushing.

## License

This project is currently private/internal unless explicitly relicensed by the owner.
