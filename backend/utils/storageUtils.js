const { supabase } = require('../config/supabase');

/**
 * Uploads a file buffer to Supabase Storage
 * @param {Object} file The file object from multer (req.file)
 * @param {String} bucket The bucket name (e.g., 'profile-photos')
 * @returns {String} The public URL or internal path of the uploaded file
 */
const uploadToSupabase = async (file, bucket) => {
  if (!file) return null;

  const fileExt = file.originalname.split('.').pop();
  const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;
  const filePath = `${fileName}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file.buffer, {
      contentType: file.mimetype,
      upsert: true
    });

  if (error) {
    console.error(`Error uploading to Supabase (${bucket}):`, error);
    throw error;
  }

  // If it's the public profile-photos bucket, return the full URL
  if (bucket === 'profile-photos') {
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
    return publicUrl;
  }

  // For private buckets (like bar-licenses), we just return the path
  // We will generate signed URLs when the admin needs to view them
  return filePath;
};

/**
 * Generates a temporary signed URL for private files
 * @param {String} bucket The bucket name
 * @param {String} path The file path/name
 * @returns {String} A temporary URL
 */
const getSignedUrl = async (bucket, path) => {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, 3600); // Valid for 1 hour

  if (error) throw error;
  return data.signedUrl;
};

module.exports = { uploadToSupabase, getSignedUrl };
