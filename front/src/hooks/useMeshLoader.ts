import { useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import axios from "axios";
import { loadedMeshDataState, errorMessageState } from "../state/atoms";
import { meshCacheManager } from "../utils/meshCacheManager";
import { useMeshList } from "./useMeshList";
import { useResetProperties } from "./useResetProperties";
import { getBackendBaseURL } from "../utils/apiConfig";

export const useMeshLoader = () => {
  const [loadedMeshData, setLoadedMeshData] =
    useRecoilState(loadedMeshDataState);
  const [isLoadingMesh, setIsLoadingMesh] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getMeshList } = useMeshList();
  const setErrorMessage = useSetRecoilState(errorMessageState);
  const resetProperties = useResetProperties();

  const loadMesh = async (SelectedMesh: SelectedMesh) => {
    // 이걸 버튼 비활성화로 옮겨야
    if (loadedMeshData && loadedMeshData.id === SelectedMesh.meshId) return;

    setIsLoadingMesh(true);
    setError(null);
    const { meshId, meshExt } = SelectedMesh;
    resetProperties();

    const cachedData = meshCacheManager.get(meshId);
    if (cachedData) {
      setLoadedMeshData({ id: meshId, data: cachedData, ext: meshExt });
      setIsLoadingMesh(false);
      return;
    }

    try {
      const response = await axios.get(
        `${getBackendBaseURL()}/meshes/get/${meshId}`,
        { responseType: "arraybuffer" }
      );

      const meshData = response.data;

      meshCacheManager.add(
        { id: meshId, fileSize: meshData.byteLength } as ReadOnlyMesh,
        meshData
      );
      setLoadedMeshData({ id: meshId, data: meshData, ext: meshExt });
    } catch (error) {
      console.error("Failed to load mesh data:", error);
      setError("Failed to load mesh data.");
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 404) {
          setErrorMessage("Mesh not found. The mesh list has been refreshed.");
          await getMeshList();
        } else if (error.response?.status === 429) {
          setErrorMessage(
            "Too many requests. Please wait a moment and try again."
          );
        }
      }
    } finally {
      setIsLoadingMesh(false);
    }
  };

  return { loadMesh, isLoadingMesh, error };
};
