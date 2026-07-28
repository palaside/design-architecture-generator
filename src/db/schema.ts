import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * blueprints = one compiled "360° Prompt Architecture" produced from a short
 * human requirement (e.g. "อยากทำระบบ POS ร้านอาหารเล็กๆ").
 */
export const blueprints = pgTable(
  "blueprints",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    requirement: text("requirement").notNull(),
    title: varchar("title", { length: 300 }).notNull(),
    subtitle: varchar("subtitle", { length: 400 }).notNull().default(""),
    domainKey: varchar("domain_key", { length: 80 }).notNull(),
    domainLabel: varchar("domain_label", { length: 160 }).notNull(),
    language: varchar("language", { length: 16 }).notNull().default("th"),
    depth: varchar("depth", { length: 16 }).notNull().default("production"),
    audience: varchar("audience", { length: 60 }).notNull().default("dev_team"),
    targetModel: varchar("target_model", { length: 60 }).notNull().default("generic"),
    analysis: jsonb("analysis").notNull(),
    techStack: jsonb("tech_stack").notNull(),
    reversePrompt: jsonb("reverse_prompt").notNull(),
    masterPrompt: text("master_prompt").notNull(),
    metaPrompt: text("meta_prompt").notNull(),
    refinements: jsonb("refinements").notNull().default([]),
    tokenEstimate: integer("token_estimate").notNull().default(0),
    sectionCount: integer("section_count").notNull().default(0),
    version: integer("version").notNull().default(1),
    status: varchar("status", { length: 24 }).notNull().default("ready"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("blueprints_created_idx").on(table.createdAt)],
);

/** 5 pillars × 6 sections = 30 compiled sections per blueprint. */
export const blueprintSections = pgTable(
  "blueprint_sections",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    blueprintId: uuid("blueprint_id")
      .notNull()
      .references(() => blueprints.id, { onDelete: "cascade" }),
    pillarKey: varchar("pillar_key", { length: 60 }).notNull(),
    pillarLabel: varchar("pillar_label", { length: 120 }).notNull(),
    pillarOrder: integer("pillar_order").notNull(),
    sectionKey: varchar("section_key", { length: 80 }).notNull(),
    sectionOrder: integer("section_order").notNull(),
    titleTh: varchar("title_th", { length: 200 }).notNull(),
    titleEn: varchar("title_en", { length: 200 }).notNull(),
    summary: text("summary").notNull(),
    body: text("body").notNull(),
    promptSnippet: text("prompt_snippet").notNull(),
    checklist: jsonb("checklist").notNull().default([]),
    antiPatterns: jsonb("anti_patterns").notNull().default([]),
    tokenEstimate: integer("token_estimate").notNull().default(0),
  },
  (table) => [index("sections_blueprint_idx").on(table.blueprintId, table.pillarOrder, table.sectionOrder)],
);

/** Observability trace of the compile pipeline (Harness Engineering demo). */
export const runEvents = pgTable(
  "run_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    blueprintId: uuid("blueprint_id")
      .notNull()
      .references(() => blueprints.id, { onDelete: "cascade" }),
    stage: varchar("stage", { length: 80 }).notNull(),
    status: varchar("status", { length: 24 }).notNull().default("ok"),
    message: text("message").notNull().default(""),
    latencyMs: integer("latency_ms").notNull().default(0),
    meta: jsonb("meta").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [index("run_events_blueprint_idx").on(table.blueprintId, table.createdAt)],
);

export type Blueprint = typeof blueprints.$inferSelect;
export type NewBlueprint = typeof blueprints.$inferInsert;
export type BlueprintSection = typeof blueprintSections.$inferSelect;
export type RunEvent = typeof runEvents.$inferSelect;
