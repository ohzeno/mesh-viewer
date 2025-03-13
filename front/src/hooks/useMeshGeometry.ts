import { useState, useEffect } from "react";
import * as THREE from "three";
import { MESH_FILE_TYPES, LOADER_MAP } from "../constants";

export const useMeshGeometry = (
  loadedMeshData: { data: ArrayBuffer; ext: string } | null
) => {
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);

  useEffect(() => {
    if (!loadedMeshData) return;

    const LoaderClass: ThreeJSLoader = LOADER_MAP.get(loadedMeshData.ext);
    if (!LoaderClass) {
      console.error("Unsupported file type:", loadedMeshData.ext);
      return;
    }

    const loader = new LoaderClass();
    let processedGeometry: THREE.BufferGeometry | null = null;

    try {
      if (
        loadedMeshData.ext === MESH_FILE_TYPES.PLY ||
        loadedMeshData.ext === MESH_FILE_TYPES.STL ||
        loadedMeshData.ext === MESH_FILE_TYPES.OFF
      ) {
        processedGeometry = loader.parse(
          loadedMeshData.data
        ) as THREE.BufferGeometry;
      } else if (loadedMeshData.ext === MESH_FILE_TYPES.OBJ) {
        const object = loader.parse(
          new TextDecoder().decode(loadedMeshData.data)
        );
        if (object instanceof THREE.Group) {
          const mesh = object.children.find(
            (child) => child instanceof THREE.Mesh
          ) as THREE.Mesh | undefined;
          if (mesh && mesh.geometry instanceof THREE.BufferGeometry) {
            processedGeometry = mesh.geometry;
          }
        }
      }

      if (processedGeometry) {
        processedGeometry.computeVertexNormals();
        processedGeometry.center();
        processedGeometry.computeBoundingSphere();
        setGeometry(processedGeometry);
      } else {
        console.error("Failed to process geometry");
      }
    } catch (error) {
      console.error("Error processing mesh:", error);
    }
  }, [loadedMeshData]);

  return geometry;
};
