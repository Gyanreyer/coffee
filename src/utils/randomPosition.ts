import { Triplet } from "@react-three/cannon";

type coordinateBounds = [number, number];

const getRandomCoordinate = ([min, max]: coordinateBounds) =>
  min + Math.random() * (max - min);

export default function makeRandomPositions(
  xBounds: coordinateBounds,
  yBounds: coordinateBounds,
  zBounds: coordinateBounds,
  numPositions: number = 1000
): () => Triplet {
  const coordinateCount = numPositions * 3;
  const randomPositions = new Float32Array(coordinateCount);

  for (let i = 0; i < coordinateCount; i += 3) {
    randomPositions[i] = getRandomCoordinate(xBounds);
    randomPositions[i + 1] = getRandomCoordinate(yBounds);
    randomPositions[i + 2] = getRandomCoordinate(zBounds);
  }

  let nextPositionIndex = 0;

  return (): Triplet => {
    const coordinateStartingIndex = nextPositionIndex * 3;

    nextPositionIndex = (nextPositionIndex + 1) % numPositions;

    return [
      randomPositions[coordinateStartingIndex],
      randomPositions[coordinateStartingIndex + 1],
      randomPositions[coordinateStartingIndex + 2],
    ];
  };
}
