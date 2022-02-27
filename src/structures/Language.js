const fetch = require('node-fetch');
const FormData = require('form-data');

class Language {
    constructor({ language, version, aliases, runtime }) {
        this.name = language;
        this.version = version;
        this.aliases = aliases;
        this.runtime = runtime;
    }

    // /run <language> <code>
    async execute({ input = '', files = [], args = [], stdin = '' }) {
        const url = process.env.PISTON_EXECUTE_URL;
        const body = JSON.stringify({
            language: this.name,
            version: this.version,
            files: [
                { content: input },
                ...files,
            ],
            args,
            stdin,
        });

        const options = { method: 'POST', body, headers: { 'Content-Type': 'application/json' } };
        const result = await fetch(url, options).then(res => res.json());

        if (result.message) return {
            success: false,
            error: {
                type: 'http',
                message: result.message,
            },
            input: JSON.parse(body),
        };
        if (result.run.code === 1) return {
            success: false,
            error: {
                type: 'runtime',
                message: result.run.output,
            },
            input: JSON.parse(body),
        };
        return {
            success: true,
            data: result.run,
            input: JSON.parse(body),
        }
    }
}

module.exports = Language;