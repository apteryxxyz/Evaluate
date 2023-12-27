# @evaluate/capture

This package exports a single function, `generateCodeImage`, it takes a string of source code and returns a promise that resolves to a buffer containing a PNG image of the source code. Under the hood it actually generates multiple images using multiple different services, if the preferred service fails (due to Vercel timeout) it will use the backup which is quickly to generate.
