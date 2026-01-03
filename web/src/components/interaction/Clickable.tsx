import { useMemo, useState } from "react";
import * as THREE from "three";

export type ClickableProps = {
  href?: string;
  position: [number, number, number];
  size: [number, number, number];
  opacity?: number;
  baseColor?: string;
  emissiveColor?: string;
  emissiveIntensity?: number;
  hoverEmissiveIntensity?: number;
  hoverScale?: number;
  openInNewTab?: boolean;
  onActivate?: () => void;
  onClick?: () => void;       // ✅ new: overrides navigation
};

export function Clickable({
  href,
  position,
  size,
  opacity = 0.12,
  baseColor = "#ffffff",
  emissiveColor = "#ffffff",
  emissiveIntensity = 0.2,
  hoverEmissiveIntensity = 1.2,
  hoverScale = 1.15,
  openInNewTab = true,
  onActivate,
  onClick,
}: ClickableProps) {
  const [hovered, setHovered] = useState(false);

  // Material created once unless deps change
  const material = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      transparent: opacity < 1,
      opacity,
      color: new THREE.Color(baseColor),
      emissive: new THREE.Color(emissiveColor),
      emissiveIntensity,
      depthWrite: false,
    });
  }, [opacity, baseColor, emissiveColor, emissiveIntensity]);

  // Update emissive intensity on hover (cheap, no re-creation)
  material.emissiveIntensity = hovered
    ? hoverEmissiveIntensity
    : emissiveIntensity;

  const scale: [number, number, number] = hovered
    ? [hoverScale, hoverScale, hoverScale]
    : [1, 1, 1];

  return (
    <mesh
      position={position}
      scale={scale}
      rotation={[0, Math.PI / 4, 0]}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
      onClick={(e) => {
        e.stopPropagation();
      
        // Keep your existing "analytics/state" callback
        onActivate?.();
      
        // ✅ If parent supplies a click handler, we do SPA navigation (or anything) there
        if (onClick) {
          onClick();
          return;
        }
      
        // Otherwise we fall back to link behavior
        if (!href) return;
      
        if (openInNewTab) {
          window.open(href, "_blank", "noopener,noreferrer");
        } else {
          window.location.href = href;
        }
      }}
    >
      <boxGeometry args={size} />
      <primitive object={material} attach="material" />
    </mesh>
  );
}
