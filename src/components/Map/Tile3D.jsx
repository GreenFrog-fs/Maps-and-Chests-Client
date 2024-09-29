import React, { useRef } from "react";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";

const Tile3D = React.memo(
  ({ x, y, position, zoom, size, scale }) => {
    const meshRef = useRef(null);

    const tileUrl = `/minitiles/${zoom}/${x}/${y}.jpg`;
    const texture = useLoader(TextureLoader, tileUrl);

    return (
      <mesh ref={meshRef} position={position} scale={scale}>
        <planeGeometry args={[size[0], size[1]]} />
        <meshBasicMaterial map={texture} />
      </mesh>
    );
  },
  (prevProps, nextProps) => {
    return (
      prevProps.x === nextProps.x &&
      prevProps.y === nextProps.y &&
      prevProps.position[0] === nextProps.position[0] &&
      prevProps.position[1] === nextProps.position[1] &&
      prevProps.position[2] === nextProps.position[2] &&
      prevProps.zoom === nextProps.zoom &&
      prevProps.size[0] === nextProps.size[0] &&
      prevProps.size[1] === nextProps.size[1] &&
      prevProps.scale === nextProps.scale
    );
  }
);

export default Tile3D;
