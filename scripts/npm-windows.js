// This file is used to run npm commands in PM2 on Windows
const { exec } = require("node:child_process");
const { promisify } = require("node:util");

void main(process.argv.length, process.argv);
async function main(_, [_0, _1, ...args]) {
    const command = `npm ${args.join(" ")}`;
    await promisify(exec)(command, { windowsHide: true, stdio: "inherit" });
}