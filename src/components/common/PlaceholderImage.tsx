import Image from 'next/image';

interface PlaceholderImageProps {
  width?: number;
  height?: number;
  text?: string;
  className?: string;
  fill?: boolean;
}

export default function PlaceholderImage({ 
  width = 800, 
  height = 600, 
  text = 'Image not available',
  className = '',
  fill = false
}: PlaceholderImageProps) {
  const imageProps = {
    src: '/images/placeholder.svg',
    alt: text,
    className: `bg-gray-100 ${className}`,
    ...(fill ? { fill: true } : { width, height }),
  };

  return <Image {...imageProps} />;
} 