interface ReadOnlyMesh {
  id: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  createdAt: string;
}

interface SelectedMesh {
  meshId: string;
  meshExt: string;
}

type ThreeJSLoader =
  | typeof PLYLoader
  | typeof STLLoader
  | typeof OBJLoader
  | typeof OFFLoader;

interface FileValidationResult {
  isValid: boolean;
  fileName: string;
  errorMessage: string;
}

interface DragOverlayProps {
  isDragging: boolean;
}

interface MeshTableRowProps {
  mesh: ReadOnlyMesh;
}

interface RenderingOptionProps {
  label: string;
  stateAtom: RecoilState<number>;
  id: string;
}

interface FileState {
  file: File | null;
  name: string;
}

interface FileSelectionAreaProps {
  fileState: FileState;
  onFileSelect: (file: File | null) => void;
  inputKey: number;
  isUploading: boolean;
}

interface PerformanceMemory {
  jsHeapSizeLimit: number;
  totalJSHeapSize: number;
  usedJSHeapSize: number;
}

interface Performance {
  memory?: PerformanceMemory;
}
