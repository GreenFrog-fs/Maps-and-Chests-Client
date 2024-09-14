import User3D from "./User3D";
import Tile3D from "./Tile3D";

import React, { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";

import { useThree } from "@react-three/fiber";
import axios from "axios";
import Chest3D from "./Chest3D";
import UserPoints from "./UserPoints";

const tileSize = 256;
const planeWidth = 256;
const planeHeight = 256;
const zoom = 16;
const scale = 2;

const url = "https://domennameabcdef.ru/mac";

function getChests() {
  return axios.get(`${url}/chest`).then((res) => res.data);
}

function findUser(id) {
  return axios.get(`${url}/user/${id}`).then((res) => res.data);
}

function saveUser(id) {
  return axios.post(`${url}/user/${id}`).then((res) => res.data);
}

function deactivateChest(id, chest_id) {
  return axios
    .patch(`${url}/chest/${id}/${chest_id}/deactivate`)
    .then((res) => res.data);
}

function latLonToTile(lat, lon, zoom) {
  const n = Math.pow(2, zoom);
  const lon_rad = lon * (Math.PI / 180);
  const lat_rad = lat * (Math.PI / 180);
  const x = ((lon_rad + Math.PI) / (2 * Math.PI)) * n;
  const y =
    ((1 - Math.log(Math.tan(lat_rad) + 1 / Math.cos(lat_rad)) / Math.PI) / 2) *
    n;
  return { x: Math.floor(x), y: Math.floor(y) };
}

function latLonToPixel(lat, lon, zoom) {
  const n = Math.pow(2, zoom);
  const lon_rad = lon * (Math.PI / 180);
  const lat_rad = lat * (Math.PI / 180);
  const x = ((lon_rad + Math.PI) / (2 * Math.PI)) * n;
  const y =
    ((1 - Math.log(Math.tan(lat_rad) + 1 / Math.cos(lat_rad)) / Math.PI) / 2) *
    n;
  const pixelX = x * tileSize;
  const pixelY = y * tileSize;
  return { pixelX, pixelY };
}

function tileToPixel(x, y) {
  const tileSize = 256;
  const mapX = x * tileSize;
  const mapY = y * tileSize;
  return { mapX, mapY };
}

function getDistance(latitude1, longitude1, latitude2, longitude2) {
  const earthRadius = 6371000;
  const lat1Rad = (latitude1 * Math.PI) / 180;
  const lat2Rad = (latitude2 * Math.PI) / 180;
  const deltaLat = ((latitude2 - latitude1) * Math.PI) / 180;
  const deltaLon = ((longitude2 - longitude1) * Math.PI) / 180;

  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(deltaLon / 2) *
      Math.sin(deltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadius * c;
  return distance;
}

export default function Map3D() {
  const id = window?.Telegram?.WebApp?.initDataUnsafe?.user?.id || 1;
  window.Telegram.WebApp.expand();

  const [position, setPosition] = useState([null, null]);
  const [tile, setTile] = useState([null, null]);
  const [chests, setChests] = useState([]);
  const [user, setUser] = useState(null);

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
      if (distance < 20) {
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

  const { pixelX, pixelY } = latLonToPixel(position[0], position[1], zoom);
  const { mapX, mapY } = tileToPixel(tile[0], tile[1]);

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

        <Tile3D
          x={tile[0]}
          y={tile[1]}
          position={[0, 0, 0]}
          zoom={zoom}
          size={[planeWidth, planeHeight]}
          scale={scale}
        />

        <Tile3D
          x={tile[0] + 1}
          y={tile[1]}
          position={[planeWidth * scale, 0, 0]}
          zoom={zoom}
          size={[planeWidth, planeHeight]}
          scale={scale}
        />

        <Tile3D
          x={tile[0]}
          y={tile[1] + 1}
          position={[0, -planeHeight * scale, 0]}
          zoom={zoom}
          size={[planeWidth, planeHeight]}
          scale={scale}
        />

        <Tile3D
          x={tile[0] + 1}
          y={tile[1] + 1}
          position={[planeWidth * scale, -planeHeight * scale, 0]}
          zoom={zoom}
          size={[planeWidth, planeHeight]}
          scale={scale}
        />

        <Tile3D
          x={tile[0] - 1}
          y={tile[1]}
          position={[-planeWidth * scale, 0, 0]}
          zoom={zoom}
          size={[planeWidth, planeHeight]}
          scale={scale}
        />

        <Tile3D
          x={tile[0] - 1}
          y={tile[1] + 1}
          position={[-planeWidth * scale, -planeHeight * scale, 0]}
          zoom={zoom}
          size={[planeWidth, planeHeight]}
          scale={scale}
        />

        <Tile3D
          x={tile[0]}
          y={tile[1] - 1}
          position={[0, planeHeight * scale, 0]}
          zoom={zoom}
          size={[planeWidth, planeHeight]}
          scale={scale}
        />

        <Tile3D
          x={tile[0] - 1}
          y={tile[1] - 1}
          position={[-planeWidth * scale, planeHeight * scale, 0]}
          zoom={zoom}
          size={[planeWidth, planeHeight]}
          scale={scale}
        />

        <Tile3D
          x={tile[0] - 1}
          y={tile[1]}
          position={[-planeWidth * scale, 0, 0]}
          zoom={zoom}
          size={[planeWidth, planeHeight]}
          scale={scale}
        />

        <Tile3D
          x={tile[0] + 1}
          y={tile[1] - 1}
          position={[planeWidth * scale, planeHeight * scale, 0]}
          zoom={zoom}
          size={[planeWidth, planeHeight]}
          scale={scale}
        />

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
            zoom
          );
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

        <CameraController />
      </Canvas>
    </>
  );
}
