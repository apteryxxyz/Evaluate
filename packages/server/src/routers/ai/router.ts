import { GenerateCodeOptions } from '@evaluate/types';
import { aiProcedure, createTRPCRouter } from '~/services/trpc';

export const aiRouter = createTRPCRouter({
  /**
   * Generate code based on the given instructions and file context.
   * @param input - The file and instructions to generate code
   */
  generateCode: aiProcedure.input(GenerateCodeOptions).mutation(async () => {
    return {
      response: 'AI services are currently disabled',
      success: false,
    };

    //       return runModel('@cf/meta/llama-3-8b-instruct', [
    //         {
    //           role: 'system',
    //           content:
    //             'You are an expert coding assistant. You read code from a file, and you suggest new code to add to the file. You may be given instructions on what to generate, which you should follow. You should generate code that is CORRECT, efficient, and follows best practices. You may generate multiple lines of code if necessary. When you generate code, you should ONLY return the code, and nothing else. You MUST NOT include backticks in the code you generate.',
    //         },
    //         {
    //           role: 'user',
    //           content: `The file is called ${file.name}.`,
    //         },
    //         {
    //           role: 'user',
    //           content: `Here are my instructions on what to generate: ${instructions}.`,
    //         },
    //         {
    //           role: 'user',
    //           content: `Suggest me code to insert at line ${file.line} in my file. Give only the code, and NOTHING else. DO NOT include backticks in your response. My code file content is as follows

    // ${file.content}`,
    //         },
    //       ]).then((response) => {
    //         return {
    //           response: response.result.response,
    //           success: response.success,
    //         };
    //       });
  }),

  //   identifyCode: aiProcedure
  //     .input(z.string())
  //     .query(async ({ input: code }) => {
  //       return runModel('@cf/meta/llama-3-8b-instruct', [
  //         {
  //           role: 'system',
  //           content:
  //             'You are an expert code language identifier. You read code and identify what programming language is it written in. You should identify the code as accurately as possible. You should identify the code as a whole, and not just parts of it. When you identify code, you MUST ONLY return the identification, and nothing else. You MUST NOT include backticks in the identification.',
  //         },
  //         {
  //           role: 'user',
  //           content: `Identify the following code:

  // ${code}`,
  //         },
  //       ]).then((response) => {
  //         console.log({ response });
  //         return {
  //           response: response.result.response,
  //           success: response.success,
  //         };
  //       });
  //     }),
});
