import { Buffer } from 'node:buffer';
import { setTimeout } from 'node:timers';
import { URL, URLSearchParams } from 'node:url';
import { container } from 'maclary';
import type { Browser } from 'puppeteer';
import puppeteer from 'puppeteer';
import { Database } from './Database';
import type { Executor } from './Executor';
import { Statistics } from '&entities/Statistics';

/** Render code snippets to images. */
export class Renderer {
    private _browser?: Browser;
    private _cache = new Map<string, string | Buffer>();

    public constructor() {
        (async () => {
            this._browser = await puppeteer.launch({ headless: 'new' });
        })();
    }

    /** Create a new render of a code snippet. */
    public async createRender(
        options: Renderer.CreateOptions,
        userId?: string
    ) {
        const hash = this._createHash(options);

        if (typeof userId === 'string') {
            void Database.waitFor().then(database => {
                const repository = database.repository(Statistics);
                void repository.incrementCaptureCount(userId);
            });
        }

        // Check if we have a cached version of this render
        const existing = this._cache.get(hash);
        if (existing) return existing;

        const url = new URL('https://ray.so/');
        url.hash = hash;

        // Ensure the browser is ready
        await Renderer.waitFor();

        const page = await this._browser!.newPage();
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

        // Cache it so we don't have to render it again
        this._cache.set(url.hash, screenshot);
        return screenshot;
    }

    private _createHash(options: Renderer.CreateOptions) {
        const params = new URLSearchParams();
        params.append('title', 'Evaluate');
        params.append('padding', '32');
        params.append('theme', options.theme ?? Renderer.Theme.Meadow);
        params.append('darkMode', String(options.mode === Renderer.Mode.Dark));
        if (options.language) params.append('language', options.language.id);
        params.append('code', Buffer.from(options.code).toString('base64'));
        return params.toString();
    }

    /** Resolves the input into a theme, default is the green meadow. */
    public resolveTheme(theme: unknown) {
        switch (String(theme).toLowerCase()) {
            case 'breeze':
                return Renderer.Theme.Breeze;
            case 'candy':
                return Renderer.Theme.Candy;
            case 'crimson':
                return Renderer.Theme.Crimson;
            case 'falcon':
                return Renderer.Theme.Falcon;
            case 'midnight':
                return Renderer.Theme.Midnight;
            case 'raindrop':
                return Renderer.Theme.Raindrop;
            case 'sunset':
                return Renderer.Theme.Sunset;
            default:
                return Renderer.Theme.Meadow;
        }
    }

    /** Resolves the input into a mode, default is dark mode. */
    public resolveMode(mode: unknown) {
        switch (String(mode).toLowerCase()) {
            case 'dark':
                return Renderer.Mode.Dark;
            default:
                return Renderer.Mode.Light;
        }
    }

    /** Ensure the renderer has been initialise. */
    public static async waitFor() {
        if (!container.renderer) container.renderer = new Renderer();

        while (!container.renderer._browser)
            await new Promise(resolve => setTimeout(resolve, 100));
        return container.renderer;
    }
}

export namespace Renderer {
    export interface CreateOptions {
        /** Force language syntax. */
        language?: Executor.Language;
        /** Code to appear in the image. */
        code: string;
        /** Theme to make the image. */
        theme?: Theme;
        /** Theme mode to make the image. */
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

declare module 'maclary' {
    export interface Container {
        renderer: Renderer;
    }
}
