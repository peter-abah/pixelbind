import * as z from "zod";

export const pdfOptionsSchema = z.object({
  size: z.enum(["a4", "letter", "fit", "legal", "a3"]),
  margin: z.enum(["none", "small", "normal", "large"]),
  orientation: z.enum(["portrait", "landscape"]),
  filename: z.string().trim(),
  compress: z.boolean(),
});

export type PDFOptionsSchema = z.infer<typeof pdfOptionsSchema>;
export type PDFOptions = PDFOptionsSchema;
