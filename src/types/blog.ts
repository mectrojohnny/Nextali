export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  coverImage?: string;
  category: string[];
  tags: string[];
  status: 'draft' | 'published';
  publishedAt: Date;
  updatedAt?: Date;
  author: {
    name: string;
    avatar: string;
    email?: string;
    role?: string;
    bio?: string;
    socialLink?: string;
  };
  layout: 'classic' | 'modern' | 'minimal' | 'magazine';
  isTrending?: boolean;
  trendingOrder?: number;
}

export type BlogLayout = 'classic' | 'modern' | 'minimal' | 'magazine';

export interface BlogFormData {
  title: string;
  content: string;
  excerpt: string;
  featuredImage: string;
  coverImage?: string;
  category: string[];
  tags: string[];
  status: 'draft' | 'published';
  layout: BlogLayout;
  isTrending?: boolean;
  trendingOrder?: number;
}

export const BLOG_CATEGORIES = [
  'Fibromyalgia',
  'CFS/ME',
  'Wellness',
  'Research',
  'Lifestyle',
  'Success Stories',
] as const;

export type BlogCategory = typeof BLOG_CATEGORIES[number]; 