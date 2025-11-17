// partial-match.config.ts
export const urgencySimilarity: Record<string, string[]> = {
  IMMEDIATE: ['URGENT'],
  URGENT: ['IMMEDIATE', 'MODERATE'],
  MODERATE: ['URGENT', 'FLEXIBLE'],
  FLEXIBLE: ['MODERATE'],
};

export const experienceSimilarity: Record<string, string[]> = {
  small_business: ['medium_business', 'startup'],
  medium_business: ['small_business', 'large_business'],
  large_business: ['medium_business', 'enterprise'],
  enterprise: ['large_business'],
  startup: ['small_business'],
};

export const engagementSimilarity: Record<string, string[]> = {
  '3_months': ['6-12_months'],
  '6-12_months': ['3_months', '12_months'],
  '12_months': ['6-12_months', '24_months'],
  '24_months': ['12_months'],
  project_based: [],
};

export const serviceTypeSimilarity: Record<string, string[]> = {
  FRACTIONAL_CFO: ['INTERIM_CFO', 'ADVISORY_BOARD_MEMBER'],
  INTERIM_CFO: ['FRACTIONAL_CFO', 'ADVISORY_BOARD_MEMBER'],
  ADVISORY_BOARD_MEMBER: ['INTERIM_CFO', 'CONSULTATION_PER_HOUR'],
  CONSULTATION_PER_HOUR: ['ADVISORY_BOARD_MEMBER'],
};
