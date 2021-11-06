import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";

import FallingBeans from "./FallingBeans";
import "./app.css";

export default function App() {
  return (
    <>
      <h1 className="heading">coffee</h1>
      <Canvas dpr={[1, 2]} mode="concurrent" className="fallingBeansCanvas">
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Suspense fallback={null}>
          <FallingBeans />
        </Suspense>
      </Canvas>
    </>
  );
}
