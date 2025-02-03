'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { collection, query, orderBy, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { uploadFile } from '@/lib/cloudinary';

interface GalleryImage {
  id: string;
  url: string;
  title: string;
  uploadedAt: Date;
}

interface ImageGalleryProps {
  onSelect: (url: string) => void;
  onClose: () => void;
}

export default function ImageGallery({ onSelect, onClose }: ImageGalleryProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const imagesRef = collection(db, 'uploaded_images');
      const q = query(imagesRef, orderBy('uploadedAt', 'desc'));
      const snapshot = await getDocs(q);
      
      const fetchedImages = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        uploadedAt: doc.data().uploadedAt?.toDate(),
      })) as GalleryImage[];

      setImages(fetchedImages);
    } catch (error) {
      console.error('Error fetching images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size should be less than 5MB');
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    setUploading(true);
    try {
      // Upload to Cloudinary
      console.log('Starting image upload to Cloudinary...');
      const imageUrl = await uploadFile(file);
      console.log('Image uploaded successfully:', imageUrl);

      if (!imageUrl || !imageUrl.startsWith('http')) {
        throw new Error('Invalid image URL returned from upload');
      }
      
      // Add to Firestore with all required fields
      await addDoc(collection(db, 'uploaded_images'), {
        url: imageUrl,
        title: file.name,
        uploadedAt: Timestamp.now(),
        fileType: file.type,
        fileSize: file.size,
      });

      // Refresh the gallery
      await fetchImages();
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleImageSelect = (url: string) => {
    onSelect(url);
    onClose();
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[90vw] max-w-4xl h-[80vh] flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Image Gallery</h2>
          <div className="flex items-center gap-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleUpload}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className={`px-4 py-2 rounded-lg text-white font-medium flex items-center gap-2 ${
                uploading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#803C9A] to-[#FA4B99] hover:shadow-lg hover:scale-[1.02] transition-all'
              }`}
            >
              <span className="material-icons-outlined">upload</span>
              {uploading ? 'Uploading...' : 'Upload Image'}
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <span className="material-icons-outlined">close</span>
            </button>
          </div>
        </div>
        
        <div className="flex-grow p-6 overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div
                key={image.id}
                className="relative group cursor-pointer"
                onClick={() => handleImageSelect(image.url)}
              >
                <div className="aspect-square relative overflow-hidden rounded-lg border border-gray-200">
                  <Image
                    src={image.url}
                    alt={image.title || 'Gallery image'}
                    fill
                    className="object-cover transition-transform group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                  />
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    Select
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {images.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              No images found in the gallery
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 