'use server';

/**
 * @fileOverview Retrieves notes based on natural language queries using AI.
 *
 * - retrieveNotes - A function that retrieves notes based on a natural language query.
 * - RetrieveNotesInput - The input type for the retrieveNotes function.
 * - RetrieveNotesOutput - The return type for the retrieveNotes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RetrieveNotesInputSchema = z.object({
  query: z.string().describe('The natural language query to retrieve notes.'),
  summaries: z.array(z.string()).describe('An array of note summaries to search through.'),
});
export type RetrieveNotesInput = z.infer<typeof RetrieveNotesInputSchema>;

const RetrieveNotesOutputSchema = z.object({
  relevantNotes: z.array(z.string()).describe('An array of relevant note summaries.'),
});
export type RetrieveNotesOutput = z.infer<typeof RetrieveNotesOutputSchema>;

export async function retrieveNotes(input: RetrieveNotesInput): Promise<RetrieveNotesOutput> {
  return retrieveNotesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'retrieveNotesPrompt',
  input: {schema: RetrieveNotesInputSchema},
  output: {schema: RetrieveNotesOutputSchema},
  prompt: `You are a helpful assistant that retrieves relevant notes based on a user query.

  Given the following notes summaries:
  {{#each summaries}}
  - {{{this}}}
  {{/each}}

  Determine which notes are relevant to the following query: {{{query}}}

  Return only the relevant note summaries in an array.
  If no notes are relevant, return an empty array.
  `,
});

const retrieveNotesFlow = ai.defineFlow(
  {
    name: 'retrieveNotesFlow',
    inputSchema: RetrieveNotesInputSchema,
    outputSchema: RetrieveNotesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
