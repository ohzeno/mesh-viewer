import React from "react";
import { useSetRecoilState, useRecoilValue } from "recoil";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import {
  glossinessState,
  transparencyState,
  metallicState,
  resetViewState,
} from "../state/atoms";
import RenderingOption from "./RenderingOption";
import { hasMeshLoadedState } from "../state/selectors";
import { useResetProperties } from "../hooks/useResetProperties";

const MeshRenderingOptionsContent: React.FC = React.memo(() => {
  const resetProperties = useResetProperties();

  const setResetViewFlag = useSetRecoilState(resetViewState);

  const handleResetView = () => {
    setResetViewFlag(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="bg-gray-850 rounded-lg p-2 mt-2">
        <h2 className="text-lg font-semibold mb-2">Rendering Options</h2>
        <div className="flex flex-col space-y-4">
          <RenderingOption
            label="Glossiness"
            stateAtom={glossinessState}
            id="glossiness"
          />
          <RenderingOption
            label="Metallic"
            stateAtom={metallicState}
            id="metallic"
          />
          <RenderingOption
            label="Transparency"
            stateAtom={transparencyState}
            id="transparency"
          />
          <div className="flex space-x-2">
            <button
              className="bg-blue-550 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded flex-1"
              onClick={resetProperties}
            >
              Reset Properties
            </button>
            <button
              className="bg-green-600 hover:bg-green-750 text-white font-bold py-1 px-3 rounded flex-1"
              onClick={handleResetView}
            >
              Reset View
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
});

const MeshRenderingOptions: React.FC = () => {
  // loadedMeshData가 교체돼도 계속 true인 hasMeshLoadedState를 사용해서 불필요한 리렌더링 방지
  const hasMeshLoaded = useRecoilValue(hasMeshLoadedState);
  return (
    <AnimatePresence>
      {hasMeshLoaded && <MeshRenderingOptionsContent />}
    </AnimatePresence>
  );
};

export default React.memo(MeshRenderingOptions);
