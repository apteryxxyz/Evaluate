import { inspect } from 'util';
import { codeBlock } from './stringFormatting';

export const cache = new Map<string, string>();
export let token = '';

/**
 * Get the token for the Rentry API
 */
export async function getRentryToken(): Promise<string> {
    if (token) return token;

    const response = await fetch('https://rentry.org');

    // The set cookie header is normally hidden, but we can use inspect and regex to get it
    const headersString = inspect(response.headers);
    const setCookie = headersString.match(/\'set-cookie\' => ['"](.+)['"]/)?.[1];
    if (!setCookie) return '';

    const cookies = Object.fromEntries(setCookie.split(';').map((s) => s.trim().split('=')));
    return (token = cookies.csrftoken);
}

/**
 * Upload a string to Rentry and return the paste bin URL
 * @param text The text to upload to Rentry
 */
export async function uploadToRentry(text: string): Promise<string> {
    // To avoid uploading the same text twice, we cache the results in memory
    const items = Array.from(cache.entries());
    const item = items.find(([, value]) => value === text);
    if (item) return item[0];

    const csrfmiddlewaretoken = await getRentryToken();
    const payload = { csrfmiddlewaretoken, text: codeBlock(text), url: '', edit_code: '' };
    const body = new URLSearchParams(payload).toString();

    const headers = {} as any;
    headers['Referer'] = 'https://rentry.org/';
    headers['Cookie'] = `csrftoken=${csrfmiddlewaretoken}`;
    headers['Content-Type'] = 'application/x-www-form-urlencoded';

    const options = { method: 'POST', body, headers };
    const response = await fetch('https://rentry.org/api/new', options);
    const json = await response.json();
    cache.set(json.url, text);
    return json.url;
}
