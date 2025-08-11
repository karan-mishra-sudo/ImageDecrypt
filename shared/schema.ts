import { pgTable, text, varchar, integer } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const decryptionRequests = pgTable("decryption_requests", {
  id: varchar("id").primaryKey(),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size").notNull(),
  imageKey: text("image_key").notNull(),
  clientKeySuffix: text("client_key_suffix").notNull(),
  decryptedImagePath: text("decrypted_image_path"),
  status: text("status").notNull().default("pending"), // pending, success, failed
  errorMessage: text("error_message"),
  width: integer("width"),
  height: integer("height"),
  format: text("format"),
});

export const insertDecryptionRequestSchema = createInsertSchema(decryptionRequests).omit({
  id: true,
});

export const decryptionConfigSchema = z.object({
  imageKey: z.string().min(1, "Image key is required"),
  clientKeySuffix: z.string().min(1, "Client key suffix is required"),
});

export type InsertDecryptionRequest = z.infer<typeof insertDecryptionRequestSchema>;
export type DecryptionRequest = typeof decryptionRequests.$inferSelect;
export type DecryptionConfig = z.infer<typeof decryptionConfigSchema>;
