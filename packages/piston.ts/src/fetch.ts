export async function betterFetch(input: RequestInfo, init?: RequestInit) {
  let attempts = 0;

  while (true) {
    const [error, response] = await fetch(input, init)
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
      if (attempts >= 3)
        throw new Error('Too many requests', { cause: response });

      attempts++;
      const delay = 2 ** attempts * 1000;
      console.warn(
        `Request was rate limited, retrying in ${delay}ms (attempt ${attempts})`,
        { input, init },
      );
      await new Promise((r) => setTimeout(r, delay));
      continue;
    }

    throw new Error('An unknown error occurred', { cause: response });
  }
}
