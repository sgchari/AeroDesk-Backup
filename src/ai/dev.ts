import { config } from 'dotenv';
config();

import '@/ai/flows/verify-compliance.ts';
import '@/ai/flows/generate-rfq-draft.ts';
import '@/ai/flows/summarize-audit-log.ts';