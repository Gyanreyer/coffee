import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";

import FallingBeans from "./FallingBeans";
import "./app.css";

export default function App() {
  return (
    <Canvas dpr={[1, 2]} mode="concurrent">
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Suspense fallback={null}>
        <FallingBeans />
      </Suspense>
    </Canvas>
  );
}
