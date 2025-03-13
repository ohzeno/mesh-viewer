import React, { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";

const Background: React.FC = () => {
  const { scene } = useThree();

  useEffect(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 256;
    const context = canvas.getContext("2d");
    if (context) {
      const gradient = context.createLinearGradient(0, 0, 0, 256); // x0, y0에서 x1, y1로
      gradient.addColorStop(0, "#000001"); // 그래디언트 시작 색상
      gradient.addColorStop(1, "#7373e5"); // 그래디언트 끝 색상
      context.fillStyle = gradient;
      context.fillRect(0, 0, 1, 256); // (x, y, width, height) 세로로 긴 1픽셀 너비의 그래디언트

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      texture.colorSpace = THREE.SRGBColorSpace;
      scene.background = texture;
    }
  }, [scene]);

  return null;
};

export default Background;
