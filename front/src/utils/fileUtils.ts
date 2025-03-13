import { DEFAULT_MAX_CACHE_SIZE } from "./../constants";
import { DEFAULT_MESSAGE, ALLOWED_FILE_TYPES } from "../constants";

export const validateFile = (file: File | null): FileValidationResult => {
  let isValid = false;
  let fileName: string = DEFAULT_MESSAGE;
  let errorMessage: string = "";

  if (!file) {
    errorMessage = "The file does not exist.";
  } else if (!ALLOWED_FILE_TYPES.test(file.name)) {
    errorMessage = "Only ply, stl, obj, and off files can be uploaded.";
  } else if (file.size > DEFAULT_MAX_CACHE_SIZE) {
    errorMessage = `The file size cannot exceed ${DEFAULT_MAX_CACHE_SIZE}.`;
  } else {
    isValid = true;
    fileName = file.name;
  }

  return { isValid, fileName, errorMessage };
};

export const formatFileSize = (sizeInBytes: number): string => {
  const sizeInMB = sizeInBytes / (1024 * 1024);
  return sizeInMB.toFixed(2);
};
