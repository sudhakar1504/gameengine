# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Next.js dev server
npm run build     # Production build
npm run start     # Start production server
npm run lint      # Run ESLint
npm run export    # Static export to /out directory
```

The app is configured for static export (`output: 'export'` in next.config.ts), so there is no server-side rendering. The output goes to `/out`.

## Architecture

This is a **web-based presentation/game engine editor** — a visual authoring tool (similar to Genially) where users build interactive multi-page presentations with text, images, audio, animations, and interactive effects.

**Stack:** Next.js 16 (App Router) + TypeScript, Redux Toolkit, Ant Design 6, Tailwind CSS 4, react-dnd, react-moveable

### Two Modes
- **Editor** (`/`) — drag/resize/configure elements on a canvas
- **Preview** (`/preview`) — playback mode where interactions trigger effects

### State Management (`/src/store/`)

Four Redux slices; access them all via the `useStoreconfig()` convenience hook in `src/store/index.ts`:

| Slice | Purpose | Key State |
|-------|---------|-----------|
| `allpages` | Pages list and active page | `pages[]`, `selectedPage` |
| `editor` | Elements on current page, selection | `elementsList[]`, `selectedElementId`, `selectedElementIds[]` |
| `interaction` | Active element's interaction config | `elementIndex`, `data` |
| `user` | Auth info | `id`, `name`, `email`, `isAuthenticated` |

Each page in `allpages.pages` has a `data` array of elements. The `editor.elementsList` mirrors the current page's elements for active editing.

### Element Structure

Elements use **percentage-based coordinates** for resolution independence:
```typescript
{
  id: number,
  type: 'text' | 'img' | 'audio' | 'bg',
  coords: { x, y, width, height, angle },  // percentages
  content?: string,        // text content
  src?: string,            // image/audio source
  style?: CSSProperties,
  interaction?: InteractionConfig,
  animation?: AnimationConfig,
}
```

Default configs for all element types are in `src/utils/config/defaults.ts`.

### Component Relationships

```
RootLayout (StoreProvider → DndProvider → AntdRegistry)
└── Home Page (/)
    ├── Topbar          — context-sensitive properties panel (text/image/audio tabs)
    ├── Sidebar         — page list + elements list
    ├── Slideview       — main canvas
    │   └── DraggableBox — per-element wrapper using react-moveable
    │       ├── TextPanel / ImagePanel / AudioPanel
    ├── AnimationDrawer — animation configuration drawer
    └── InteractionModal — configure click interactions per element

Preview Page (/preview)
└── PreviewElement      — renders elements with interaction handlers
    └── Effects/        — Confetti, Fireworks, FloatingIcons, etc.
```

### Interactions & Effects

Interactions are configured per-element via `InteractionModal`. Types: `none`, `audio`, `page` (navigate to page), `link` (external URL), plus optional visual effect.

Available effects (`src/utils/config/effectsList.ts`): Confetti, Fireworks, Applause, Hearts, Balloons, Sad, BrokenHeart, Bubbles, Disagree.

### Animations

Animations configured via `AnimationDrawer` with categories: entrance, continuous, exit, hover, click. Effects include fadeIn, zoom, bounce, rotate, pulse, heartbeat, etc. with configurable direction, duration, delay, easing, and loop count.

### Asset Lists

Static asset catalogs live in `src/utils/config/`: `audioList.ts`, `imageList.ts`, `bgList.ts`, `imageGallery.ts` (large SVG button gallery). These are arrays of paths/metadata used in the editor's asset pickers.
