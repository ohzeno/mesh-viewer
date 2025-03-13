import { selector, selectorFamily } from "recoil";
import { loadedMeshDataState, selectedMeshState } from "./atoms";

export const hasMeshLoadedState = selector({
  key: "hasMeshLoadedState",
  get: ({ get }) => {
    const loadedMeshData = get(loadedMeshDataState);
    // loadedMeshData가 변해도 hasMeshLoadedState는 변하지 않음
    return loadedMeshData !== null;
  },
});

export const isRowSelectedSelector = selectorFamily<boolean, string>({
  key: "isRowSelectedSelector",
  get:
    (meshId: string) =>
    ({ get }) => {
      const selectedMesh = get(selectedMeshState);
      return selectedMesh.meshId === meshId;
    },
});
