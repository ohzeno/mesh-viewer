import { useThree, useFrame, extend } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { ArcballControls as ArcballControlsImpl } from "three/examples/jsm/controls/ArcballControls";

extend({ ArcballControlsImpl });

const ArcballControls: React.FC = () => {
  const { camera, gl, scene } = useThree();
  const controls = useRef<ArcballControlsImpl>();

  useEffect(() => {
    controls.current = new ArcballControlsImpl(camera, gl.domElement, scene);
    controls.current.addEventListener("change", () => {
      gl.render(scene, camera);
    });

    // 컨트롤 리셋 함수 추가
    const resetControls = () => {
      if (controls.current) {
        controls.current.reset();
        controls.current.target.set(0, 0, 0); // target을 직접 설정
      }
    };

    // scene에 리셋 함수 추가
    scene.userData.resetControls = resetControls;

    return () => {
      controls.current?.dispose();
    };
  }, [camera, gl, scene]);

  useFrame(() => controls.current?.update());

  return null;
};

export default ArcballControls;
