import React from "react";
import { useRecoilValue } from "recoil";
import { loadedMeshDataState } from "../../state/atoms";
import { Canvas } from "@react-three/fiber";
import ArcballControls from "./controls/ArcballControls";
import Scene from "./Scene";
import Background from "./Background";
import { useMeshGeometry } from "../../hooks/useMeshGeometry";

const MeshRenderer: React.FC = () => {
  const loadedMeshData = useRecoilValue(loadedMeshDataState);
  const geometry = useMeshGeometry(loadedMeshData);

  return (
    <div className="w-full h-full">
      <Canvas>
        <Background />
        {geometry && <Scene geometry={geometry} />}
        <ArcballControls />
      </Canvas>
    </div>
  );
};

export default MeshRenderer;
