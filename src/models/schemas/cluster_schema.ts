import { z } from "zod";

const ImageHotspotSchema = z
  .object({
    shape: z.enum(["rectangle", "circle"], {
      errorMap: () => ({
        message: "Shape harus salah satu dari: rectangle, circle",
      }),
    }),
    x: z.number({ required_error: "Clickable area X diperlukan" }),
    y: z.number({ required_error: "Clickable area y diperlukan" }),
    width: z.number().optional(),
    height: z.number().optional(),
    radius: z.number().optional(),
  })
  .superRefine((val, ctx) => {
    if (val.shape === "circle" && val.radius === undefined) {
      ctx.addIssue({
        path: ["radius"],
        code: z.ZodIssueCode.custom,
        message: "Radius diperlukan untuk shape 'circle'",
      });
    }

    if (val.shape === "rectangle") {
      if (val.width === undefined) {
        ctx.addIssue({
          path: ["width"],
          code: z.ZodIssueCode.custom,
          message: "Width diperlukan untuk shape 'rectangle'",
        });
      }
      if (val.height === undefined) {
        ctx.addIssue({
          path: ["height"],
          code: z.ZodIssueCode.custom,
          message: "Height diperlukan untuk shape 'rectangle'",
        });
      }
    }
  });

export const AddClusterSchema = z.object({
  name: z.string({ required_error: "Name diperlukan" }).trim(),
  category: z.enum(["residential", "commercial"], {
    errorMap: () => ({
      message: "Category harus salah satu dari: residential, commercial",
    }),
  }),
  address: z.string({ required_error: "Address diperlukan" }).trim(),
  is_apartment: z.boolean(),
  image_hotspots: z.array(ImageHotspotSchema).min(1, { message: "Minimal satu image hotspot diperlukan" }),
});
