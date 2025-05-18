import { Request, Response, NextFunction } from "express";

class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
  }
}

const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error(`🔥 Error: ${message}`);

  res.status(statusCode).json({
    success: false,
    message,
  });
};

export { ApiError, errorHandler };
