import { atom } from "recoil";

export const meshListState = atom<ReadOnlyMesh[]>({
  key: "meshListState",
  default: [],
});

export const loadedMeshDataState = atom<any | null>({
  key: "loadedMeshDataState",
  default: null,
});

export const glossinessState = atom<number>({
  key: "glossinessState",
  default: 0.6,
});

export const transparencyState = atom<number>({
  key: "transparencyState",
  default: 0,
});

export const metallicState = atom<number>({
  key: "metallicState",
  default: 0.2,
});

export const resetViewState = atom<boolean>({
  key: "resetViewState",
  default: false,
});

export const selectedMeshState = atom<SelectedMesh>({
  key: "selectedMeshState",
  default: {
    meshId: "",
    meshExt: "",
  },
});

export const errorMessageState = atom<string | null>({
  key: "errorMessageState",
  default: null,
});
