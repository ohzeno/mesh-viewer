import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { meshListState } from "../state/atoms";
import MeshTableRow from "./MeshTableRow";
import { useMeshList } from "../hooks/useMeshList";

const MeshTable: React.FC = () => {
  const meshList = useRecoilValue<ReadOnlyMesh[]>(meshListState);
  const { getMeshList, isLoading, error } = useMeshList();

  useEffect(() => {
    getMeshList();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <table className="w-full border-collapse bg-gray-750">
      <thead className="sticky top-0 bg-gray-650 text-gray-200">
        <tr>
          <th className="px-2 py-1 text-center border-r border-gray-500 text-md-lg">
            Name
          </th>
          <th className="px-2 py-1 text-center border-r border-gray-500 text-md-lg">
            type
          </th>
          <th className="px-2 py-1 text-center text-md-lg">size (MB)</th>
        </tr>
      </thead>
      <tbody>
        {meshList.map((mesh) => (
          <MeshTableRow key={mesh.id} mesh={mesh} />
        ))}
      </tbody>
    </table>
  );
};

export default React.memo(MeshTable);
