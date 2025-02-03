export const cloudinaryConfig = {
  cloudName: 'dg0wv6niu',
  uploadPreset: 'hAvs2iuOgz-NVtVxUb10QSPPnLs',
  apiKey: '914652298777761',
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedFormats: {
    image: ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'],
    video: ['mp4', 'webm', 'mov'],
    raw: ['pdf', 'doc', 'docx', 'txt']
  },
  defaultTransformations: {
    image: {
      quality: 'auto:best',
      fetch_format: 'auto',
      responsive: true,
      secure: true
    }
  }
};

export const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', cloudinaryConfig.uploadPreset);
  formData.append('cloud_name', cloudinaryConfig.cloudName);
  
  try {
    // File size validation
    if (file.size > cloudinaryConfig.maxFileSize) {
      throw new Error(`File size exceeds ${cloudinaryConfig.maxFileSize / (1024 * 1024)}MB limit`);
    }

    // Determine resource type and validate format
    let resourceType = 'auto';
    const fileExtension = file.name.split('.').pop()?.toLowerCase() || '';
    
    if (file.type === 'application/pdf' || cloudinaryConfig.allowedFormats.raw.includes(fileExtension)) {
      resourceType = 'raw';
    } else if (file.type.startsWith('image/') || cloudinaryConfig.allowedFormats.image.includes(fileExtension)) {
      resourceType = 'image';
      // Add image optimization parameters
      formData.append('quality', 'auto:best');
      formData.append('fetch_format', 'auto');
      formData.append('responsive', 'true');
    } else if (file.type.startsWith('video/') || cloudinaryConfig.allowedFormats.video.includes(fileExtension)) {
      resourceType = 'video';
      // Add video optimization parameters
      formData.append('quality', 'auto:best');
    } else {
      throw new Error('Unsupported file format');
    }

    // Add folder based on resource type
    formData.append('folder', `nextali/${resourceType}s`);

    console.log('Uploading to Cloudinary...', {
      cloudName: cloudinaryConfig.cloudName,
      fileType: file.type,
      fileSize: `${(file.size / (1024 * 1024)).toFixed(2)}MB`,
      uploadPreset: cloudinaryConfig.uploadPreset,
      resourceType,
      folder: `nextali/${resourceType}s`
    });

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/${resourceType}/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Cloudinary upload failed:', {
        status: response.status,
        statusText: response.statusText,
        errorData,
        fileInfo: {
          name: file.name,
          type: file.type,
          size: `${(file.size / (1024 * 1024)).toFixed(2)}MB`
        }
      });
      throw new Error(errorData.error?.message || `Upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Upload successful:', {
      url: data.secure_url,
      resourceType,
      publicId: data.public_id,
      format: data.format,
      size: `${(data.bytes / (1024 * 1024)).toFixed(2)}MB`
    });

    return data.secure_url;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
}; 