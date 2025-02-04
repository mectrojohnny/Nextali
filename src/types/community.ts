export interface CommunityCategory {
  id: string;
  name: string;
  icon: string;
  count: number;
}

export interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    isAdmin: boolean;
    uid?: string;
  };
  content: string;
  timestamp: Date;
  likes: number;
  isLiked: boolean;
  comments: Comment[];
  isPinned?: boolean;
  category: string;
  isDeleted?: boolean;
  deletedAt?: Date;
  deletedBy?: string;
}

export interface Comment {
  id: string;
  author: {
    name: string; 
    avatar: string;
  };
  content: string;
  timestamp: Date;
  likes: number;
  isLiked: boolean;
}

export interface UserDetails {
  name: string;
  email: string;
  isAnonymous: boolean;
}

export interface FirebasePost extends Omit<Post, 'timestamp'> {
  timestamp: any; // Firebase Timestamp
}

export const COMMUNITY_CATEGORIES = [
  { id: 'bill', name: 'Business Innovation Lab', icon: 'business_center' },
  { id: 'tea', name: 'Talent Exchange Academy', icon: 'school' },
  { id: 'nep', name: 'Next Entrepreneurs Platform', icon: 'rocket_launch' },
  { id: 'grants', name: 'Grants & Opportunities', icon: 'paid' },
  { id: 'mentorship', name: 'Mentorship', icon: 'groups' },
  { id: 'resources', name: 'Business Resources', icon: 'library_books' },
  { id: 'success', name: 'Success Stories', icon: 'stars' },
  { id: 'announcements', name: 'Announcements', icon: 'campaign' },
] as const; 