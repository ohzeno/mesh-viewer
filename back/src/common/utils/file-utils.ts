export const formatFileSize = (sizeInBytes: number): string => {
  const sizeInMB = sizeInBytes / (1024 * 1024);
  return sizeInMB.toFixed(2);
};
