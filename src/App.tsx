import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";

import CoffeeBean from "./CoffeeBean";
import "./app.css";

export default function App() {
  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Suspense fallback={null}>
        <CoffeeBean />
      </Suspense>
    </Canvas>
  );
}
