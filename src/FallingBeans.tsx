import React, { useEffect, useMemo, useState } from "react";
import { useThree } from "@react-three/fiber";
import { Physics, Triplet } from "@react-three/cannon";

import CoffeeBean from "./CoffeeBean";
import makeRandomPositions from "./utils/randomPosition";

const coffeeBeanCount = 500;

const beanCountArray = new Array(coffeeBeanCount);
for (let i = 0; i < coffeeBeanCount; i += 1) {
  beanCountArray[i] = i;
}

export default function FallingBeans() {
  const { viewport } = useThree();
  // The bean should be scaled to 1% of the viewport's width

  const getNextPosition = useMemo(
    () =>
      makeRandomPositions(
        [-1.5 * viewport.width, 1.5 * viewport.width],
        [2 * viewport.height, 8 * viewport.height],
        [-viewport.width / 2, -viewport.width]
      ),
    [viewport.width, viewport.height]
  );

  const beanScale: Triplet = useMemo(() => {
    const scale = viewport.width / 100;
    return [scale, scale, scale];
  }, [viewport.width]);

  const beanVelocity: Triplet = useMemo(
    () => [0, -viewport.height, 0],
    [viewport.height]
  );

  return (
    <Physics size={coffeeBeanCount}>
      {beanCountArray.map((beanIndex) => (
        <CoffeeBean
          key={beanIndex}
          position={getNextPosition()}
          getNextPosition={getNextPosition}
          rotation={[
            Math.random() * 2 * Math.PI,
            Math.random() * 2 * Math.PI,
            Math.random() * 2 * Math.PI,
          ]}
          scale={beanScale}
          velocity={beanVelocity}
          minYPosition={-viewport.height * 2}
        />
      ))}
    </Physics>
  );
}
