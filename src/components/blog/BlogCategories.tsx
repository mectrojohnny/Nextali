import { BlogCategory } from '@/types/types';

export const blogCategories: BlogCategory[] = [
  'Business Innovation',
  'African Enterprise',
  'Technology',
  'Community',
  'Research',
  'Success Stories',
  'Entrepreneurship',
  'Market Insights',
  'Skills Development'
];

interface BlogCategoriesProps {
  onSelectCategory?: (category: BlogCategory) => void;
  selectedCategory?: BlogCategory;
  className?: string;
}

export default function BlogCategories({ 
  onSelectCategory, 
  selectedCategory,
  className = ''
}: BlogCategoriesProps) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {blogCategories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory?.(category)}
          className={`px-3 py-1 text-sm rounded-full transition-colors
            ${selectedCategory === category 
              ? 'bg-primary text-white' 
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
            }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
} 