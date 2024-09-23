import { useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

export default function Tile3D({ x, y, position, size, zoom, scale }) {
  const meshRef = useRef(null);

  const tileUrl = `/minitiles/${zoom}/${x}/${y}.jpg`;
  const texture = useLoader(TextureLoader, tileUrl);

  return (
    <mesh ref={meshRef} position={position} scale={scale}>
      <planeGeometry args={[size[0], size[1]]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}
