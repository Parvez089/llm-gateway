/**
 * Scores a prompt's complexity from 0 (simple) to 100 (complex).
 * Higher score → needs a stronger (more expensive) model.
 */

const COMPLEX_KEYWORDS = [
  'analyze',
  'analyse',
  'compare',
  'contrast',
  'step by step',
  'step-by-step',
  'refactor',
  'prove',
  'derive',
  'explain in detail',
  'design',
  'architect',
  'optimize',
  'debug',
  'review',
  'critique',
  'evaluate',
  'implement',
  'algorithm',
];

const SIMPLE_KEYWORDS = [
  'translate',
  'summarize',
  'summarise',
  'format',
  'convert',
  'list',
  'yes or no',
  'true or false',
  'one word',
  'two words',
  'rename',
  'capitalize',
  'uppercase',
  'lowercase',
];

export type ComplexityBreakdown = {
  score: number;
  signals: string[];
};

export function scoreComplexity(prompt: string): ComplexityBreakdown {
  const lower = prompt.toLowerCase();
  const signals: string[] = [];
  let score = 0;

  // 1. Length signal
  const length = prompt.length;
  if (length > 2000) {
    score += 30;
    signals.push('very_long_prompt (+30)');
  } else if (length > 800) {
    score += 20;
    signals.push('long_prompt (+20)');
  } else if (length > 300) {
    score += 10;
    signals.push('medium_prompt (+10)');
  } else if (length < 50) {
    score -= 5;
    signals.push('very_short_prompt (-5)');
  }

  // 2. Code block presence
  if (prompt.includes('```')) {
    score += 20;
    signals.push('code_block (+20)');
  }

  // 3. Multiple questions
  const questionCount = (prompt.match(/\?/g) || []).length;
  if (questionCount >= 3) {
    score += 15;
    signals.push('multiple_questions (+15)');
  } else if (questionCount === 2) {
    score += 8;
    signals.push('two_questions (+8)');
  }

  // 4. Complex keywords
  for (const kw of COMPLEX_KEYWORDS) {
    if (lower.includes(kw)) {
      score += 10;
      signals.push(`complex_keyword:${kw} (+10)`);
    }
  }

  // 5. Simple keywords (subtract)
  for (const kw of SIMPLE_KEYWORDS) {
    if (lower.includes(kw)) {
      score -= 15;
      signals.push(`simple_keyword:${kw} (-15)`);
    }
  }

  // 6. Structured output requested
  if (lower.includes('json') && (lower.includes('schema') || lower.includes('format'))) {
    score += 15;
    signals.push('structured_output (+15)');
  }

  // Clamp between 0 and 100
  const clamped = Math.max(0, Math.min(100, score));

  return { score: clamped, signals };
}