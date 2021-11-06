import React from "react";
import { useThree } from "@react-three/fiber";

import CoffeeBean from "./CoffeeBean";

const beanCountArray = new Array();

export default function FallingBeans() {
  const { size } = useThree();

  const oldBeanCount = beanCountArray.length;
  beanCountArray.length = Math.floor((size.width * size.height) / 10000);

  if (oldBeanCount < beanCountArray.length) {
    // Ensure we fill in all of the new slots in the array so they won't be skipped
    // by beanCountArray.map()
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
