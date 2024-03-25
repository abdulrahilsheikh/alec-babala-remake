import { useCallback, useRef, useState } from "react";
import style from "./mini-map.module.scss";
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
  changeSection,
  activeSection,
}: Props) => {
  const [open, setOpen] = useState(true);
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
        <div className={style.title}>
          <button className={style.button} onClick={() => setOpen(!open)}>
            <i
              className={`fa-solid fa-chevron-down ${open ? style.open : ""}`}
            ></i>
          </button>
          <div className={style.text}>rahil.sheikh / {activeSection}</div>
          <button className={style.button} onClick={() => changeSection(1)}>
            <i className={`fa-solid fa-chevron-left  `}></i>
          </button>
          <button className={style.button} onClick={() => changeSection(-1)}>
            <i className={`fa-solid fa-chevron-right `}></i>
          </button>
        </div>
        <div
          ref={mapRef}
          className={style["map"]}
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
              transition: "all 0.25s linear",
              position: "absolute",
              height: window.innerHeight / scale.height,
              width: window.innerWidth / scale.width,
              backgroundColor: "rgba(155,155,155,0.25)",
              transform: `translate(${mapPos.x}px,${mapPos.y}px)`,
            }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default MiniMap;
