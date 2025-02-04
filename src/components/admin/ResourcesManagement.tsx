'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db, auth } from '@/lib/firebase';
import { collection, getDocs, addDoc, deleteDoc, doc, query, where, updateDoc } from 'firebase/firestore';
import { uploadFile } from '@/lib/cloudinary';
import { Resource } from '@/types/resource';

const RESOURCE_CATEGORIES = [
  'Document',
  'Video',
  'Audio',
  'Image',
  'Presentation',
  'Spreadsheet',
  'PDF',
  'Template',
  'Guide',
  'Tutorial',
  'Course Material',
  'Research Paper',
  'Case Study',
  'E-book',
  'Other'
] as const;

type ResourceCategory = typeof RESOURCE_CATEGORIES[number];

export default function ResourcesManagement() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [editingResource, setEditingResource] = useState<Resource | null>(null);
  const [uploadStatus, setUploadStatus] = useState({
    file: { status: '', url: '' },
    thumbnail: { status: '', url: '' }
  });

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: RESOURCE_CATEGORIES[0] as ResourceCategory,
    tags: '',
    isDownloadable: true
  });
  const [file, setFile] = useState<File | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [showResourceModal, setShowResourceModal] = useState(false);
  const [existingResources, setExistingResources] = useState<Resource[]>([]);
  const [selectedResource, setSelectedResource] = useState<Resource | null>(null);

  useEffect(() => {
    fetchResources();
  }, []);

  useEffect(() => {
    if (editingResource) {
      setFormData({
        title: editingResource.title,
        description: editingResource.description,
        category: editingResource.category as ResourceCategory,
        tags: editingResource.tags?.join(', ') || '',
        isDownloadable: editingResource.isDownloadable
      });
      setUploadStatus({
        file: { status: 'success', url: editingResource.fileUrl || '' },
        thumbnail: { status: 'success', url: editingResource.imageUrl || '' }
      });
    }
  }, [editingResource]);

  const fetchResources = async () => {
    try {
      const user = auth.currentUser;
      if (!user) {
        setMessage({ type: 'error', text: 'Please log in to manage resources' });
        return;
      }

      const resourcesRef = collection(db, 'resources');
      const q = query(resourcesRef, where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const resourcesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Resource[];
      setResources(resourcesData);
    } catch (error) {
      console.error('Error fetching resources:', error);
      setMessage({ type: 'error', text: 'Failed to fetch resources' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (file: File, type: 'file' | 'thumbnail') => {
    try {
      setUploadStatus(prev => ({
        ...prev,
        [type]: { status: 'uploading', url: '' }
      }));

      const url = await uploadFile(file);

      setUploadStatus(prev => ({
        ...prev,
        [type]: { status: 'success', url }
      }));

      return url;
    } catch (error) {
      console.error(`Error uploading ${type}:`, error);
      setUploadStatus(prev => ({
        ...prev,
        [type]: { status: 'error', url: '' }
      }));
      throw error;
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'file' | 'thumbnail') => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    try {
      if (type === 'file') {
        setFile(selectedFile);
        // Auto-populate title from file name (remove extension and replace dashes/underscores with spaces)
        const fileName = selectedFile.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
        // Capitalize first letter of each word
        const formattedTitle = fileName.replace(/\b\w/g, l => l.toUpperCase());
        setFormData(prev => ({ ...prev, title: formattedTitle }));
      } else {
        setThumbnail(selectedFile);
      }

      await handleFileUpload(selectedFile, type);
    } catch (error) {
      setMessage({ type: 'error', text: `Failed to upload ${type}` });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (!user) {
      setMessage({ type: 'error', text: 'Please log in to add resources' });
      return;
    }

    if (!uploadStatus.file.url) {
      setMessage({ type: 'error', text: 'Please upload a resource file' });
      return;
    }

    setIsUploading(true);
    setMessage(null);

    try {
      const resourceData = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        tags: formData.tags.split(',').map(tag => tag.trim()),
        isDownloadable: formData.isDownloadable,
        userId: user.uid,
        userEmail: user.email || '',
        fileUrl: uploadStatus.file.url,
        imageUrl: uploadStatus.thumbnail.url || '',
        updatedAt: new Date().toISOString()
      };

      if (editingResource) {
        await updateDoc(doc(db, 'resources', editingResource.id), resourceData);
        setMessage({ type: 'success', text: 'Resource updated successfully!' });
      } else {
        const newResourceData = {
          ...resourceData,
          createdAt: new Date().toISOString(),
          downloadCount: 0,
          viewCount: 0
        };
        await addDoc(collection(db, 'resources'), newResourceData);
        setMessage({ type: 'success', text: 'Resource added successfully!' });
      }
      
      resetForm();
      fetchResources();
    } catch (error) {
      console.error('Error saving resource:', error);
      setMessage({ type: 'error', text: 'Failed to save resource' });
    } finally {
      setIsUploading(false);
    }
  };

  const handleEdit = (resource: Resource) => {
    setEditingResource(resource);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    
    try {
      const user = auth.currentUser;
      if (!user) {
        setMessage({ type: 'error', text: 'Please log in to delete resources' });
        return;
      }

      await deleteDoc(doc(db, 'resources', id));
      setMessage({ type: 'success', text: 'Resource deleted successfully!' });
      fetchResources();
    } catch (error) {
      console.error('Error deleting resource:', error);
      setMessage({ type: 'error', text: 'Failed to delete resource' });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: RESOURCE_CATEGORIES[0] as ResourceCategory,
      tags: '',
      isDownloadable: true
    });
    setFile(null);
    setThumbnail(null);
    setEditingResource(null);
    setUploadStatus({
      file: { status: '', url: '' },
      thumbnail: { status: '', url: '' }
    });
  };

  const handleSelectExistingResource = (resource: Resource) => {
    setFormData(prev => ({
      ...prev,
      title: resource.title,
      description: resource.description,
      category: resource.category as ResourceCategory,
      tags: resource.tags?.join(', ') || '',
      isDownloadable: resource.isDownloadable
    }));
    setUploadStatus({
      file: { status: 'success', url: resource.fileUrl || '' },
      thumbnail: { status: 'success', url: resource.imageUrl || '' }
    });
    setSelectedResource(resource);
    setShowResourceModal(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#803C9A]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg p-6"
      >
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {editingResource ? 'Edit Resource' : 'Add New Resource'}
          </h2>
          <p className="text-gray-600">
            {editingResource ? 'Update the resource details below' : 'Add, edit, or remove resources for your community.'}
          </p>
        </div>

        {message && (
          <div className={`p-4 rounded-lg mb-6 ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Resource File</label>
              <button
                type="button"
                onClick={() => setShowResourceModal(true)}
                className="text-sm text-[#803C9A] hover:text-[#9C27B0] focus:outline-none"
              >
                Select from uploaded resources
              </button>
            </div>
            <input
              type="file"
              onChange={(e) => handleFileChange(e, 'file')}
              className="mt-1 block w-full"
              accept="*/*"
              required={!selectedResource}
            />
            {uploadStatus.file.status && (
              <div className="mt-2">
                {uploadStatus.file.status === 'uploading' && (
                  <div className="text-blue-600">Uploading file...</div>
                )}
                {uploadStatus.file.status === 'success' && (
                  <div className="space-y-2">
                    <div className="text-green-600">
                      {selectedResource ? 'Using existing file: ' + selectedResource.title : 'File uploaded successfully!'}
                    </div>
                    <div className="text-sm">
                      <span className="text-gray-600">File URL: </span>
                      <a 
                        href={uploadStatus.file.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#803C9A] hover:text-[#9C27B0] underline break-all"
                      >
                        {uploadStatus.file.url}
                      </a>
                    </div>
                  </div>
                )}
                {uploadStatus.file.status === 'error' && (
                  <div className="text-red-600">Failed to upload file</div>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Title (auto-populated from file name)</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#803C9A] focus:ring-[#803C9A]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#803C9A] focus:ring-[#803C9A]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as ResourceCategory })}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#803C9A] focus:ring-[#803C9A]"
            >
              {RESOURCE_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              placeholder="e.g., guide, pdf, video"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#803C9A] focus:ring-[#803C9A]"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Thumbnail Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 'thumbnail')}
              className="mt-1 block w-full"
            />
            {uploadStatus.thumbnail.status && (
              <div className="mt-2">
                {uploadStatus.thumbnail.status === 'uploading' && (
                  <div className="text-blue-600">Uploading thumbnail...</div>
                )}
                {uploadStatus.thumbnail.status === 'success' && (
                  <div className="space-y-2">
                    <div className="text-green-600">Thumbnail uploaded successfully!</div>
                    <div className="text-sm">
                      <span className="text-gray-600">Thumbnail URL: </span>
                      <a 
                        href={uploadStatus.thumbnail.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-[#803C9A] hover:text-[#9C27B0] underline break-all"
                      >
                        {uploadStatus.thumbnail.url}
                      </a>
                    </div>
                  </div>
                )}
                {uploadStatus.thumbnail.status === 'error' && (
                  <div className="text-red-600">Failed to upload thumbnail</div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isDownloadable}
              onChange={(e) => setFormData({ ...formData, isDownloadable: e.target.checked })}
              className="h-4 w-4 text-[#803C9A] focus:ring-[#803C9A] border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Allow users to download this resource
            </label>
          </div>

          <div className="flex justify-end space-x-4">
            {editingResource && (
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={isUploading || !uploadStatus.file.url}
              className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-[#803C9A] to-[#FF5757] hover:from-[#9C27B0] hover:to-[#E91E63] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#803C9A] disabled:opacity-50"
            >
              {isUploading ? 'Saving...' : editingResource ? 'Update Resource' : 'Add Resource'}
            </button>
          </div>
        </form>
      </motion.div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Your Resources</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resources.map((resource) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              {resource.imageUrl && (
                <div className="aspect-video relative">
                  <img
                    src={resource.imageUrl}
                    alt={resource.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">{resource.title}</h4>
                <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    {resource.category}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(resource)}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => resource.id && handleDelete(resource.id)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                  <span>Views: {resource.viewCount || 0}</span>
                  <span>Downloads: {resource.downloadCount || 0}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {showResourceModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-xl shadow-xl p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-900">Select Existing Resource</h3>
                <button
                  onClick={() => setShowResourceModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {resources.map((resource) => (
                  <div
                    key={resource.id}
                    onClick={() => handleSelectExistingResource(resource)}
                    className="cursor-pointer border rounded-lg p-4 hover:border-[#803C9A] transition-colors"
                  >
                    {resource.imageUrl && (
                      <div className="aspect-video mb-2">
                        <img
                          src={resource.imageUrl}
                          alt={resource.title}
                          className="w-full h-full object-cover rounded"
                        />
                      </div>
                    )}
                    <h4 className="font-semibold text-gray-900">{resource.title}</h4>
                    <p className="text-sm text-gray-500 mt-1">{resource.category}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
} 