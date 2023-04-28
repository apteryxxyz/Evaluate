import { Buffer } from 'node:buffer';
import { setTimeout } from 'node:timers';
import { URL, URLSearchParams } from 'node:url';
import { container } from 'maclary';
import type { Browser } from 'puppeteer';
import puppeteer from 'puppeteer';
import type { Executor } from './Executor';

export class Capture {
    private _browser!: Browser;
    private _cache = new Map<string, string | Buffer>();

    public constructor() {
        (async () => {
            this._browser = await puppeteer.launch({ headless: 'new' });
        })();
    }

    public async createCapture(options: Capture.CreateOptions) {
        const params = new URLSearchParams();
        params.append('title', 'Evaluate');
        params.append('padding', '32');
        params.append('theme', options.theme ?? Capture.Theme.Meadow);
        params.append('darkMode', String(options.mode === Capture.Mode.Dark));
        if (options.language) params.append('language', options.language.id);
        params.append('code', Buffer.from(options.code).toString('base64'));

        const url = new URL('https://ray.so/');
        url.hash = params.toString();

        const cached = this._cache.get(url.hash);
        if (cached) return cached;

        await Capture.waitFor();

        const page = await this._browser.newPage();
        await page.goto(url.toString(), { waitUntil: 'networkidle0' });

        const element = await page.$('div[style*="width: auto;"]');
        if (!element) throw new Error('Could not find code element');

        // Remove the resize handles and controls
        await page.evaluate(() => {
            const controls = document.querySelector('div[class*="Controls"]');
            if (controls) controls.remove();

            for (const element of Array.from(
                document.querySelectorAll('div[class*="windowSizeDragPoint"]')
            ))
                element?.remove();
        });

        const screenshot = await element.screenshot();
        await page.close();

        this._cache.set(url.hash, screenshot);
        return screenshot;
    }

    public resolveTheme(theme: unknown) {
        switch (String(theme).toLowerCase()) {
            case 'breeze':
                return Capture.Theme.Breeze;
            case 'candy':
                return Capture.Theme.Candy;
            case 'crimson':
                return Capture.Theme.Crimson;
            case 'falcon':
                return Capture.Theme.Falcon;
            case 'midnight':
                return Capture.Theme.Midnight;
            case 'raindrop':
                return Capture.Theme.Raindrop;
            case 'sunset':
                return Capture.Theme.Sunset;
            default:
                return Capture.Theme.Meadow;
        }
    }

    public resolveMode(mode: unknown) {
        switch (String(mode).toLowerCase()) {
            case 'dark':
                return Capture.Mode.Dark;
            default:
                return Capture.Mode.Light;
        }
    }

    public static async waitFor() {
        if (!container.capture) container.capture = new Capture();

        while (!container.capture._browser) {
            await new Promise(resolve => setTimeout(resolve, 500));
        }

        return container.capture;
    }
}

export namespace Capture {
    export interface CreateOptions {
        theme?: Theme;
        language?: Executor.Language;
        code: string;
        mode?: Mode;
    }

    export enum Theme {
        Breeze = 'breeze',
        Candy = 'candy',
        Crimson = 'crimson',
        Falcon = 'falcon',
        Meadow = 'meadow',
        Midnight = 'midnight',
        Raindrop = 'raindrop',
        Sunset = 'sunset',
    }

    export enum Mode {
        Light = 'light',
        Dark = 'dark',
    }
}
