import { Renderer } from '&services/Renderer';

interface Feature<T> {
    readonly name: string;
    readonly description: string;
    readonly explained: string;
    readonly free: T;
    readonly premium: T;
    determine(hasPremium: boolean): T;
}

function createFeature<T>(feature: Omit<Feature<T>, 'determine'>): Feature<T> {
    return {
        ...feature,
        determine: hasPremium => (hasPremium ? feature.premium : feature.free),
    };
}

export default {
    identify: {
        ai: createFeature({
            name: 'Improved Language Detection',
            description:
                'An improved method of language detection with better accuracy.',
            explained:
                "Premium users have access to OpenAI's ChatGPT for language detection, which costs us money to access.",
            free: false,
            premium: true,
        }),
    },

    capture: {
        themes: createFeature({
            name: 'More Capture Themes',
            description:
                'Access to a wide range of themes for your code captures.',
            explained:
                'Rendering captures use a lot of resources on our server and can reduce performance of other features.',
            free: Object.entries({
                Meadow: Renderer.Theme.Meadow,
            }),
            premium: Object.entries(Renderer.Theme),
        }),
    },
};
