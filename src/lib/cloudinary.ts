export const cloudinaryConfig = {
  cloudName: 'dg0wv6niu',
  uploadPreset: 'ml_default',
  apiKey: '914652298777761',
};

export const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', cloudinaryConfig.uploadPreset);
  formData.append('cloud_name', cloudinaryConfig.cloudName);
  
  try {
    // Determine resource type based on file type
    let resourceType = 'auto';
    
    if (file.type === 'application/pdf') {
      resourceType = 'raw';
    } else if (file.type.startsWith('image/')) {
      resourceType = 'image';
    } else if (file.type.startsWith('video/')) {
      resourceType = 'video';
    }

    console.log('Uploading to Cloudinary...', {
      cloudName: cloudinaryConfig.cloudName,
      fileType: file.type,
      fileSize: file.size,
      uploadPreset: cloudinaryConfig.uploadPreset,
      resourceType
    });

    // Add timeout to the fetch request
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000); // 120 second timeout

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/${resourceType}/upload`,
      {
        method: 'POST',
        body: formData,
        signal: controller.signal
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cloudinary upload failed:', {
        status: response.status,
        statusText: response.statusText,
        errorData,
        fileInfo: {
          name: file.name,
          type: file.type,
          size: file.size
        }
      });
      throw new Error(errorData.error?.message || `Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Upload successful:', {
      url: data.secure_url,
      resourceType,
      publicId: data.public_id
    });

    return data.secure_url;
  } catch (error: unknown) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Upload timed out after 120 seconds. Please try again.');
    }
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
}; 