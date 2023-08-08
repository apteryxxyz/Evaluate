#!/usr/bin/env node
import '../src/env';
import { program } from 'commander';
import commandsCommand from './commands';
import translationsCommand from './translations';

program
  .name('evaluate')
  .addCommand(commandsCommand)
  .addCommand(translationsCommand)
  .parse();

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
