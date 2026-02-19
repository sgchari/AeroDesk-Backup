'use server';
/**
 * @fileOverview This file implements a Genkit flow for generating a structured Charter RFQ draft
 * based on a natural language description provided by a user.
 *
 * - generateRFQDraft - A function that takes a high-level description of charter needs
 *                      and returns a structured RFQ draft.
 * - GenerateRFQDraftInput - The input type for the generateRFQDraft function.
 * - GenerateRFQDraftOutput - The return type for the generateRFQDraft function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRFQDraftInputSchema = z.object({
  description: z
    .string()
    .describe(
      'A high-level natural language description of the charter needs, e.g., "Need a flight from Mumbai to Delhi for 10 passengers next Tuesday afternoon, with a pet-friendly option."
'    ),
});
export type GenerateRFQDraftInput = z.infer<typeof GenerateRFQDraftInputSchema>;

const GenerateRFQDraftOutputSchema = z.object({
  departureLocation: z.string().describe('The departure city or airport.'),
  arrivalLocation: z.string().describe('The arrival city or airport.'),
  departureDate: z
    .string()
    .describe('The estimated departure date in YYYY-MM-DD format.'),
  departureTime: z
    .string()
    .describe('The estimated departure time in HH:MM (24-hour) format.'),
  numberOfPassengers: z
    .number()
    .int()
    .positive()
    .describe('The number of passengers.'),
  aircraftTypeSuggestions: z
    .array(z.string())
    .describe('Suggested types of aircraft suitable for the request.'),
  specialRequirements: z
    .array(z.string())
    .describe('Any special requirements like pet-friendly, catering, medical equipment, etc.'),
  estimatedFlightDuration: z
    .string()
    .describe('Estimated flight duration, e.g., "2h 30m".'),
  complianceConsiderations: z
    .array(z.string())
    .describe('Relevant compliance considerations for NSOP in India.'),
  notes: z
    .string()
    .describe('Any additional notes or details related to the charter request.'),
});
export type GenerateRFQDraftOutput = z.infer<typeof GenerateRFQDraftOutputSchema>;

export async function generateRFQDraft(
  input: GenerateRFQDraftInput
): Promise<GenerateRFQDraftOutput> {
  return generateRFQDraftFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRFQDraftPrompt',
  input: {schema: GenerateRFQDraftInputSchema},
  output: {schema: GenerateRFQDraftOutputSchema},
  prompt: `You are an AI assistant specialized in generating structured Charter RFQ drafts for non-scheduled charter operations (NSOP) in India.

Given a high-level natural language description of charter needs, your task is to extract all relevant information and structure it into a comprehensive RFQ draft. Focus on precision and detail for all fields. Ensure that compliance considerations specific to Indian NSOP regulations are highlighted where appropriate.

Here is the charter need description:
"""
{{{description}}}
"""

Please generate a structured Charter RFQ draft based on the description, adhering strictly to the JSON schema provided. If a specific detail is not present in the description, use your best judgment to suggest a reasonable placeholder or infer it where possible, and indicate any assumptions in the 'notes' field. For 'complianceConsiderations', think about typical NSOP requirements for the given scenario in India.`,
});

const generateRFQDraftFlow = ai.defineFlow(
  {
    name: 'generateRFQDraftFlow',
    inputSchema: GenerateRFQDraftInputSchema,
    outputSchema: GenerateRFQDraftOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
