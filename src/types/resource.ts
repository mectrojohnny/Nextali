export interface Resource {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  fileUrl?: string;
  category: 'Document' | 'Video' | 'Audio' | 'Image' | 'Presentation' | 'Spreadsheet' | 'PDF' | 'Template' | 'Guide' | 'Tutorial' | 'Course Material' | 'Research Paper' | 'Case Study' | 'E-book' | 'Other';
  isDownloadable: boolean;
  createdAt: string;
  updatedAt: string;
  downloadCount?: number;
  viewCount?: number;
  tags?: string[];
  userId: string;
  userEmail: string;
} 