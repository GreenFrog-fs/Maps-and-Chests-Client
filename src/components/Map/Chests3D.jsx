import { latLonToPixel } from "../../calculations/latLonToPixel";
import { tileToPixel } from "../../calculations/tileToPixel";
import { scale, tileSize } from "../../constants";
import useChestsStore from "../../stores/chestsStore";
import Chest3D from "./Chest3D";

export default function Chests3D({ tile }) {
  const { chests } = useChestsStore();

  return (
    <>
      {chests.map((chests) => {
        const { pixelX, pixelY } = latLonToPixel(chests.lat, chests.lon);
        const { mapX, mapY } = tileToPixel(tile[0], tile[1]);

        const offsetX = pixelX - mapX;
        const offsetY = pixelY - mapY;

        return (
          <Chest3D
            key={chests.id}
            position={[
              scale * (-tileSize / 2 + offsetX),
              scale * (tileSize / 2 - offsetY),
            ]}
          />
        );
      })}
    </>
  );
}
