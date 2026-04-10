/**
 * Utility to handle image URL transformations
 */

/**
 * Converts a Google Drive share link into a direct image stream link
 * that can be used in <img> tags.
 * 
 * @param url The Google Drive URL
 * @returns A direct link or the original URL if not a Drive link
 */
export const getDirectImageUrl = (url: string): string => {
  if (!url) return '';

  // Handle Google Drive links
  // Formats handled: 
  // - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
  // - https://drive.google.com/open?id=FILE_ID
  // - https://drive.google.com/uc?id=FILE_ID
  
  const driveRegex = /(?:https?:\/\/)?(?:drive\.google\.com)\/(?:file\/d\/|open\?id=|uc\?id=)([a-zA-Z0-9_-]+)/;
  const match = url.match(driveRegex);

  if (match && match[1]) {
    const fileId = match[1];
    return `https://drive.google.com/uc?export=view&id=${fileId}`;
  }

  // Handle local server uploads
  if (url.startsWith('/uploads/')) {
    return `http://localhost:5000${url}`;
  }

  return url;
};
