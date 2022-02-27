const fetch = require('node-fetch');
require('dotenv').config();

class Rentry extends null {
    static async getToken() {
        const response = await fetch(process.env.RENTRY_URL);
        const cookies = Object.fromEntries(response.headers.get('set-cookie')
            .split(';').map(s => s.trim().split('=')));
        return cookies.csrftoken;
    }

    static async upload(text) {
        const csrfmiddlewaretoken = await Rentry.getToken();
        const payload = { csrfmiddlewaretoken, text, url: '', edit_code: '' };
        const body = new URLSearchParams(payload).toString();

        const headers = {};
        headers['Referer'] = process.env.RENTRY_URL;
        headers['Cookie'] = `csrftoken=${csrfmiddlewaretoken}`;
        headers['Content-Type'] = 'application/x-www-form-urlencoded';

        const options = { method: 'POST', body, headers };
        const response = await fetch(process.env.RENTRY_NEW_URL, options);
        const json = await response.json();
        return json.url;
    }
}

module.exports = Rentry;