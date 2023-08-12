import { exec } from 'node:child_process';
import { promisify } from 'node:util';

const execAsync = promisify(exec);

void main(process.argv.length, process.argv);
async function main(_argc: number, _argv: string[]) {
  const { stdout: branch } = await execAsync('git rev-parse --abbrev-ref HEAD');
  if (branch.trim() !== 'main') throw new Error('Not on main branch');

  const { stdout: ls } = await execAsync('vercel ls evaluate');
  const [, ...stale] = ls
    .trim()
    .split('\n')
    .map((l) => l.slice(8));

  if (stale.length > 0) {
    console.info('Removing stale deployments');
    await execAsync(`vercel rm ${stale.join(' ')} -y`);
  }

  console.info('Done!');
}
