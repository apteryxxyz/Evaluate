const script = process.platform === 'win32'
    ? '../../scripts/npm.js' : 'npm';

module.exports = [
    {
        name: 'Evaluate',
        cwd: '.',
        script,
        args: 'start',
        insatnces: 1,
        autorestart: true,
        watch: false,
    }
];
