import {
  planeHeight,
  planeWidth,
  scale,
  tileOffsets,
  zoom,
} from "../../constants";
import Tile3D from "./Tile3D";

export default function Tiles3D({ tile }) {
  return (
    <>
      {tileOffsets.map(({ dx, dy }, index) => (
        <Tile3D
          key={index}
          x={tile[0] + dx}
          y={tile[1] + dy}
          position={[dx * planeWidth * scale, -dy * planeHeight * scale, 0]}
          zoom={zoom}
          size={[planeWidth, planeHeight]}
          scale={scale}
        />
      ))}
    </>
  );
}
