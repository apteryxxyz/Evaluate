import { Buffer } from 'node:buffer';
import { setTimeout } from 'node:timers';
import { URL, URLSearchParams } from 'node:url';
import { LRUCache } from 'lru-cache';
import { container } from 'maclary';
import type { Browser } from 'puppeteer';
import puppeteer from 'puppeteer';
import { Guild as DatabaseGuild } from '&entities/Guild';
import { User as DatabaseUser } from '&entities/User';

/** Render code snippets to images. */
export class Renderer {
    private _browser?: Browser;
    private _cache = new LRUCache({
        max: 100,
        maxSize: 1_024 * 1_024 * 10,
        sizeCalculation: (value: Buffer | string) => value.length,
    });

    public constructor() {
        (async () => {
            this._browser = await puppeteer.launch({
                headless: 'new',
                defaultViewport: {
                    width: 1_920,
                    height: 1_080,
                },
                args: ['--start-maximized'],
            });
        })();
    }

    /** Create a new render of a code snippet. */
    public async createRender(
        options: Renderer.CreateOptions,
        userId?: string,
        guildId?: string
    ) {
        const hash = this._createHash(options);
        void this._bumpStatistics(userId, guildId);

        // Check if we have a cached version of this render
        const existing = this._cache.get(hash);
        if (existing) return existing;

        const url = new URL('https://ray.so/');
        const theme = this.resolveTheme(options.theme);
        url.hash = hash;

        // Ensure the browser is ready
        await Renderer.waitFor();

        const page = await this._browser!.newPage();
        await page.goto(url.toString(), { waitUntil: 'networkidle0' });

        const element = await page.$('div[style*="width: auto;"]');
        if (!element) throw new Error('Could not find code element');

        // Modify the pages contents
        await page.evaluate(this._modifyPage, theme);

        const screenshot = await element.screenshot();
        await page.close();

        // Cache it so we don't have to render it again
        this._cache.set(url.hash, screenshot);
        return screenshot;
    }

    private async _bumpStatistics(userId?: string, guildId?: string) {
        const database = container.database;
        const userRepository = database.repository(DatabaseUser);
        const guildRepository = database.repository(DatabaseGuild);

        const [ourUser, ourGuild] = await Promise.all([
            userId ? userRepository.ensure(userId) : null,
            guildId ? guildRepository.ensure(guildId) : null,
        ]);

        // Bump the evaluation count
        if (ourUser) ourUser.captureCount++;
        if (ourGuild) ourGuild.captureCount++;

        // Save our entities
        await Promise.all([ourUser?.save(), ourGuild?.save()]);
    }

    private _createHash(options: Renderer.CreateOptions) {
        const params = new URLSearchParams();
        params.append('padding', '32');
        params.append('_theme', options.theme ?? Renderer.Theme.Green);
        params.append('darkMode', String(options.mode === Renderer.Mode.Dark));
        params.append('code', Buffer.from(options.code).toString('base64'));
        return params.toString();
    }

    private _modifyPage(theme: string) {
        const classes = {
            frame: '[class*="Frame_frame_"]',
            header: '[class*="Frame_header_"]',
            window: '[class*="Frame_window_"]',
            textarea: '[class*="Editor_textarea_"]',
            dragPoint: '[class*="ResizableFrame_windowSizeDragPoint_"]',
            controls: '[class*="Controls_controls_"]',
        };

        const frame = document.querySelector<HTMLElement>(classes.frame);
        if (frame) {
            // Keep the frame at a responsive width
            frame.style.minWidth = 'unset';
            frame.style.maxWidth = '100vw';
            frame.style.minHeight = 'unset';
            frame.style.maxHeight = '100vh';

            // Change the background to a gradient theme
            const style = frame.getAttribute('style') ?? '';
            frame.setAttribute(
                'style',
                `${style} background-image: linear-gradient(140deg, ${theme});`
            );
        }

        // Remove the header
        const header = document.querySelector<HTMLElement>(classes.header);
        if (header) header.remove();

        // Remove the window padding
        const window = document.querySelector<HTMLElement>(classes.window);
        if (window) {
            window.style.paddingTop = 'unset';
            window.style.minHeight = 'unset';
        }

        // Decrease the height of the editor
        const textarea = document.querySelector<HTMLElement>(classes.textarea);
        if (textarea) {
            textarea.style.overflow = 'hidden';
            textarea.style.height = 'auto';
        }

        // Remove the drag points
        const points = document.querySelectorAll(classes.dragPoint);
        for (const point of Array.from(points)) point?.remove();

        // Remove the controls
        const controls = document.querySelector(classes.controls);
        if (controls) controls.remove();
    }

    /** Resolves the input into a theme, default is the green meadow. */
    public resolveTheme(theme: unknown) {
        switch (String(theme).toLowerCase()) {
            case Renderer.Theme.Red:
                return 'rgb(238, 82, 83), rgb(205, 41, 52)';
            case Renderer.Theme.Orange:
                return 'rgb(255, 183, 77), rgb(218, 131, 13)';
            case Renderer.Theme.Peach:
                return 'rgb(255, 186, 173), rgb(255, 146, 119)';
            case Renderer.Theme.Yellow:
                return 'rgb(255, 218, 117), rgb(218, 165, 32)';
            default:
                return 'rgb(47, 192, 134), rgb(20, 105, 76)'; // Green
            case Renderer.Theme.Teal:
                return 'rgb(82, 194, 191), rgb(41, 117, 115)';
            case Renderer.Theme.Blue:
                return 'rgb(87, 137, 219), rgb(59, 96, 146)';
            case Renderer.Theme.Purple:
                return 'rgb(160, 94, 183), rgb(110, 53, 142)';
            case Renderer.Theme.Pink:
                return 'rgb(255, 153, 204), rgb(255, 51, 153)';
            case Renderer.Theme.White:
                return 'rgb(255, 255, 255), rgb(255, 255, 255)';
            case Renderer.Theme.Grey:
                return 'rgb(214, 214, 214), rgb(128, 128, 128)';
            case Renderer.Theme.Black:
                return 'rgb(51, 51, 51), rgb(0, 0, 0)';
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
        /** Code to appear in the image. */
        code: string;
        /** Theme to make the image. */
        theme?: Theme;
        /** Theme mode to make the image. */
        mode?: Mode;
    }

    export enum Theme {
        Red = 'red',
        Orange = 'orange',
        Peach = 'peach',
        Yellow = 'yellow',
        Green = 'green',
        Teal = 'teal',
        Blue = 'blue',
        Purple = 'purple',
        Pink = 'pink',
        Grey = 'grey',
        Black = 'black',
        White = 'white',
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
