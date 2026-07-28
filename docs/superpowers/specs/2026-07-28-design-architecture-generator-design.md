# Specification: Design Architecture Generator (UI/UX Blueprint Workspace)

**Date**: 2026-07-28  
**Topic**: Design System and Interactive Wireframe Mockup Workspace

---

## 1. Overview & Architecture

This application is a clone of the "360° Prompt Architecture" project adapted into an interactive UI/UX Design System and Style Guide generator. It connects to the same Supabase database instance, but stores its data in isolated tables prefixed with `design_` to avoid conflicts with the programming blueprint application.

### Key Capabilities
- **AI-Powered Design Specs**: Generates color palettes (with hex codes), brand mood analysis, typography, spacing guides, layout strategies, and key UI components from a single prompt.
- **Drag-and-Drop Section Rearranger**: Reorders the generated sections of the design specification document.
- **Interactive Wireframe Builder**: A visual canvas where users can drag generated, styled components (pre-styled with the AI's generated colors and fonts) to lay out web or mobile mockup screens.

---

## 2. Database Schema

All tables are prefixed with `design_` to live inside the shared Supabase DB safely.

### 2.1 Table: `design_blueprints`
Holds the parent design configuration and AI-generated design decisions (Color Palette, Typography, Brand guidelines).
- `id`: UUID (Primary Key, default Random)
- `requirement`: TEXT (Original prompt)
- `title`: VARCHAR(300)
- `subtitle`: VARCHAR(400)
- `domain_key`: VARCHAR(80)
- `domain_label`: VARCHAR(160)
- `language`: VARCHAR(16)
- `depth`: VARCHAR(16)
- `audience`: VARCHAR(60)
- `target_model`: VARCHAR(60)
- `analysis`: JSONB (Brand tone, adjectives, logo direction)
- `tech_stack`: JSONB (Tailwind configuration, CSS setup, recommended assets)
- `reverse_prompt`: JSONB
- `master_prompt`: TEXT
- `meta_prompt`: TEXT
- `refinements`: JSONB (Array of questions & answers)
- `token_estimate`: INTEGER
- `section_count`: INTEGER
- `version`: INTEGER
- `status`: VARCHAR(24)
- `created_at`: TIMESTAMP WITH TIME ZONE
- `updated_at`: TIMESTAMP WITH TIME ZONE

### 2.2 Table: `design_blueprint_sections`
Stores individual sections of the generated guide (e.g. Spacing grid, buttons details, Micro-interaction scripts) with custom ordering.
- `id`: UUID (Primary Key)
- `blueprint_id`: UUID (FK referencing `design_blueprints.id`)
- `pillar_key`: VARCHAR(60)
- `pillar_label`: VARCHAR(120)
- `pillar_order`: INTEGER (Used for default layout sequence)
- `section_key`: VARCHAR(80)
- `section_order`: INTEGER (Order of section inside pillar)
- `title_th`: VARCHAR(200)
- `title_en`: VARCHAR(200)
- `summary`: TEXT
- `body`: TEXT
- `prompt_snippet`: TEXT
- `checklist`: JSONB
- `anti_patterns`: JSONB
- `token_estimate`: INTEGER

---

## 3. UI/UX Design

The application layout will feature:
1. **Generator Input Form**: Simple user form to input design system requests (e.g., "อยากได้ดีไซน์ระบบ POS ร้านอาหารแนวอบอุ่นสบายตา").
2. **Interactive Workspace**:
   - **Left Sidebar**: Drag-and-drop document outline. Clicking a section scrolls to it; dragging allows reordering of pillars.
   - **Center Panel (Tabs)**:
     - **Tab 1: Design Document**: The generated style guide and brand identity, rendered matching the user's custom reordered layout.
     - **Tab 2: Wireframe Canvas**: The sandbox where pre-styled components (Header, Side nav, buttons, inputs, product cards) matching the generated color palette can be dragged, dropped, resized, and deleted on a gridsheet canvas.

---

## 4. Implementation Steps

1. **Database Setup**: Update `src/db/schema.ts` to use `design_` table prefixes and run migrations/db push.
2. **Mock Generation Engine**: Adapt the generator engine prompts (`src/lib/engine`) to produce style guides and components configuration instead of raw code architecture.
3. **Drag and Drop Engine (Doc Reorder)**: Integrate `react-beautiful-dnd` or light HTML5 Drag/Drop API to handle sorting of pillars.
4. **Wireframe Sandbox UI**: Create the visual grid canvas where components are rendered using dynamic styling loaded from the active blueprint's color palette and styling JSON.
