# Popcorn Culture

A bold, animated React storefront experience built with Vite, Tailwind, Framer Motion, and React Three Fiber.

## Highlights

- Immersive 3D hero section with scroll + mouse-driven motion
- Featured products and category-based product browsing
- Cart system with live count updates
- Dedicated cart page with quantity increment/decrement
- Mobile-friendly slide-in menu with quick status panel
- Sign-in popup flow (also reachable from side menu)
- Newsletter subscribe popup with celebration animation
- Social links wired for Instagram, WhatsApp, and X
- Responsive layout tuned for desktop and mobile

## Tech Stack

- React 19
- Vite 5
- Tailwind CSS 4
- Framer Motion
- @react-three/fiber + @react-three/drei + three
- ESLint

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
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start development server

```bash
npm run dev
```

### 3. Run lint checks

```bash
npm run lint
```

### 4. Build for production

```bash
npm run build
```

### 5. Preview production build

```bash
npm run preview
```

## Key UX Features

### Cart behavior

- `ADD TO CART` increases cart count by 1
- Cart page reflects all added products
- `+` increases quantity
- `-` decreases quantity and removes item at zero
- Bottom toast confirms add/remove actions

### Navigation + menu

- Fixed top controls for `MENU`, `CART`, and `LOGIN`
- Side menu slides in from left with:
  - Home navigation
  - Cart navigation + live count
  - Sign-in action (opens login popup on home)

### Newsletter flow

- Subscribe action opens a celebratory animated popup
- Entered email is shown in the success message

## Social Profiles

- Instagram: [@popcornculture1](https://instagram.com/popcornculture1)
- WhatsApp: [+91 84095 36813](https://wa.me/918409536813)
- X: [@pop_corn_cult](https://x.com/pop_corn_cult)

## Next Step

Firebase auth and backend integration can be added next for:

- Real sign-in/sign-up
- Persistent cart storage
- Newsletter data capture
- Order workflow

## License

This project is currently private/internal unless you decide otherwise.
