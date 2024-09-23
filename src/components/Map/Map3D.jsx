import User3D from "./User3D";
import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";
import { latLonToTile } from "../../calculations/latLonToTile";
import { latLonToPixel } from "../../calculations/latLonToPixel";
import { tileToPixel } from "../../calculations/tileToPixel";
import { getDistance } from "../../calculations/getDistance";
import useUserStore from "../../stores/userStore";
import useChestsStore from "../../stores/chestsStore";
import { scale, tileSize, zoom } from "../../constants";
import Tiles3D from "./Tiles3D";
import Chests3D from "./Chests3D";
import usePageStore from "../../stores/pageStore";

export default function Map3D({ style }) {
  const [tile, setTile] = useState([null, null]);
  const { position, setPosition, setClosestChest } = useUserStore();
  const { chests } = useChestsStore();
  const { activateClicker } = usePageStore();

  useEffect(() => {
    navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setPosition([latitude, longitude]);
        const x = latLonToTile(latitude, longitude, zoom).x;
        const y = latLonToTile(latitude, longitude, zoom).y;
        setTile([x, y]);
      },
      (error) => console.log(error),
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 0,
      }
    );
  }, []);

  useEffect(() => {
    chests.forEach((chest) => {
      const distance = getDistance(position, chest.lat, chest.lon);
      if (distance < 100) {
        setClosestChest(chest);
        activateClicker();
      }
    });
  }, [position, chests]);

  const { pixelX, pixelY } = latLonToPixel(position[0], position[1]);
  const { mapX, mapY } = tileToPixel(tile[0], tile[1], tileSize);

  const offsetX = pixelX - mapX;
  const offsetY = pixelY - mapY;

  if (position[0] == null || position[1] == null) return null;
  if (tile[0] == null || Number.isNaN(tile[0])) return null;
  if (tile[1] == null || Number.isNaN(tile[1])) return null;

  function CameraController() {
    const { camera } = useThree();

    useEffect(() => {
      camera.position.set(
        scale * (-tileSize / 2 + offsetX),
        scale * (tileSize / 2 - offsetY) - 50,
        200
      );
      camera.lookAt(
        scale * (-tileSize / 2 + offsetX),
        scale * (tileSize / 2 - offsetY),
        10
      );
    }, [camera]);

    return null;
  }

  return (
    <div className="scene" style={style}>
      <Canvas
        camera={{
          position: [
            scale * (-tileSize / 2 + offsetX),
            scale * (tileSize / 2 - offsetY) - 50,
            200,
          ],
          fov: 90,
        }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 10, 7.5]} intensity={2} castShadow />
        <Tiles3D tile={tile} />
        <Chests3D tile={tile} />
        <User3D
          position={[
            scale * (-tileSize / 2 + offsetX),
            scale * (tileSize / 2 - offsetY),
          ]}
        />

        <CameraController />
      </Canvas>
    </div>
  );
}
