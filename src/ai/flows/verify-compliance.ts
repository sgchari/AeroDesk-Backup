'use server';
/**
 * @fileOverview An AI agent for verifying compliance of aviation-related inputs against NSOP regulations and internal policies.
 *
 * - verifyCompliance - A function that handles the compliance verification process.
 * - ComplianceVerificationInput - The input type for the verifyCompliance function.
 * - ComplianceVerificationOutput - The return type for the verifyCompliance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ComplianceVerificationInputSchema = z.object({
  itemDetails: z
    .string()
    .describe(
      'Details of the item to be verified, such as a flight request, operator bid, or empty-leg listing.'
    ),
  context: z
    .string()
    .describe(
      'Additional context for verification, including the type of item (e.g., "flight request", "operator bid", "empty-leg listing") and any specific policies or regulations to consider.'
    ),
});
export type ComplianceVerificationInput = z.infer<
  typeof ComplianceVerificationInputSchema
>;

const ComplianceVerificationOutputSchema = z.object({
  isCompliant: z.boolean().describe('Whether the item is compliant.'),
  complianceSummary:
    z.string().describe('A summary of the overall compliance status.'),
  risks: z.array(z.string()).describe('List of identified compliance risks.'),
  correctiveActions:
    z.array(z.string()).describe('List of suggested corrective actions.'),
});
export type ComplianceVerificationOutput = z.infer<
  typeof ComplianceVerificationOutputSchema
>;

export async function verifyCompliance(
  input: ComplianceVerificationInput
): Promise<ComplianceVerificationOutput> {
  return verifyComplianceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'verifyCompliancePrompt',
  input: {schema: ComplianceVerificationInputSchema},
  output: {schema: ComplianceVerificationOutputSchema},
  prompt: `You are an expert compliance officer for non-scheduled charter operations (NSOP) in India. Your task is to analyze submitted aviation-related items against relevant NSOP regulations and internal company policies.

Carefully review the provided item details and context. Identify any potential compliance risks and suggest specific, actionable corrective actions to ensure full regulatory adherence.

Item Details: {{{itemDetails}}}
Context: {{{context}}}`,
});

const verifyComplianceFlow = ai.defineFlow(
  {
    name: 'verifyComplianceFlow',
    inputSchema: ComplianceVerificationInputSchema,
    outputSchema: ComplianceVerificationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
