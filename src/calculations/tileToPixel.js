export function tileToPixel(x, y, tileSize) {
  const mapX = x * tileSize;
  const mapY = y * tileSize;
  return { mapX, mapY };
}
