import { AppError } from "./app_error";
import { ZodSchema } from "zod";

export function validateRequestBody<T>(reqBody: any, schema: ZodSchema): T {
  const parsed = schema.safeParse(reqBody);
  if (!parsed.success) {
    const errors = parsed.error.errors.map((err) => ({
      field: err.path.join("."),
      message: err.message,
    }));
    throw new AppError(400, errors);
  }
  return parsed.data;
}

export function getSingleFile(files: Express.Multer.File[], field: string): Express.Multer.File | null {
  const matchingFiles = files.filter((f) => f.fieldname === field);
  if (matchingFiles.length === 0) {
    // throw AppError.BadRequest(field, `File ${field} diperlukan`);
    return null;
  } else if (matchingFiles.length > 1) {
    throw AppError.BadRequest(field, `Hanya satu file yang diperbolehkan untuk ${field}`);
  }
  return matchingFiles[0];
}
