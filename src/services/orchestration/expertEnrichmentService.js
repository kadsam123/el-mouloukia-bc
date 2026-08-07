import { generateExpertInsight } from '../ai/aiClient';
import { updateExpertAnalysis } from '../repositories/expertsRepository';

export async function enrichExpertProfile({ brand, marketName, marketFocus, expert }) {
  if (!expert?.id) {
    throw new Error('expert.id is required for enrichment');
  }

  const insight = await generateExpertInsight({
    brand,
    marketName,
    marketFocus,
    expert
  });

  await updateExpertAnalysis(expert.id, insight);
  return insight;
}