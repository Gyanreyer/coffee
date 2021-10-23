import React, { useState, useRef } from "react";

import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";

type GLTFResult = GLTF & {
  nodes: {
    BEAN: THREE.Mesh;
  };
  materials: {
    default: THREE.MeshStandardMaterial;
  };
};

export default function CoffeeBean(props: JSX.IntrinsicElements["group"]) {
  const group = useRef<THREE.Group>();

  const [rotation, setRotation] = useState(0);

  useFrame(() => {
    setRotation((currentRotation) => (currentRotation += 0.01));
  });

  const { nodes, materials } = useGLTF(
    "assets/coffee_bean_v2.gltf"
  ) as GLTFResult;

  return (
    <group
      ref={group}
      dispose={null}
      scale={[0.5, 0.5, 0.5]}
      position={[0, 0, 0]}
      rotation={[1, rotation, 0]}
      {...props}
    >
      <mesh geometry={nodes.BEAN.geometry} material={materials.default} />
    </group>
  );
}

useGLTF.preload("assets/coffee_bean_v2.gltf");
