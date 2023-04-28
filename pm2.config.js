const script = process.platform === 'win32'
    ? '../../scripts/npm.js' : 'npm';

module.exports = [
    {
        name: 'Evaluate Bot',
        cwd: '.',
        script,
        args: 'start',
        insatnces: 1,
        autorestart: true,
        watch: false,
    }
];
