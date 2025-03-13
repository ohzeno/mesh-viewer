import React, { useCallback } from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { selectedMeshState } from "../state/atoms";
import { isRowSelectedSelector } from "../state/selectors";
import { formatFileSize } from "../utils/fileUtils";

const MeshTableRow: React.FC<MeshTableRowProps> = ({ mesh }) => {
  const setSelectedMesh = useSetRecoilState(selectedMeshState);
  // value를 직접 구독하지 않고 selector를 통해 구독해서 불필요한 리렌더링 방지
  const isSelected = useRecoilValue(isRowSelectedSelector(mesh.id));

  // 파일 선택 핸들러. 불필요한 리렌더링 방지를 위해 useCallback 사용
  const handleSelectMesh = useCallback((SelectedMesh: SelectedMesh) => {
    setSelectedMesh(SelectedMesh);
  }, []);

  return (
    <tr
      className={`
        cursor-pointer text-md-lg
        ${isSelected ? "bg-emerald-925 text-white" : "text-gray-200"}
        hover:bg-slate-600 transition-colors duration-150 ease-in-out
        border-b border-gray-600
      `}
      onClick={() =>
        handleSelectMesh({ meshId: mesh.id, meshExt: mesh.fileType })
      }
    >
      <td className="px-2 py-1 text-center border-r border-gray-600">
        {mesh.fileName}
      </td>
      <td className="px-2 py-1 text-center border-r border-gray-600">
        {mesh.fileType}
      </td>
      <td className="px-2 py-1 text-center">{formatFileSize(mesh.fileSize)}</td>
    </tr>
  );
};
export default React.memo(MeshTableRow);
