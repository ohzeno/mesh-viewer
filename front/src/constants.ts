import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { OFFLoader } from "./components/ThreeJS/loaders/OFFLoader";

export const MESH_FILE_TYPES = {
  PLY: "ply",
  STL: "stl",
  OBJ: "obj",
  OFF: "off",
} as const;

export const LOADER_MAP = new Map<string, ThreeJSLoader>([
  [MESH_FILE_TYPES.PLY, PLYLoader],
  [MESH_FILE_TYPES.STL, STLLoader],
  [MESH_FILE_TYPES.OBJ, OBJLoader],
  [MESH_FILE_TYPES.OFF, OFFLoader],
]);

export const DEFAULT_MESSAGE: string = "Drag and drop your files here";
export const ALLOWED_FILE_TYPES = /\.(ply|stl|obj|off)$/;

export const DEFAULT_MAX_CACHE_SIZE = 250 * 1024 * 1024; // 250MB
