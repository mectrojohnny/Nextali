export interface Resource {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  fileUrl?: string;
  category: string;
  isDownloadable: boolean;
  createdAt: string;
  updatedAt: string;
  downloadCount?: number;
  viewCount?: number;
  tags?: string[];
  userId: string;
  userEmail: string;
} 