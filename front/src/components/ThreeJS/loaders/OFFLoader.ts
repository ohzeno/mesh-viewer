import * as THREE from "three";

class OFFLoader {
  load(
    url: string,
    onLoad: (geometry: THREE.BufferGeometry) => void,
    onProgress?: (event: ProgressEvent) => void,
    onError?: (error: unknown) => void
  ) {
    const loader = new THREE.FileLoader();
    loader.setResponseType("arraybuffer");
    loader.load(
      url,
      (data) => {
        if (data instanceof ArrayBuffer) {
          const geometry = this.parse(data);
          onLoad(geometry);
        } else {
          if (onError) onError(new Error("Loaded data is not an ArrayBuffer"));
        }
      },
      onProgress,
      onError
    );
  }

  parse(data: ArrayBuffer): THREE.BufferGeometry {
    const text = new TextDecoder().decode(data);
    const lines = text.split("\n");
    let lineIndex = 0;

    // Skip comments
    while (lines[lineIndex].startsWith("#")) {
      lineIndex++;
    }

    // Verify OFF header
    if (lines[lineIndex].trim() !== "OFF") {
      throw new Error("Invalid OFF file: Missing OFF header");
    }
    lineIndex++;

    // Read vertex and face counts
    const counts = lines[lineIndex].trim().split(/\s+/).map(Number);
    const vertexCount = counts[0];
    const faceCount = counts[1];
    lineIndex++;

    // Read vertices
    const vertices = [];
    for (let i = 0; i < vertexCount; i++) {
      const vertex = lines[lineIndex].trim().split(/\s+/).map(Number);
      vertices.push(...vertex);
      lineIndex++;
    }

    // Read faces
    const indices = [];
    for (let i = 0; i < faceCount; i++) {
      const face = lines[lineIndex].trim().split(/\s+/).map(Number);
      const vertexCount = face[0];
      for (let j = 0; j < vertexCount - 2; j++) {
        indices.push(face[1], face[j + 2], face[j + 3]);
      }
      lineIndex++;
    }

    // Create BufferGeometry
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(vertices, 3)
    );
    geometry.setIndex(indices);
    geometry.computeVertexNormals();

    return geometry;
  }
}

export { OFFLoader };
