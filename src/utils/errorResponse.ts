class ErrorResponse extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;

    // Maintaining proper stack trace (only available on V8 engines like Node.js)
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorResponse;
