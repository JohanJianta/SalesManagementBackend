import { z } from "zod";

const ImageHotspotShapeEnum = z.enum(["rectangle", "circle", "polygon"], {
  errorMap: () => ({
    message: "Shape harus salah satu dari: rectangle, circle, polygon",
  }),
});

const PointSchema = z.object({
  x: z.number({ required_error: "Nilai x diperlukan", invalid_type_error: "Nilai x harus berupa angka" }),
  y: z.number({ required_error: "Nilai y diperlukan", invalid_type_error: "Nilai y harus berupa angka" }),
});

const ImageHotspotSchema = z
  .object({
    shape: ImageHotspotShapeEnum,
    points: z.array(PointSchema),
    radius: z.number().nullable(),
  })
  .superRefine((val, ctx) => {
    const pointCount = val.points.length;

    if (val.shape === "circle") {
      if (val.radius === null || val.radius === 0) {
        ctx.addIssue({
          path: ["radius"],
          code: z.ZodIssueCode.custom,
          message: "Radius diperlukan untuk shape 'circle'",
        });
      }
      if (pointCount !== 1) {
        ctx.addIssue({
          path: ["points"],
          code: z.ZodIssueCode.custom,
          message: "Shape 'circle' harus memiliki 1 point",
        });
      }
    }

    if (val.shape === "rectangle") {
      if (pointCount !== 2) {
        ctx.addIssue({
          path: ["points"],
          code: z.ZodIssueCode.custom,
          message: "Shape 'rectangle' harus memiliki 2 point",
        });
      }
      val.radius = null;
    }

    if (val.shape === "polygon") {
      if (pointCount < 3) {
        ctx.addIssue({
          path: ["points"],
          code: z.ZodIssueCode.custom,
          message: "Shape 'polygon' harus memiliki minimum 3 point",
        });
      }
      val.radius = null;
    }
  });

export const AddClusterSchema = z.object({
  name: z.string({ required_error: "Name diperlukan", invalid_type_error: "Name harus berupa string" }).trim(),
  category: z.enum(["residential", "commercial"], {
    errorMap: () => ({
      message: "Category harus salah satu dari: residential, commercial",
    }),
  }),
  brochure_url: z
    .string({ invalid_type_error: "Brochure url harus berupa string" })
    .trim()
    .min(1, { message: "Brochure url tidak boleh kosong" })
    .optional(),
  address: z.string({ required_error: "Address diperlukan", invalid_type_error: "Address harus berupa string" }).trim(),
  is_apartment: z.boolean({
    invalid_type_error: "Is apartment diperlukan dan harus berupa boolean",
  }),
  image_hotspots: z.array(ImageHotspotSchema).min(1, { message: "Minimal satu image hotspot diperlukan" }),
});
