import { pgTable, text, serial, integer, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const mainCategoriesTable = pgTable("main_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  imageUrl: text("image_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const subCategoriesTable = pgTable("sub_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  imageUrl: text("image_url"),
  mainCategoryId: integer("main_category_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const childCategoriesTable = pgTable("child_categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  imageUrl: text("image_url"),
  subCategoryId: integer("sub_category_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertMainCategorySchema = createInsertSchema(mainCategoriesTable).omit({ id: true, createdAt: true });
export const insertSubCategorySchema = createInsertSchema(subCategoriesTable).omit({ id: true, createdAt: true });
export const insertChildCategorySchema = createInsertSchema(childCategoriesTable).omit({ id: true, createdAt: true });

export type InsertMainCategory = z.infer<typeof insertMainCategorySchema>;
export type InsertSubCategory = z.infer<typeof insertSubCategorySchema>;
export type InsertChildCategory = z.infer<typeof insertChildCategorySchema>;
export type MainCategory = typeof mainCategoriesTable.$inferSelect;
export type SubCategory = typeof subCategoriesTable.$inferSelect;
export type ChildCategory = typeof childCategoriesTable.$inferSelect;

export const categoriesTable = mainCategoriesTable;
export const insertCategorySchema = insertMainCategorySchema;
export type InsertCategory = InsertMainCategory;
export type Category = MainCategory;