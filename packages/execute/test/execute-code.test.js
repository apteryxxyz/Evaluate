import { getLanguage } from '@evaluate/languages';
import { ExecuteCodeOptionsSchema, executeCode } from '../dist';

describe('executeCode', () => {
  it('should execute code correctly', async () => {
    const language = await getLanguage('python');

    const options = ExecuteCodeOptionsSchema.parse({
      language: language,
      files: [{ name: 'main.py', content: 'print("Hello, World!")' }],
    });

    const result = await executeCode(options);

    expect(result.success).toBe(true);
    expect(result.run.success).toBe(true);
    expect(result.run.output).toBe('Hello, World!\n');
  });
});
