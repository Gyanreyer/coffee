import React from "react";
import { useThree } from "@react-three/fiber";

import CoffeeBean from "./CoffeeBean";

let beanCountArray = new Array();

export default function FallingBeans() {
  const { size } = useThree();

  const beanCount = Math.floor((size.width * size.height) / 10000);
  if (beanCount !== beanCountArray.length) {
    beanCountArray = new Array(beanCount);
    beanCountArray.fill(null);
  }

  return (
    <>
      {beanCountArray.map((_, index) => (
        <CoffeeBean key={index} />
      ))}
    </>
  );
}
