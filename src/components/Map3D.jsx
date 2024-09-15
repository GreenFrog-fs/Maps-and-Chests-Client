import User3D from "./User3D";
import Tile3D from "./Tile3D";

import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";

import { useThree } from "@react-three/fiber";
import Chest3D from "./Chest3D";
import UserPoints from "./UserPoints";
import { getChests } from "../apiActions/getChests";
import { findUser } from "../apiActions/findUser";
import { saveUser } from "../apiActions/saveUser";
import { deactivateChest } from "../apiActions/deactivateChest";
import { latLonToTile } from "../calculations/latLonToTile";
import { latLonToPixel } from "../calculations/latLonToPixel";
import { tileToPixel } from "../calculations/tileToPixel";
import { getDistance } from "../calculations/getDistance";

const tileSize = 256;
const planeWidth = 256;
const planeHeight = 256;
const zoom = 16;
const scale = 2;

export default function Map3D() {
  const id = window?.Telegram?.WebApp?.initDataUnsafe?.user?.id || 1;
  window.Telegram.WebApp.expand();

  const [position, setPosition] = useState([null, null]);
  const [tile, setTile] = useState([null, null]);
  const [chests, setChests] = useState([]);
  const [user, setUser] = useState(null);

  const tileOffsets = [
    { dx: 0, dy: 0 },
    { dx: 1, dy: 0 },
    { dx: 0, dy: 1 },
    { dx: 1, dy: 1 },
    { dx: -1, dy: 0 },
    { dx: -1, dy: 1 },
    { dx: 0, dy: -1 },
    { dx: -1, dy: -1 },
    { dx: 1, dy: -1 },
  ];

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
      const distance = getDistance(
        position[0],
        position[1],
        chest.lat,
        chest.lon
      );
      if (distance < 100) {
        alert("Вы дошли до сундука!");
        deactivateChest(chest.id, id);
        findUser(id).then((user) => setUser(user));
        getChests().then((chests) => setChests(chests));
      }
    });
  }, [position, chests]);

  useEffect(() => {
    findUser(id)
      .then((user) => setUser(user))
      .catch((e) => saveUser(id).then((user) => setUser(user)));
  }, []);

  const { pixelX, pixelY } = latLonToPixel(
    position[0],
    position[1],
    zoom,
    tileSize
  );
  const { mapX, mapY } = tileToPixel(tile[0], tile[1], tileSize);

  const offsetX = pixelX - mapX;
  const offsetY = pixelY - mapY;

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

  useEffect(() => {
    getChests().then((chests) => setChests(chests));
    setInterval(() => {
      getChests().then((chests) => setChests(chests));
    }, 10000);
  }, []);

  if (position[0] == null || position[1] == null) return null;
  if (tile[0] == null || Number.isNaN(tile[0])) return null;
  if (tile[1] == null || Number.isNaN(tile[1])) return null;

  return (
    <>
      {user && <UserPoints points={user.points} />}

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

        <User3D
          position={[
            scale * (-tileSize / 2 + offsetX),
            scale * (tileSize / 2 - offsetY),
          ]}
        />

        {chests.map((chests) => {
          const { pixelX, pixelY } = latLonToPixel(
            chests.lat,
            chests.lon,
            zoom,
            tileSize
          );
          const { mapX, mapY } = tileToPixel(tile[0], tile[1], tileSize);

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
        <CameraController />
      </Canvas>
    </>
  );
}
