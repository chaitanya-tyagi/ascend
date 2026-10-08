/**
 * MOCK CONTENT
 * Everything in this file is placeholder content for the prototype.
 * It will be replaced by the adaptive assessment engine / content service.
 */
import type { CalibrationQuestion, Challenge, Domain, StudyLevel } from './types'

export const EDUCATION_FIELDS = [
  { id: 'mathematics', label: 'Mathematics', code: 'MTH' },
  { id: 'computer-science', label: 'Computer Science', code: 'CSC' },
  { id: 'programming', label: 'Programming', code: 'PRG' },
  { id: 'physics', label: 'Physics', code: 'PHY' },
  { id: 'design', label: 'Design', code: 'DSG' },
  { id: 'business', label: 'Business', code: 'BUS' },
  { id: 'other', label: 'Other', code: 'OTH' },
] as const

export const STUDY_LEVELS: { id: StudyLevel; label: string }[] = [
  { id: 'secondary', label: 'Secondary school' },
  { id: 'self-taught', label: 'Self-taught' },
  { id: 'undergraduate', label: 'Undergraduate' },
  { id: 'graduate', label: 'Graduate / postgraduate' },
]

export const DOMAIN_LABELS: Record<Domain, string> = {
  mathematics: 'Mathematics',
  programming: 'Programming',
  reasoning: 'Analytical Reasoning',
}

export const CALIBRATION_LENGTH = 6
export const DOMAIN_ROTATION: Domain[] = ['mathematics', 'programming', 'reasoning']

