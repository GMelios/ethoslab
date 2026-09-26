/**
 * Homepage narratives under review. Each (except the baseline) lives at
 * /b/<id> and /c/<id>, with its copy in src/data/narratives/<id>.ts.
 */
export const stories = [
  { id: '', label: 'Sections', short: '0', description: 'Original section-based homepage, no narrative' },
  { id: 'question', label: 'Question', short: '1', description: 'Follow one policy question from a desk to a decision' },
  { id: 'gap', label: 'Gap', short: '2', description: 'The evaluation gap: a problem-led argument' },
  { id: 'beliefs', label: 'Beliefs', short: '3', description: 'What we believe: a four-part manifesto' },
] as const;
