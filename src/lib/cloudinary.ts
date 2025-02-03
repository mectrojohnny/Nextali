export const cloudinaryConfig = {
  cloudName: 'dclhoe5h8',
  uploadPreset: 'rerethrive_unsigned',
  apiKey: '462213447777864',
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

    // Let Cloudinary handle the file naming as per preset configuration
    // Just add the folder path for organization
    formData.append('folder', 'resources');

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
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    throw error;
  }
}; 