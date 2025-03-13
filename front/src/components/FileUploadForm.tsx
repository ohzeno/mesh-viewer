import React, { useState, useRef } from "react";
import { useMeshUpload } from "../hooks/useMeshUpload";
import { DEFAULT_MESSAGE } from "../constants";
import { validateFile } from "../utils/fileUtils";
import DragOverlay from "./DragOverlay";
import FileSelectionArea from "./FileSelectionArea";

const FileUploadForm = () => {
  const [fileState, setFileState] = useState<FileState>({
    file: null,
    name: DEFAULT_MESSAGE,
  });
  const [inputKey, setInputKey] = useState<number>(Date.now());
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragCounter = useRef<number>(0);

  const { uploadMesh, errorMessage, setErrorMessage, isUploading } =
    useMeshUpload();

  const handleFileSelection = (file: File | null) => {
    const { isValid, fileName, errorMessage } = validateFile(file);
    setFileState({ file: isValid ? file : null, name: fileName });
    setErrorMessage(errorMessage);
  };

  const handleFileUpload = async () => {
    if (!fileState.file) return;
    const success = await uploadMesh(fileState.file);
    if (success) {
      // 파일 업로드 후 DOM조작 없이 input태그 상태 초기화 위해 key값 변경으로 리렌더링
      setInputKey(Date.now());
      setFileState({ file: null, name: DEFAULT_MESSAGE });
    }
  };

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragCounter.current += 1;
    if (event.dataTransfer.items && event.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    dragCounter.current = 0;
    const file = event.dataTransfer.files && event.dataTransfer.files[0];
    handleFileSelection(file);
  };

  return (
    <div className="flex-shrink-0 relative">
      <div
        className={`bg-gray-850 rounded-lg mb-2 border-2 border-dashed ${
          !isDragging ? "border-gray-500" : "border-cyan-500"
        } relative overflow-hidden`}
        style={{ boxSizing: "border-box" }}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <DragOverlay isDragging={isDragging} />
        <div className="flex flex-col items-center p-2">
          {errorMessage && (
            <div className="text-red-500 text-md-lg mb-2">{errorMessage}</div>
          )}
          <FileSelectionArea
            fileState={fileState}
            onFileSelect={handleFileSelection}
            inputKey={inputKey}
            isUploading={isUploading}
          />
          <button
            id="file-upload-button"
            onClick={handleFileUpload}
            className={`font-bold py-1 px-3 mb-1 rounded text-md-lg ${
              fileState.file && !isUploading
                ? "bg-green-600 hover:bg-green-750 cursor-pointer"
                : "bg-gray-450 cursor-not-allowed"
            }`}
            disabled={!fileState.file || isUploading}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(FileUploadForm);
