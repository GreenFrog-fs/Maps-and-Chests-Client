import { useRef } from "react";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useLoader } from "@react-three/fiber";
import { clone } from "three/examples/jsm/utils/SkeletonUtils.js";
import useUserStore from "../../stores/userStore";

export default function User3D({ position }) {
  const { avatar_src } = useUserStore();
  const modelRef = useRef(null);
  const gltf = useLoader(GLTFLoader, avatar_src);

  return (
    <primitive
      ref={modelRef}
      object={clone(gltf.scene)}
      position={[...position, 20]}
      scale={[8, 8, 8]}
      rotation={[Math.PI / 2, -Math.PI / 2, 0]}
    />
  );
}
