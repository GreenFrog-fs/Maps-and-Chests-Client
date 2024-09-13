import { useRef } from "react";

export default function User3D({ position }) {
  const markerRef = useRef(null);
  return (
    <mesh ref={markerRef} position={[...position, 10]}>
      <sphereGeometry args={[10, 16, 16]} />
      <meshBasicMaterial color="red" />
    </mesh>
  );
}
