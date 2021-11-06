import React from "react";

// Hook creates a ref whose value is set once initially and is then never
// changed again. This is helpful for setting up static values that should
// be unique for a component instance and persist across that component's lifecycle
export default function useRefWithLazyInitializedValue<T>(
  getRefValue: () => T
) {
  const ref: React.MutableRefObject<T> = React.useRef();
  if (ref.current === undefined) {
    ref.current = getRefValue();
  }

  return ref;
}
