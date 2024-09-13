import { useRef } from "react";

export default function Chest3D({ position }) {
  const markerRef = useRef(null);
  return (
    <mesh ref={markerRef} position={[...position, 10]}>
      <boxGeometry args={[16, 16, 16]} />
      <meshBasicMaterial color="green" />
    </mesh>
  );
}
