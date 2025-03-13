import { useResetRecoilState } from "recoil";
import {
  glossinessState,
  transparencyState,
  metallicState,
} from "../state/atoms";

export const useResetProperties = () => {
  const resetGlossiness = useResetRecoilState(glossinessState);
  const resetTransparency = useResetRecoilState(transparencyState);
  const resetMetallic = useResetRecoilState(metallicState);

  return () => {
    resetGlossiness();
    resetTransparency();
    resetMetallic();
  };
};
