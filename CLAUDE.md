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

The app is configured for static export (`output: 'export'` in next.config.ts), so there is no server-side rendering. The output goes to `/out`. There are no tests.

## Architecture

This is a **web-based presentation/game engine editor** — a visual authoring tool (similar to Genially) where users build interactive multi-page presentations with text, images, audio, animations, and interactive effects.

**Stack:** Next.js 16 (App Router) + TypeScript, Redux Toolkit, Ant Design 6, Tailwind CSS 4, react-moveable

### Two Modes
- **Editor** (`/`) — drag/resize/configure elements on a canvas
- **Preview** (`/preview`) — playback mode where interactions trigger effects

### State Management (`/src/store/`)

Five Redux slices; access them all via the `useStoreconfig()` convenience hook in `src/store/index.ts`:

| Slice | Purpose | Key State |
|-------|---------|-----------|
| `allpages` | Pages list and active page | `pages[]`, `selectedPage` |
| `editor` | Elements on current page, selection, clipboard | `elementsList[]`, `selectedElementId`, `selectedElementIds[]`, `windowEditMode`, `clipboard` |
| `interaction` | Active element's interaction config | `elementIndex`, `data`, `triggerSelectionMode`, `pendingTriggerElementId` |
| `dragDrop` | Drag-drop game mechanic config | `elementIndex`, `data`, `targetSelectionMode`, `pendingTargetElementId` |
| `user` | Auth info | `id`, `name`, `email`, `isAuthenticated` |

### Critical: allpages ↔ editor Sync

`allpages.pages[i].data` is the persisted store; `editor.elementsList` is the working copy. **They do not auto-sync.** You must manually sync them:

- **Before switching pages:** save `editor.elementsList` back into `allpages.pages[currentIndex].data`, then load the new page's data via `updateEditor()`
- **Before preview/export:** sync current edits to `allpages` first

```typescript
// Pattern used throughout the codebase
const duplicateAllpages = [...allpages.pages];
duplicateAllpages[currentIndex] = { ...duplicateAllpages[currentIndex], data: editor.elementsList };
updateAllPages(duplicateAllpages);
setSelectedPage(newPageId);
updateEditor(duplicateAllpages[newPageIndex].data);
```

### Element Structure

Elements use **percentage-based coordinates** for resolution independence:
```typescript
{
  id: number,
  type: 'text' | 'img' | 'audio' | 'bg',
  coords: { x, y, width, height, angle },  // percentages / degrees
  text?: string,
  src?: string,
  font?: { fontSize, color, fontFamily, fontWeight, fontStyle, textAlign, ... },
  filter?: { opacity, brightness, contrast, saturate, blur },
  transform?: { flipX, flipY },
  audio?: { loop, autoplay, volume },
  interaction?: InteractionConfig,
  animations?: AnimationConfig,
  dragDrop?: DragDropConfig,
}
```

Default configs for all element types are in `src/utils/config/defaults.ts`. Element IDs are generated via `Date.now() + Math.random()`.

### Component Relationships

```
RootLayout (StoreProvider → DndProvider → AntdRegistry)
└── Home Page (/)
    ├── Topbar          — action buttons; shows colored banner in selection modes
    ├── Sidebar         — page list + elements list (drawercomponents/)
    ├── Slideview       — main canvas; handles multi-select rubber-band drawing
    │   └── DraggableBox — per-element wrapper (react-moveable); converts px↔% on drag
    │       └── TextPanel / ImagePanel / AudioPanel
    ├── AnimationDrawer — right-side drawer for per-category animation config + live preview
    ├── InteractionModal — click interaction config; tab-based (none/audio/page/link/effect/triggerAnim/window)
    └── DragDropModal   — drag-drop outcomes (correct/wrong/missed) and action builders

Preview Page (/preview)
└── PreviewElement      — renders elements with runtime interaction + drag-drop handlers
    └── Effects/        — Confetti, Fireworks, FloatingIcons, etc.
```

### Interactions & Effects

Interactions configured via `InteractionModal`. Types: `none`, `audio`, `page`, `link`, `effect`, `triggerAnim` (animate another element), `window` (open popup).

**Trigger/Target Selection Mode:** when user picks a target element for `triggerAnim` or drag-drop, the store sets `triggerSelectionMode`/`targetSelectionMode = true` and `pendingTriggerElementId`/`pendingTargetElementId`. Topbar shows a cancel banner. Clicking an element in this mode completes the selection.

Available effects (`src/utils/config/effectsList.ts`): Confetti, Fireworks, Applause, Hearts, Balloons, Sad, BrokenHeart, Bubbles, Disagree.

### Drag-Drop Game Mechanic

Configured per-element via `DragDropModal`. Each draggable element stores:
```typescript
{
  dropTargetId: string | number | null,
  correctDrop: { actions: DragDropAction[] },
  wrongDrop:   { actions: DragDropAction[] },
  missedDrop:  { actions: DragDropAction[], timeout: number },
}
```
`DragDropAction` types: `audio`, `effect`, `animation`, `go-to-page`, `return-to-origin`, `score`.

### Window Edit Mode (Nested Editor)

Elements with `interaction.type = 'window'` open a popup with its own editable elements. When entering window edit mode:
1. `enterWindowEditMode()` saves current page elements to `editor.windowEditMode.savedElements` and replaces `editor.elementsList` with the window's elements
2. The canvas UI is identical — user edits window elements normally
3. A blue banner at the top of `app/page.tsx` indicates window edit mode
4. `exitWindowEditMode()` restores the page and writes edited `windowElements` back to the parent element's `interaction.windowElements`

### Animations

Configured via `AnimationDrawer` with categories: entrance, continuous, exit, hover, click. Live preview is triggered by writing a timestamp to `animations.previewTrigger` and the category to `animations.previewCategory`.

Animation keyframes are in `src/app/animations.css`. Effects include fadeIn, zoom, bounce, rotate, pulse, heartbeat, slide (with direction), float, etc.

### Copy / Paste / Duplicate

Implemented in `src/store/features/editor/editor.ts`:
- `copyElement(index)` → stores element in `editor.clipboard`
- `pasteElement()` → clones clipboard element with new ID, offsets coords +3% (capped at 90%)
- `duplicateElement(index)` → same offset-clone without using clipboard

### HTML Export

`src/utils/exportHtml.ts` generates a fully self-contained HTML file:
- All pages as `<div class="ge-page" id="page-{id}">`, first page visible
- Percentage coordinates as inline CSS
- Animations as CSS keyframes with embedded `<style>`
- Interactions serialized as `data-interaction` JSON attributes, executed by embedded JS runtime
- Full drag-drop logic, visual effects, window popups, and score HUD embedded as inline `<script>`

`downloadHtml(allpages, filename?)` is the main export entry point called from Topbar.

### Asset Lists

Static asset catalogs live in `src/utils/config/`: `audioList.ts`, `imageList.ts`, `bgList.ts`, `imageGallery.ts` (large SVG button gallery). These are arrays of paths/metadata used in the editor's asset pickers.

### Types

No central types file. Key types are co-located with their slices:
- Element + editor state: `src/store/features/editor/editor.ts`
- Interaction config: `src/store/features/interaction/interaction.ts`
- Drag-drop config: `src/store/features/dragDrop/dragDropSlice.ts`
- Store root types: `src/store/store.ts`
