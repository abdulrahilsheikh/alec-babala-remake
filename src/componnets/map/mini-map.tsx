import { BaseSyntheticEvent, useCallback, useRef } from "react";
import style from "./mini-map.module.scss";
type Props = {
  mapPos: { x: number; y: number };
  scale: { height: number; width: number };
  onMapClick: (data: any, bool: any) => void;
};
const MiniMap = ({ mapPos, scale, onMapClick }: Props) => {
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
    <div className={style["map-container"]}>
      <div className={style["canvas-map"]}>
        <div className={style.title}>rahil.sheikh / stories</div>
        <div
          ref={mapRef}
          className={style["map"]}
          onClick={(e) => {
            shiftCanvas(e);
          }}
        >
          <div
            style={{
              position: "absolute",
              left: 725 / scale.width,
              top: 298 / scale.height,
              height: 430 / scale.height,
              width: 360 / scale.width,
              backgroundColor: "rgba(0,0,0,0.25)",
            }}
          ></div>
          <div
            style={{
              transition: "all 0.25s linear",
              position: "absolute",
              left: mapPos.x,
              top: mapPos.y,
              height: window.innerHeight / scale.height,
              width: window.innerWidth / scale.width,
              backgroundColor: "rgba(0,0,0,0.25)",
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default MiniMap;
