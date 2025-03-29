import { HttpError, TooManyRequestsError } from './http-error.js';

export async function betterFetch(url: RequestInfo, options?: RequestInit) {
  let attempts = 0;

  while (true) {
    const [error, response] = await fetch(url, options)
      .then((response) => [null, response] as const)
      .catch((error: Error) => [error, null] as const);

    if (error) {
      console.error(error);
      throw new Error('An unknown error occurred', { cause: error });
    }

    if (response.ok) {
      return response as Response & { ok: true };
    }

    if (response.status === 429) {
      if (attempts >= 5)
        throw new TooManyRequestsError(response, 'Too many requests');

      attempts++;
      const delay = 2 ** attempts * 1000;
      console.warn(
        `Request to ${url} was rate limited, retrying in ${delay}ms (attempt ${attempts})`,
      );
      await new Promise((resolve) => setTimeout(resolve, delay));
      continue;
    }

    throw new HttpError(
      response, //
      'An unknown error occurred',
      { cause: error },
    );
  }
}
