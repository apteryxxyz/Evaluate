import { Command } from 'commander';
import compileCommand from './compile';

export default new Command('translations').addCommand(compileCommand);
