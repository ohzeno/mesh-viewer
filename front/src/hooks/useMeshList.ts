import { useState } from "react";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { meshListState, errorMessageState } from "../state/atoms";
import { getBackendBaseURL } from "../utils/apiConfig";

export const useMeshList = () => {
  const setMeshList = useSetRecoilState(meshListState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setErrorMessage = useSetRecoilState(errorMessageState);

  const getMeshList = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${getBackendBaseURL()}/meshes/list`);
      const sortedMeshes = response.data.sort(
        (a: ReadOnlyMesh, b: ReadOnlyMesh) => {
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        }
      );
      setMeshList(sortedMeshes);
    } catch (error) {
      console.error("Failed to load the mesh list.", error);
      setError("Failed to load the mesh list.");
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 429) {
          setErrorMessage(
            "Too many requests. Please wait a moment and try again."
          );
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { getMeshList, isLoading, error };
};
