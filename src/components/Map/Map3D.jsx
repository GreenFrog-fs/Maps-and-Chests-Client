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
import { lootDistance, scale, tileSize, zoom } from "../../constants";
import Tiles3D from "./Tiles3D";
import Chests3D from "./Chests3D";
import usePageStore from "../../stores/pageStore";
import calculateAngle from "../../calculations/calculateAngle";
import Arrow3D from "./Arrow3D";
import useTileStore from "../../stores/tileStore";
import { distanceToTileEdges } from "../../calculations/distanceToTileEdges";

export default function Map3D({ style }) {
  const [arrowAngle, setArrowAngle] = useState(0);
  const { position, setPosition, setClosestChest, prevPos } = useUserStore();
  const { chests } = useChestsStore();
  const { activateClicker } = usePageStore();
  const { userTile, setUserTile, addTile } = useTileStore();

  useEffect(() => {
    navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setPosition([latitude, longitude]);
        const x = latLonToTile(latitude, longitude, zoom).x;
        const y = latLonToTile(latitude, longitude, zoom).y;
        setUserTile([x, y]);
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
    const distances = distanceToTileEdges(
      position[0],
      position[1],
      userTile[0],
      userTile[1]
    );
    if (distances.right < 150) addTile(1, 0);
    if (distances.left < 150) addTile(-1, 0);
    if (distances.top < 150) addTile(0, -1);
    if (distances.bottom < 150) addTile(0, 1);
    if (distances.top < 150 && distances.right < 150) addTile(1, -1);
    if (distances.top < 150 && distances.left < 150) addTile(-1, -1);
    if (distances.bottom < 150 && distances.right < 150) addTile(1, 1);
    if (distances.bottom < 150 && distances.left < 150) addTile(-1, 1);
  }, [userTile]);

  useEffect(() => {
    let mindistance = Infinity;
    let closest = null;
    chests.forEach((chest) => {
      const distance = getDistance(position, chest.lat, chest.lon);
      if (distance < mindistance) {
        mindistance = distance;
        closest = chest;
        setArrowAngle(
          -calculateAngle(position[0], position[1], chest.lat, chest.lon)
        );
        setClosestChest(chest);
        if (mindistance < lootDistance) {
          return activateClicker();
        }
      }
    });
  }, [position, chests]);

  const { pixelX: prevPixelX, pixelY: prevPixelY } = latLonToPixel(
    prevPos[0],
    prevPos[1]
  );
  const { pixelX, pixelY } = latLonToPixel(position[0], position[1]);
  const { mapX, mapY } = tileToPixel(userTile[0], userTile[1], tileSize);

  const offsetX = pixelX - mapX;
  const offsetY = pixelY - mapY;
  const prevOffsetX = prevPixelX - mapX;
  const prevOffsetY = prevPixelY - mapY;

  function CameraController() {
    const { camera } = useThree();

    useEffect(() => {
      camera.position.set(
        scale * (-tileSize / 2 + offsetX),
        scale * (tileSize / 2 - offsetY) - 25,
        60
      );
      camera.lookAt(
        scale * (-tileSize / 2 + offsetX),
        scale * (tileSize / 2 - offsetY),
        10
      );
    }, [camera]);

    return null;
  }

  const userPosition = [
    scale * (-tileSize / 2 + offsetX),
    scale * (tileSize / 2 - offsetY),
  ];
  const prevUserPosition = [
    scale * (-tileSize / 2 + prevOffsetX),
    scale * (tileSize / 2 - prevOffsetY),
  ];
  const cameraPosition = [
    scale * (-tileSize / 2 + offsetX),
    scale * (tileSize / 2 - offsetY) - 25,
    60,
  ];
  return (
    <div className="scene" style={style}>
      <Canvas
        camera={{
          position: cameraPosition,
          fov: 75,
        }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[0, -10, 7]} intensity={3} castShadow />

        <Tiles3D />
        <Chests3D />
        <User3D position={userPosition} prev={prevUserPosition} />
        <CameraController />
        {chests.length > 0 && (
          <Arrow3D
            position={userPosition}
            prev={prevUserPosition}
            angle={arrowAngle}
          />
        )}
      </Canvas>
    </div>
  );
}
