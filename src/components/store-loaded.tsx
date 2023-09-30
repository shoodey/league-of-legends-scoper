"use client";

import { useStore } from "../lib/store";

export interface StoreLoadedProps {
  children: React.ReactNode;
}

export const StoreLoaded = (props: StoreLoadedProps) => {
  const hydrated = useStore((state) => state._hydrated);

  if (!hydrated) {
    return <>Loading...</>;
  }

  return <>{props.children}</>;
};

export default StoreLoaded;
