'use server';

import { createServerAction } from 'next-sa/server';
import { identifyCode as iIdentifyCode } from '@/services/assistant';
import {
  executeCodeOptionsSchema,
  executeCode as iExecuteCode,
  fetchLanguages as iFetchLanguages,
  getLanguage as iGetLanguage,
  searchLanguages as iSearchLanguages,
} from '@/services/piston';

export const fetchLanguages = createServerAction() //
  .definition(async () => iFetchLanguages());

export const searchLanguages = createServerAction()
  .input((z) => z.string().min(1).max(52))
  .definition(async (query) => iSearchLanguages(query));

export const getLanguage = createServerAction()
  .input((z) => z.string().min(1).max(52))
  .definition(async (id) => iGetLanguage(id));

export const executeCode = createServerAction()
  .input(executeCodeOptionsSchema)
  .definition(async (options) => iExecuteCode(options));

export const identifyCode = createServerAction()
  .input((z) => z.string().min(1).max(1000))
  .definition(async (code) => iIdentifyCode({ code }));
