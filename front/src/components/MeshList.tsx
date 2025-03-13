import React, { useRef, useEffect } from "react";
import { useRecoilState } from "recoil";
import { selectedMeshState } from "../state/atoms";
import MeshTable from "./MeshTable";
import { useMeshLoader } from "../hooks/useMeshLoader";

const MeshList: React.FC = () => {
  const [selectedMesh, setSelectedMesh] = useRecoilState(selectedMeshState);
  const selectedMeshRef = useRef<SelectedMesh | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { loadMesh, isLoadingMesh } = useMeshLoader();

  useEffect(() => {
    // handleClickOutside가 selectedMesh의 최신 상태를 참조하지 못하는 버그가 가끔 발생함.
    // 이를 해결하기 위해 ref를 사용하여 최신 상태를 반영함
    selectedMeshRef.current = selectedMesh;
  }, [selectedMesh]);

  // 목록 밖 클릭 이벤트 핸들러
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node) &&
        selectedMeshRef.current?.meshId // 선택된 메쉬가 있을 때만 초기화해서 불필요한 렌더링 방지
      ) {
        setSelectedMesh({
          meshId: "",
          meshExt: "",
        });
      } else {
        // console.log("click inside");
      }
    };
    // 문서에 클릭 이벤트 리스너 추가
    document.addEventListener("click", handleClickOutside);

    // 클린업 함수
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // 메쉬 로드 핸들러
  async function handleLoadMesh() {
    if (!selectedMesh.meshId) return;
    await loadMesh(selectedMesh);
  }

  return (
    <div className="flex-grow overflow-hidden">
      <div className="bg-gray-850 rounded-lg p-2 flex flex-col h-full">
        <h1 className="text-lg-xl font-semibold mb-2">Mesh List</h1>
        <div
          ref={containerRef}
          className="flex-grow overflow-auto rounded-lg ring-1 ring-gray-600 ring-inset"
        >
          <MeshTable />
        </div>
        <div className="mt-2">
          <button
            onClick={handleLoadMesh}
            className={`font-bold py-1 px-3 rounded text-md-lg ${
              selectedMesh.meshId
                ? "bg-blue-550 hover:bg-blue-700 text-white"
                : "bg-gray-450 cursor-not-allowed"
            }`}
            disabled={!selectedMesh.meshId || isLoadingMesh}
          >
            {isLoadingMesh ? "Loading..." : "Load"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default React.memo(MeshList);
