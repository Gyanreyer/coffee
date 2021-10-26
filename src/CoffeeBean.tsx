import React, { useState, useRef, useEffect } from "react";

import * as THREE from "three";
import { GroupProps, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";
import { useParticle, ParticleProps, Triplet } from "@react-three/cannon";

type GLTFResult = GLTF & {
  nodes: {
    BEAN: THREE.Mesh;
  };
  materials: {
    default: THREE.MeshStandardMaterial;
  };
};

type CoffeeBeanProps = ParticleProps &
  GroupProps & {
    getNextPosition: () => Triplet;
    minYPosition: number;
  };

export default function CoffeeBean({
  getNextPosition,
  scale,
  minYPosition,
  ...props
}: CoffeeBeanProps) {
  const [ref, api] = useParticle(() => ({
    angularVelocity: props.rotation,
    type: "Kinematic",
    ...props,
  }));

  const { viewport } = useThree();
  // The bean should be scaled to 1% of the viewport's width
  const viewportRelativeScale = viewport.width / 100;

  const { nodes, materials } = useGLTF(
    "assets/coffee_bean_v2.gltf"
  ) as GLTFResult;

  useEffect(() => {
    const unsubscribePosition = api.position.subscribe(([x, y, z]) => {
      if (y < minYPosition) {
        api.position.set(...getNextPosition());
      }
    });

    return unsubscribePosition;
  }, [getNextPosition, minYPosition]);

  return (
    <group ref={ref} dispose={null} scale={scale}>
      <mesh geometry={nodes.BEAN.geometry} material={materials.default} />
    </group>
  );
}

useGLTF.preload("assets/coffee_bean_v2.gltf");
