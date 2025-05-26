import { ErrorRequestHandler, RequestHandler } from "express";
import multer from "multer";

export class AppError extends Error {
  statusCode: number;
  errors: { field: string; message: string }[];

  constructor(statusCode: number, errors: { field: string; message: string }[]) {
    super(errors.map((e) => e.message).join(", ")); // optional summary
    this.statusCode = statusCode;
    this.errors = errors;

    // Maintains proper stack trace (only in V8 engines)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }
  }

  static BadRequest(field: string, message: string) {
    return new AppError(400, [{ field, message }]);
  }

  static Unauthorized(field: string, message: string) {
    return new AppError(401, [{ field, message }]);
  }

  static Forbidden(field: string, message: string) {
    return new AppError(403, [{ field, message }]);
  }

  static NotFound(field: string, message: string) {
    return new AppError(404, [{ field, message }]);
  }

  static Conflict(field: string, message: string) {
    return new AppError(409, [{ field, message }]);
  }
}

export const endpointNotFoundHandler: RequestHandler = (req, res, next) => {
  const err = new AppError(404, [{ field: "endpoint", message: `Endpoint '${req.originalUrl}' tidak ditemukan` }]);
  next(err);
};

export const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({ errors: err.errors });
  } else if (err instanceof multer.MulterError) {
    res.status(400).json({
      errors: [{ field: err.field, message: err.message }],
    });
  } else if (err instanceof SyntaxError && "body" in err) {
    res.status(400).json({
      errors: [{ field: "body", message: "Request body harus berupa JSON yang valid" }],
    });
  } else {
    console.error(err.stack);
    res.status(500).json({
      errors: [{ field: "server", message: "Terjadi kesalahan di server" }],
    });
  }
};
