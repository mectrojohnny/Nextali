import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Blog | Rest Revive Thrive',
  description: 'Discover insights, stories, and expert advice on living well with fibromyalgia and CFS/ME',
  openGraph: {
    title: 'Blog | Rest Revive Thrive',
    description: 'Discover insights, stories, and expert advice on living well with fibromyalgia and CFS/ME',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Rest Revive Thrive',
    description: 'Discover insights, stories, and expert advice on living well with fibromyalgia and CFS/ME',
  },
};

export default function PostsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 