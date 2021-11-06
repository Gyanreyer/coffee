import React, { useEffect, useRef } from "react";

import * as THREE from "three";
import { GroupProps, useFrame, useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { GLTF } from "three-stdlib";

import useRefWithLazyInitializedValue from "./utils/useRefWithLazyInitializedValue";

// If the user prefers reduced motion, we'll set things up to just have the beans
// statically sit in place rather than animating them falling
const prefersReducedMotion = window.matchMedia(
  "(prefers-reduced-motion)"
).matches;

type GLTFResult = GLTF & {
  nodes: {
    BEAN: THREE.Mesh;
  };
  materials: {
    default: THREE.MeshStandardMaterial;
  };
};

const startingPositionMinX = -1;
const startingPositionMaxX = 1;

const startingPositionMinY = 1.1;
const startingPositionMaxY = 3.3;

const bottomYPosition = -1.1;

const startingPositionMinZ = -120;
const startingPositionMaxZ = -80;

const getRandomValueInRange = (min: number, max: number): number =>
  min + Math.random() * (max - min);

const getRandomStartingScreenPosition = (isInitialPosition = true) => {
  let yPosition;

  if (prefersReducedMotion) {
    yPosition = getRandomValueInRange(-1, 1);
  } else if (isInitialPosition) {
    yPosition = getRandomValueInRange(
      startingPositionMinY,
      startingPositionMaxY
    );
  } else {
    yPosition = startingPositionMinY;
  }

  return new THREE.Vector3(
    getRandomValueInRange(startingPositionMinX, startingPositionMaxX),
    yPosition,
    -1
  );
};

const getRandomStartingWorldPositionZ = () =>
  getRandomValueInRange(startingPositionMinZ, startingPositionMaxZ);

const getRandomStartingRotationEuler = () =>
  new THREE.Euler(
    getRandomValueInRange(0, Math.PI * 2),
    getRandomValueInRange(0, Math.PI * 2),
    getRandomValueInRange(0, Math.PI * 2)
  );

const getRandomScreenVelocityVector = () =>
  prefersReducedMotion
    ? new THREE.Vector3(0, 0, 0)
    : new THREE.Vector3(
        getRandomValueInRange(-0.15, 0.15),
        getRandomValueInRange(-0.85, -0.8),
        0
      );

const getRandomWorldPositionZVelocity = () =>
  prefersReducedMotion ? 0 : getRandomValueInRange(-0.15, 0.15);

const getRandomAngularVelocityVector = () =>
  prefersReducedMotion
    ? new THREE.Vector3(0, 0, 0)
    : new THREE.Vector3(
        getRandomValueInRange(-3, 3),
        getRandomValueInRange(-3, 3),
        getRandomValueInRange(-3, 3)
      );

export default function CoffeeBean(props: GroupProps) {
  const { camera } = useThree();

  const { nodes, materials } = useGLTF(
    "assets/coffee_bean_v2.gltf"
  ) as GLTFResult;

  const groupRef: React.RefObject<THREE.Group> = useRef();

  // Screen position manages the projected x and y positions of the bean on the screen
  // We're doing things this way so we can ensure our random positions will always be
  // placed within the bounds of the camera's view at any window size
  const screenPositionRef = useRefWithLazyInitializedValue(
    getRandomStartingScreenPosition
  );
  // Z position is handled independently from the screen position
  // since screen position can only deal with x and y coordinates projected
  // onto the 2D screen
  const worldPositionZRef = useRefWithLazyInitializedValue(
    getRandomStartingWorldPositionZ
  );

  // Set up velocities for the bean's position and rotation; these are immutable
  const screenVelocityVectorRef: React.RefObject<THREE.Vector3> =
    useRefWithLazyInitializedValue(getRandomScreenVelocityVector);

  const worldPositionZVelocityRef: React.RefObject<number> =
    useRefWithLazyInitializedValue(getRandomWorldPositionZVelocity);

  const angularVelocityVectorRef: React.RefObject<THREE.Vector3> =
    useRefWithLazyInitializedValue(getRandomAngularVelocityVector);

  useEffect(() => {
    // Set an initial rotation on the bean
    groupRef.current.setRotationFromEuler(getRandomStartingRotationEuler());
  }, []);

  useFrame((state, deltaTime) => {
    // If the document isn't visible (ie, the window is minimized or the user is on a different tab),
    // skip performing any updates to save wasted operations and to avoid positions getting weirdly
    // bunched up and out of sync
    if (document.visibilityState !== "visible") return;

    if (screenPositionRef.current.y < bottomYPosition) {
      // If the bean's position is below the bottom of the screen,
      // reset it to just above the top of the screen with new random
      // x and z positions
      screenPositionRef.current = getRandomStartingScreenPosition(false);
      worldPositionZRef.current = getRandomStartingWorldPositionZ();
    } else {
      // If the bean is still on the screen, shift its position by our position velocities
      // Scaling velocities by delta time to keep movement framerate-independent
      screenPositionRef.current.add(
        screenVelocityVectorRef.current.clone().multiplyScalar(deltaTime)
      );
      worldPositionZRef.current +=
        worldPositionZVelocityRef.current * deltaTime;
    }

    // Let's make the bean's world position match its screen position!

    // Un-project the screen position back into an X,Y world position.
    // This gets us close, but we still need to get its Z position set correctly and this requires some extra work.
    const screenPositionProjectedToWorldPosition = screenPositionRef.current
      .clone()
      .unproject(camera);

    // Get a normal vector pointing from the camera to our un-projected world position
    const normalVectorPointingFromCameraToWorldPosition =
      screenPositionProjectedToWorldPosition.sub(camera.position).normalize();

    // Calculate what the world position's distance from the camera should be.
    // We can multiply this by our normal vector to get our final world position relative to the camera's position!
    const distanceFromCamera =
      (worldPositionZRef.current - camera.position.z) /
      normalVectorPointingFromCameraToWorldPosition.z;

    // Multiply the normal vector by the distance to get the world position relative to the camera's position,
    // then add the camera's position to get our final world position
    const worldPosition = normalVectorPointingFromCameraToWorldPosition
      .multiplyScalar(distanceFromCamera)
      .add(camera.position);

    // Set the bean's position to this world position vector
    groupRef.current.position.copy(worldPosition);

    // Modify the rotation by our angular velocity
    groupRef.current.rotation.set(
      groupRef.current.rotation.x +
        angularVelocityVectorRef.current.x * deltaTime,
      groupRef.current.rotation.y +
        angularVelocityVectorRef.current.y * deltaTime,
      groupRef.current.rotation.z +
        angularVelocityVectorRef.current.z * deltaTime
    );
  });

  return (
    <group ref={groupRef} dispose={null} {...props}>
      <mesh geometry={nodes.BEAN.geometry} material={materials.default} />
    </group>
  );
}

useGLTF.preload("assets/coffee_bean_v2.gltf");
