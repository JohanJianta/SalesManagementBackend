export class AppError extends Error {
  statusCode: number;
  errors: { field: string; message: string }[];

  constructor(
    statusCode: number,
    errors: { field: string; message: string }[]
  ) {
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

  static NotFound(field: string, message: string) {
    return new AppError(404, [{ field, message }]);
  }

  static Conflict(field: string, message: string) {
    return new AppError(409, [{ field, message }]);
  }
}
