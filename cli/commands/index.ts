import { Command } from 'commander';
import deployCommand from './deploy';

export default new Command('commands').addCommand(deployCommand);
