import React, { useRef } from "react";

const FileSelectionArea: React.FC<FileSelectionAreaProps> = ({
  fileState,
  onFileSelect,
  inputKey,
  isUploading,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileInput = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!fileInputRef.current) return;
    const file = event.target.files && event.target.files[0];
    onFileSelect(file);
  };

  return (
    <div className="p-3 text-center mb-2 rounded-lg w-full">
      {isUploading ? (
        <div className="h-[70px] flex flex-col justify-center items-center">
          <h2 className="text-md-lg font-bold mb-2">Uploading...</h2>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <h2 className="text-md-lg font-bold mb-1">{fileState.name}</h2>
          <span className="text-md-lg text-gray-500 dark:text-gray-400">
            or
          </span>
          <br />
          <input
            key={inputKey}
            type="file"
            onChange={handleFileChange}
            ref={fileInputRef}
            id="file-upload-input"
            name="mesh"
            accept=".ply, .stl, .obj, .off"
            className="hidden"
          />
          <button
            onClick={triggerFileInput}
            className="bg-blue-550 hover:bg-blue-700 font-bold py-1 px-3 rounded text-md-lg mt-2"
          >
            Choose a file
          </button>
        </>
      )}
    </div>
  );
};

export default FileSelectionArea;
