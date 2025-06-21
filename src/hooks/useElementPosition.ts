"use client";

import { useRef, useState, useEffect } from "react";

export function useElementPosition() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  useEffect(() => {
    if (!ref.current) return;

    const updatePosition = () => {
      if (!ref.current) return;
      
      const { top, left, width, height } = ref.current.getBoundingClientRect();
      setPosition({ top, left, width, height });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, []);

  return [position, ref] as const;
}
