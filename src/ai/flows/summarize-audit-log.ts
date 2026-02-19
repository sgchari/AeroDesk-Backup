'use server';
/**
 * @fileOverview A Genkit flow for summarizing audit logs.
 *
 * - summarizeAuditLog - A function that handles the audit log summarization process.
 * - AuditLogInput - The input type for the summarizeAuditLog function.
 * - AuditLogSummaryOutput - The return type for the summarizeAuditLog function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

// Input Schema: Raw audit log content
const AuditLogInputSchema = z.object({
  auditLogContent: z
    .string()
    .describe('The raw content of the audit log to be summarized.'),
});
export type AuditLogInput = z.infer<typeof AuditLogInputSchema>;

// Output Schema: Concise, human-readable summary
const AuditLogSummaryOutputSchema = z.object({
  summary: z
    .string()
    .describe(
      'A concise, human-readable summary of all pertinent events, decisions, and compliance flags from the audit log.'
    ),
});
export type AuditLogSummaryOutput = z.infer<typeof AuditLogSummaryOutputSchema>;

export async function summarizeAuditLog(
  input: AuditLogInput
): Promise<AuditLogSummaryOutput> {
  return summarizeAuditLogFlow(input);
}

const summarizeAuditLogPrompt = ai.definePrompt({
  name: 'summarizeAuditLogPrompt',
  input: {schema: AuditLogInputSchema},
  output: {schema: AuditLogSummaryOutputSchema},
  prompt: `You are an AI assistant tasked with summarizing audit logs for administrators in a digital aviation infrastructure platform.
Your goal is to provide a concise, human-readable summary of the provided audit log content.

Identify and extract all pertinent events, decisions, and compliance flags related to a specific item (e.g., a charter request, empty-leg approval, or user activity trail).
The summary should enable an administrator to efficiently understand the full context, ensure proper governance, and prepare for audits.
Focus on key actions, participants, timestamps, and outcomes. Omit verbose details.

Audit Log Content:
{{{auditLogContent}}}

Generate the summary in a structured and easy-to-read format.`,
});

const summarizeAuditLogFlow = ai.defineFlow(
  {
    name: 'summarizeAuditLogFlow',
    inputSchema: AuditLogInputSchema,
    outputSchema: AuditLogSummaryOutputSchema,
  },
  async input => {
    const {output} = await summarizeAuditLogPrompt(input);
    if (!output) {
      throw new Error('Failed to generate audit log summary.');
    }
    return output;
  }
);
