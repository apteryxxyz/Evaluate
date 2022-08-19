module.exports = Object.assign(require('apteryx-prettier-config'), {
    overrides: [
        {
            files: ['*.yml'],
            options: {
                tabWidth: 2,
            }
        }
    ],
});
