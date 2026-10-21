"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function ReturnToUniverseOnWheel() {
  const router = useRouter();
  const returning = useRef(false);

  useEffect(() => {
    const handleWheel = (event: WheelEvent) => {
      if (event.deltaY > 0 && !returning.current) {
        event.preventDefault();
        event.stopPropagation();
        returning.current = true;
        const slug = window.location.pathname.split("/").filter(Boolean).pop() ?? "summum-3d";
        router.push(`/portfolio?return=${encodeURIComponent(slug)}`);
      }
    };
    window.addEventListener("wheel", handleWheel, { passive: false, capture: true });
    return () => window.removeEventListener("wheel", handleWheel, { capture: true });
  }, [router]);

  return null;
}
