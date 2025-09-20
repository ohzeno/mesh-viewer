import { useState } from "react";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { meshListState } from "../state/atoms";
import { getBackendBaseURL } from "../utils/apiConfig";

export const useMeshUpload = () => {
  const [errorMessage, setErrorMessage] = useState<string>("");
  const setMeshList = useSetRecoilState(meshListState);
  const [isUploading, setIsUploading] = useState(false);

  const uploadMesh = async (file: File) => {
    setIsUploading(true);
    const formData = new FormData();
    // formData 첫 인자는 key값. 서버측 인터셉터의 첫 인자와 일치해야 함.
    formData.append("mesh", file);
    // 업로드 로직
    try {
      const response = await axios.post(
        `${getBackendBaseURL()}/meshes/upload`,
        formData
      );
      setMeshList((oldMeshList) => [response.data, ...oldMeshList]);
      setErrorMessage("");
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message =
          `${error.response?.status} ${error.response?.statusText}` ||
          "Error occurred during upload";
        setErrorMessage(message);
      } else {
        const message = "Error occurred during upload";
        setErrorMessage(message);
        console.error(`${message}:`, error);
      }
      return false;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadMesh, errorMessage, setErrorMessage, isUploading };
};
