import React from "react";
import FileUploadForm from "../components/FileUploadForm";
import MeshList from "../components/MeshList";
import MeshRenderer from "../components/ThreeJS/MeshRenderer";
import MeshRenderingOptions from "../components/MeshRenderingOptions";

const MeshPage: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row h-full">
      <div className="flex-grow min-w-0 h-[50vh] md:h-full">
        <MeshRenderer />
      </div>
      <div className="w-full md:w-80 md:min-w-[324px] bg-gray-700 shadow-lg p-2 flex flex-col h-full">
        <FileUploadForm />
        <MeshList />
        <MeshRenderingOptions />
      </div>
    </div>
  );
};

export default MeshPage;
