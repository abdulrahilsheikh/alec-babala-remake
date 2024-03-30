import { useCallback, useRef, useState } from "react";
import style from "./mini-map.module.scss";
import { MapDimension } from "../../constants/size.constants";
type Props = {
  mapPos: { x: number; y: number };
  scale: { height: number; width: number };
  onMapClick: (data: any, bool: any) => void;
  changeSection: (index: number) => void;
  sections: any[];
  activeSection: string;
};
const MiniMap = ({
  mapPos,
  scale,
  onMapClick,
  sections,
  activeSection,
}: Props) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const shiftCanvas = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      const rect = mapRef.current?.getBoundingClientRect();
      const x =
        (e.clientX - (rect?.left || 0) - window.innerWidth / scale.width / 2) *
        -scale.width;
      const y =
        (e.clientY - (rect?.top || 0) - window.innerHeight / scale.height / 2) *
        -scale.height;
      console.log(e.clientX - (rect?.left || 0));

      onMapClick({ movementX: x, movementY: y }, true);
    },
    []
  );
  return (
    <div
      ref={mapRef}
      className={style["map"]}
      style={{ width: MapDimension.width, height: MapDimension.height }}
      onClick={(e) => {
        shiftCanvas(e);
      }}
    >
      {sections.map((item, index) => {
        return (
          <div
            key={index}
            style={{
              position: "absolute",
              left: item.left,
              top: item.top,
              height: item.height,
              width: item.width,
              transition: "background-color 0.35s ease",
              backgroundColor:
                item.id == activeSection
                  ? "#343a40ff"
                  : "rgba(155,155,155,0.25)",
            }}
          ></div>
        );
      })}
      <div
        style={{
          transition: "all 0.15s linear",
          position: "absolute",
          height: window.innerHeight / scale.height,
          width: window.innerWidth / scale.width,
          backgroundColor: "rgba(155,155,155,0.25)",
          transform: `translate(${mapPos.x}px,${mapPos.y}px)`,
        }}
      >
        <div
          style={{
            border: "thin solid black",
            margin: "auto",
            width: "1px",
          }}
        ></div>
      </div>
    </div>
  );
};

export default MiniMap;