export const QUESTION_BANK: CalibrationQuestion[] = [
  // Mathematics
  { id: 'm1', domain: 'mathematics', difficulty: 1, prompt: 'What is 7 × 8?', options: ['54', '56', '64', '48'], answerIndex: 1 },
  { id: 'm2', domain: 'mathematics', difficulty: 2, prompt: 'Solve for x:  3x + 5 = 20', options: ['x = 3', 'x = 15', 'x = 5', 'x = 25 / 3'], answerIndex: 2 },
  { id: 'm3', domain: 'mathematics', difficulty: 3, prompt: 'What is the derivative of f(x) = x³ ?', options: ['x²', '3x²', '3x', 'x⁴ / 4'], answerIndex: 1 },
  { id: 'm4', domain: 'mathematics', difficulty: 4, prompt: 'What is the sum of all integers from 1 to 100?', options: ['5000', '4950', '5050', '10100'], answerIndex: 2 },
  { id: 'm5', domain: 'mathematics', difficulty: 5, prompt: 'Evaluate the integral of x · eˣ from 0 to 1.', options: ['e − 1', '1', 'e', '1 / 2'], answerIndex: 1 },

  // Programming
  { id: 'p1', domain: 'programming', difficulty: 1, prompt: 'Which data type stores an ordered sequence of values?', options: ['Boolean', 'Array', 'Integer', 'Character'], answerIndex: 1 },
  { id: 'p2', domain: 'programming', difficulty: 2, prompt: 'What is printed?', code: 'let x = 3\nx += 2\nprint(x)', options: ['3', '32', '5', 'Error'], answerIndex: 2 },
  { id: 'p3', domain: 'programming', difficulty: 3, prompt: 'Time complexity of binary search on a sorted array?', options: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'], answerIndex: 1 },
  { id: 'p4', domain: 'programming', difficulty: 4, prompt: 'What does this expression return?', code: '[1, 2, 3]\n  .map(x => x * 2)\n  .filter(x => x > 2)', options: ['[2, 4, 6]', '[4, 6]', '[6]', '[1, 2, 3]'], answerIndex: 1 },
  { id: 'p5', domain: 'programming', difficulty: 5, prompt: 'Worst-case time complexity of a naive quicksort?', options: ['O(n log n)', 'O(n)', 'O(n²)', 'O(log n)'], answerIndex: 2 },

  // Analytical reasoning
  { id: 'r1', domain: 'reasoning', difficulty: 1, prompt: 'Next in the sequence:  2, 4, 6, 8, ?', options: ['9', '10', '12', '16'], answerIndex: 1 },
  { id: 'r2', domain: 'reasoning', difficulty: 2, prompt: 'All operators are travelers. Some travelers are architects. Are some operators necessarily architects?', options: ['Yes, necessarily', 'Not necessarily', 'No, never'], answerIndex: 1 },
  { id: 'r3', domain: 'reasoning', difficulty: 3, prompt: 'Next in the sequence:  1, 1, 2, 3, 5, 8, ?', options: ['11', '12', '13', '16'], answerIndex: 2 },
  { id: 'r4', domain: 'reasoning', difficulty: 4, prompt: 'A drone and a battery cost 110 credits together. The drone costs 100 more than the battery. What does the battery cost?', options: ['10', '5', '15', '1'], answerIndex: 1 },
  { id: 'r5', domain: 'reasoning', difficulty: 5, prompt: 'Next in the sequence:  2, 6, 12, 20, 30, ?', options: ['40', '42', '44', '36'], answerIndex: 1 },
]

export const FIRST_CHALLENGE: Challenge = {
  id: 'challenge-001',
  code: 'CHALLENGE // 001',
  title: 'The Limited Resource',
  brief:
    'Sector 01 has lost its main power relay. You control the remaining reserve: 100 units for the next 72 hours. Three systems are requesting energy. There is not enough for everything.',
  steps: [
    {
      id: 'allocate',
      title: 'Initial allocation',
      situation:
        'Medical Bay needs 40 units to stay operational. Water Purification needs 35. The Transit Network needs 50 to run at full capacity. How do you allocate the reserve?',
      options: [
        {
          id: 'critical-first',
          label: 'Protect life-critical systems',
          detail: 'Medical 40 · Water 35 · Transit 25 (reduced service)',
          weights: { prioritization: 2, strategic: 1 },
        },
        {
          id: 'equal-split',
          label: 'Split evenly',
          detail: 'Roughly 33 units to each system',
          weights: { risk: -1 },
        },
        {
          id: 'transit-first',
          label: 'Restore movement first',
          detail: 'Transit 50 · Medical 40 · Water 10 — evacuate if needed',
          weights: { strategic: 1, risk: 1 },
        },
      ],
    },
    {
      id: 'disruption',
      title: 'Disruption',
      situation:
        'Hour 30. A storm damages the reserve — 20 units are lost. A repair crew reports they can restore 30 units, but only if they receive 10 units now to power their equipment.',
      options: [
        {
          id: 'fund-repair',
          label: 'Fund the repair crew',
          detail: 'Invest 10 units now for a possible +30 later',
          weights: { strategic: 2, risk: 1 },
        },
        {
          id: 'hold-reserve',
          label: 'Hold the reserve',
          detail: 'Cut Transit further and keep every unit available',
          weights: { prioritization: 1 },
        },
        {
          id: 'ask-data',
          label: 'Request more information',
          detail: 'Ask the crew for a success estimate before deciding',
          weights: { risk: 2 },
        },
      ],
    },
    {
      id: 'communicate',
      title: 'Communication',
      situation:
        'Residents are noticing outages. You have one broadcast window before the next decision cycle.',
      options: [
        {
          id: 'full-transparency',
          label: 'Share the full situation',
          detail: 'Explain the shortage, priorities and expected timeline',
          weights: { strategic: 1, risk: 1 },
        },
        {
          id: 'reassure',
          label: 'Reassure without details',
          detail: 'Keep the message short to avoid panic',
          weights: {},
        },
        {
          id: 'conservation',
          label: 'Ask residents to conserve',
          detail: 'Turn the population into part of the solution',
          weights: { prioritization: 1, strategic: 1 },
        },
      ],
    },
  ],
}

export const CHALLENGE_DIMENSION_LABELS = {
  strategic: 'Strategic Reasoning',
  prioritization: 'Resource Prioritization',
  risk: 'Risk Assessment',
} as const
