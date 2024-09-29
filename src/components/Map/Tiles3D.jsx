import { planeHeight, planeWidth, scale, zoom } from "../../constants";
import useTileStore from "../../stores/tileStore";
import Tile3D from "./Tile3D";

export default function Tiles3D() {
  const { userTile, tiles } = useTileStore();
  return (
    <>
      {tiles.map((position, index) => (
        <Tile3D
          key={index}
          x={position[0]}
          y={position[1]}
          position={[
            planeWidth * scale * (position[0] - userTile[0]),
            planeHeight * scale * (userTile[1] - position[1]),
            0,
          ]}
          zoom={zoom}
          size={[planeWidth, planeHeight]}
          scale={scale}
        />
      ))}
    </>
  );
}
