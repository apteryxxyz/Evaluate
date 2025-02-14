export class HttpError extends Error {
  status: number;

  constructor(response: Response, message: string) {
    super(message);
    this.status = response.status;
    if (Error.captureStackTrace) Error.captureStackTrace(this, HttpError);
  }
}

export class TooManyRequestsError extends HttpError {
  constructor(response: Response, message = response.statusText) {
    if (response.status !== 429) throw new Error('Not a 429 response');
    super(response, message);
  }
}
