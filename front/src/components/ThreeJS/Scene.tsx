import React, { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { PerspectiveCamera } from "@react-three/drei";
import { useRecoilValue, useRecoilState } from "recoil";
import {
  glossinessState,
  transparencyState,
  metallicState,
  resetViewState,
} from "../../state/atoms";

function initializeScene(
  scene: THREE.Scene,
  mesh: THREE.Mesh,
  camera: THREE.PerspectiveCamera,
  renderer: THREE.WebGLRenderer
) {
  // 바운딩 박스 계산
  mesh.geometry.computeBoundingBox();
  const boundingBox = mesh.geometry.boundingBox;

  if (!boundingBox) {
    console.error("Unable to compute bounding box");
    return { distance: 0, size: new THREE.Vector3() };
  }

  // 메시의 현재 크기 계산
  const size = new THREE.Vector3();
  boundingBox.getSize(size);
  // const maxDim = Math.max(size.x, size.y, size.z);

  // // 메시를 단위 크기(최대 차원이 1)로 정규화
  // const scale = 1 / maxDim;
  // mesh.scale.setScalar(scale);

  // 정규화된 메시가 view의 80%를 차지하도록 카메라 거리 계산
  const fov = camera.fov * (Math.PI / 180); // FOV를 라디안으로 변환
  const viewportHeight = 2 * Math.tan(fov / 2); // 뷰포트의 상대적 높이
  const distance = 1 / (viewportHeight * 0.4); // 80%를 차지하도록 (1 / (0.8 * 0.5))
  resetView(camera, scene, distance);

  // 조명 설정.
  camera.remove(
    ...camera.children.filter((child) => child instanceof THREE.Light)
  );
  const mainLight = new THREE.DirectionalLight(0xffffff, 0.75);
  mainLight.position.set(0, 0, 1).normalize(); // MeshLab의 Back-Face: Single(기본설정)
  camera.add(mainLight);

  // 렌더러 설정
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 2;

  return { distance, size };
}

function resetView(
  camera: THREE.PerspectiveCamera,
  scene: THREE.Scene,
  distance: number
) {
  camera.position.set(0, 0, distance);
  camera.lookAt(0, 0, 0);
  camera.up.set(0, 1, 0); // 카메라 회전 초기화

  // 아크볼 컨트롤 리셋
  if (typeof scene.userData.resetControls === "function") {
    scene.userData.resetControls();
  }
}

const Scene: React.FC<{ geometry: THREE.BufferGeometry }> = ({ geometry }) => {
  const { scene, gl, size } = useThree();
  const meshRef = useRef<THREE.Mesh>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const sceneDataRef = useRef<{ distance: number; size: THREE.Vector3 }>({
    distance: 0,
    size: new THREE.Vector3(),
  });

  const glossiness = useRecoilValue(glossinessState);
  const transparency = useRecoilValue(transparencyState);
  const metallic = useRecoilValue(metallicState);

  const [resetViewFlag, setResetViewFlag] = useRecoilState(resetViewState);

  useEffect(() => {
    if (meshRef.current && cameraRef.current) {
      sceneDataRef.current = initializeScene(
        scene,
        meshRef.current,
        cameraRef.current,
        gl
      );
      handleResize();
    }
  }, [geometry, gl]);

  const handleResize = () => {
    if (meshRef.current && cameraRef.current) {
      // console.log("Resize");
      const { distance, size } = sceneDataRef.current;
      const aspect = gl.domElement.clientWidth / gl.domElement.clientHeight;
      const fov = cameraRef.current.fov * (Math.PI / 180);
      const viewportHeight = 2 * Math.tan(fov / 2) * distance;
      const viewportWidth = viewportHeight * aspect;
      const scale =
        Math.min(viewportWidth, viewportHeight) /
        Math.max(size.x, size.y, size.z);
      meshRef.current.scale.setScalar(scale * 0.8);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [gl, scene, size]);

  useEffect(() => {
    if (resetViewFlag && meshRef.current && cameraRef.current) {
      const { distance } = sceneDataRef.current;
      resetView(cameraRef.current, scene, distance);
      setResetViewFlag(false);
    }
  }, [resetViewFlag, setResetViewFlag]);

  return (
    <>
      <PerspectiveCamera ref={cameraRef} makeDefault />
      <mesh ref={meshRef} geometry={geometry}>
        <meshStandardMaterial
          color="white"
          roughness={1 - glossiness}
          metalness={metallic}
          opacity={1 - transparency}
          transparent={true}
          side={THREE.DoubleSide}
          flatShading={true}
        />
      </mesh>
    </>
  );
};

export default Scene;
