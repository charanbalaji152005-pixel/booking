# Camping & Kayaking 3D Tilt Experience

An exact, pixel-accurate React + Vite recreation of the outdoor adventure booking website shown in the reference video screen recording 

## Features & Implementation

1. **Exact Website Layout & Colors**:
   - Deep midnight navy background with centered dual-card stage layout.
   - Top segmented pill switcher (`KAYAKING` | `CAMPING`) with cream active pill and smooth selection transitions.
   - Main 3D Experience Card (Tara, Serbia / Drina, Serbia) with photographic backdrops and misty gradient blend.
   - Right Booking Details panel with live pricing rows, booking status indicators (`Not Booked` / `✓ 30 Sept 2026`), and interactive `Total Payable` calculation.
   - Exact price typography matching the reference video's `style.css` (`.price-main`, `.price-amount`, `.price-separator`, `.price-unit`).

2. **Transparent PNG Assets & Hover Breakout Animations**:
   - **Camping**:
     - `tent.png`: 3D dome tent that rotates -16°, scales 1.24x, and translates outside the top-left boundary of the card on hover.
     - `pine-branch.png`: Evergreen fir branch that bursts out of the top-right card corner on hover (+22° rotation).
     - `mossy-rock.png`: 3D moss-covered boulder floating over the bottom-right corner with independent depth translation and drop-shadows.
   - **Kayaking**:
     - `kayak.png`: Sleek yellow sea kayak with paddle across the cockpit, oriented matching the video, scaling 1.2x and shooting towards the top-left on hover.
     - `water-splash.png`: Crystal water spray with flying droplets bursting out of the top-right corner on hover.
     - `pebbles.png`: River pebbles pile floating at the bottom-right with 3D translation.

3. **Real 3D Tilt Effect**:
   - Built using CSS `perspective: 1000px`, `transform-style: preserve-3d`, and React mouse tracking.
   - Dynamic cursor-following `rotateX()` and `rotateY()` mapped across the card surface.
   - Smooth reset to `(0, 0)` with ease-out transition on pointer leave.
   - Multi-layer `translateZ()` depth layering separating background texture, fog blend, hero PNGs, card body, and corner floating props.

4. **Interactive Booking Flow & Modal**:
   - Clicking "Choose Date", "Manage Booking", or "Edit" opens the modal dialog.
   - Modal features activity badge (`⛺ CAMPING` / `⛵ KAYAKING`), quick-pick pills (`Tomorrow`, `This Saturday`, `In 1 Week`), custom date display, and "Confirm Booking" CTA.
   - Accessible keyboard support (`Escape` key closes), backdrop click-to-dismiss, and animated entry/exit.
   - State synchronizes seamlessly between the main card and the right booking summary panel.

## Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Development
```bash
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

### Production Build
```bash
npm run build
npm run preview
```

### Deploy to GitHub Pages
```bash
npm run deploy
```
Live URL: [https://charanbalaji152005-pixel.github.io/booking/](https://charanbalaji152005-pixel.github.io/booking/)


## Project Structure
```text
web/
├── index.html
├── package.json
├── README.md
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── styles.css
│   ├── components/
│   │   ├── TiltCard.jsx
│   │   ├── ExperienceCard.jsx
│   │   ├── BookingDetails.jsx
│   │   └── BookingModal.jsx
│   └── assets/
│       ├── tent.png
│       ├── kayak.png
│       ├── pine-branch.png
│       ├── water-splash.png
│       ├── mossy-rock.png
│       ├── pebbles.png
│       ├── grass-bg.jpg
│       └── water-bg.jpg
```

