/**
 * Represents an error that occurred while making an HTTP request.
 */
export class HttpError extends Error {
  status: number;

  constructor(
    response: Response,
    message = response.statusText,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.status = response.status;
    if (Error.captureStackTrace) Error.captureStackTrace(this, HttpError);
  }
}

/**
 * Represents an error that occurred while making an HTTP request due to rate limiting.
 */
export class TooManyRequestsError extends HttpError {
  constructor(
    response: Response,
    message = response.statusText,
    options?: ErrorOptions,
  ) {
    if (response.status !== 429) throw new Error('Not a 429 response');
    super(response, message, options);
  }
}
