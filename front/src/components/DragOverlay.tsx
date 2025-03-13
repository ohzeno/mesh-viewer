import React from "react";

const DragOverlay: React.FC<DragOverlayProps> = ({ isDragging }) => {
  return (
    <div
      className={`absolute inset-0 bg-cyan-900 flex items-center justify-center rounded-lg z-10 transition-all duration-300 ${
        isDragging ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <p className="text-white text-xl font-bold px-4 py-2 z-20 relative">
        Drop file here
      </p>
    </div>
  );
};

export default DragOverlay;
