export const BLOG_CATEGORIES = [
  'Business Innovation',
  'African Enterprise',
  'Technology',
  'Community',
  'Research',
  'Success Stories',
  'Entrepreneurship',
  'Market Insights',
  'Skills Development'
] as const;

export type BlogCategory = typeof BLOG_CATEGORIES[number]; 