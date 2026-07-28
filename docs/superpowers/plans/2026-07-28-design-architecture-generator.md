# Design Architecture Generator Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal**: Transform the cloned workspace into a UI/UX Design System and Style Guide generator with drag-and-drop document sections and an interactive wireframe mockup canvas.

**Architecture**: 
- Reuses Next.js and Drizzle ORM configured with Table Prefixes (`design_`) to connect to the existing Supabase instance.
- Prompts inside the Engine are rewritten to generate Design Blueprints (Colors, Typography, Layout grids, Component Specs, UX Patterns).
- HTML5 Drag and Drop API or a lightweight utility is used to handle reordering of sections and dragging design components onto a wireframe canvas grid.

**Tech Stack**: Next.js (App Router), Tailwind CSS, Drizzle ORM, Postgres (Supabase).

## Global Constraints
- Database tables must be prefixed with `design_`.
- Code changes must be fully typed (TypeScript).

---

### Task 1: Rename DB Tables & Sync Schema

**Files**:
- Modify: `src/db/schema.ts`
- Modify: `drizzle.config.ts`

**Interfaces**:
- Consumes: Existing DB configuration
- Produces: Synced database tables (`design_blueprints`, `design_blueprint_sections`, `design_run_events`)

- [ ] **Step 1: Modify `src/db/schema.ts` to add `design_` table prefixes**

Update table names:
```typescript
export const blueprints = pgTable("design_blueprints", { ... });
export const blueprintSections = pgTable("design_blueprint_sections", { ... });
export const runEvents = pgTable("design_run_events", { ... });
```

- [ ] **Step 2: Verify code compiling and check schema types**

Run: `npm run typecheck`
Expected: Successful compile.

- [ ] **Step 3: Push the updated schema to Supabase**

Run: `npx drizzle-kit push`
Expected: Database changes applied with table prefix `design_` added successfully.

- [ ] **Step 4: Commit changes**

```bash
git add src/db/schema.ts
git commit -m "feat: add design_ prefix to database tables"
```

---

### Task 2: Adapt Design Generation Prompts & Types

**Files**:
- Modify: `src/lib/types.ts`
- Modify: `src/lib/engine/analyze.ts`
- Modify: `src/lib/engine/sections.ts`

**Interfaces**:
- Consumes: User design requirements
- Produces: Design System blueprint sections (Brand tone, Colors, Spacing, Typography, Components)

- [ ] **Step 1: Update type definitions in `src/lib/types.ts`**

Adjust `Analysis` and `TechStack` interfaces to represent Brand mood, color palettes, and typography tokens.

- [ ] **Step 2: Update AI prompts in `src/lib/engine/analyze.ts` and `sections.ts`**

Rewrite prompt instructions to focus on UI/UX attributes (Brand voice, hex codes, visual language, UI components) instead of engineering stack details.

- [ ] **Step 3: Verify typescript compilation**

Run: `npm run typecheck`
Expected: PASS

- [ ] **Step 4: Commit changes**

```bash
git add src/lib/types.ts src/lib/engine/
git commit -m "feat: update engine prompts for design blueprints"
```

---

### Task 3: Implement Drag-and-Drop Document Sections

**Files**:
- Modify: `src/components/BlueprintView.tsx`

**Interfaces**:
- Consumes: Generated design sections list
- Produces: Rearranged sections outline and drag-and-drop handles

- [ ] **Step 1: Integrate Drag-and-Drop list logic in `src/components/BlueprintView.tsx`**

Implement HTML5 Drag-and-Drop handles on the Pillar menu list allowing users to drag and drop rows to reorder the layout outline.

- [ ] **Step 2: Bind order updates to local state**

Store Custom ordering list state in React state and re-render document layout sequentially based on user's custom sort order.

- [ ] **Step 3: Commit changes**

```bash
git add src/components/BlueprintView.tsx
git commit -m "feat: add drag-and-drop document sections rearranger"
```

---

### Task 4: Implement Interactive Wireframe Canvas

**Files**:
- Modify: `src/components/BlueprintView.tsx`
- Create: `src/components/WireframeCanvas.tsx`

**Interfaces**:
- Consumes: Color Palette & UI Component specs from Blueprint data
- Produces: Interactive sandbox editor canvas with draggable pre-styled components

- [ ] **Step 1: Create `src/components/WireframeCanvas.tsx`**

Scaffold a component representing a layout sheet/grid where users can drag components (Primary Button, Input Field, Card, Header) from a toolkit panel and position them freely using coordinate states.

- [ ] **Step 2: Render style tokens dynamically**

Inject generated brand colors (Hex codes) and typography guidelines directly into the component toolbox preview styling.

- [ ] **Step 3: Import Canvas into main workspace tabs**

Add a tab switch in `src/components/BlueprintView.tsx` to toggle between the style guide document and the interactive wireframe canvas.

- [ ] **Step 4: Verify Next.js project builds cleanly**

Run: `npm run build`
Expected: SUCCESS

- [ ] **Step 5: Commit changes**

```bash
git add src/components/WireframeCanvas.tsx src/components/BlueprintView.tsx
git commit -m "feat: implement interactive wireframe canvas sandbox"
```
