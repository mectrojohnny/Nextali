import CommunityPage from '@/components/community/CommunityPage';

export const metadata = {
  title: 'NextHub Community - Nextali',
  description: 'Join our vibrant NextHub community for African entrepreneurs and SMEs. Connect, collaborate, and grow with like-minded business leaders.',
  openGraph: {
    title: 'NextHub Community - Nextali',
    description: 'Join our vibrant NextHub community for African entrepreneurs and SMEs. Connect, collaborate, and grow with like-minded business leaders.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NextHub Community - Nextali',
    description: 'Join our vibrant NextHub community for African entrepreneurs and SMEs. Connect, collaborate, and grow with like-minded business leaders.',
  },
};

export default function Page() {
  return <CommunityPage />;
} 