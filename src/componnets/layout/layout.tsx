import React, { useCallback, useEffect, useRef, useState } from "react";
import style from "./layout.module.scss";
import DataHolder from "../data-holder/data-holder";
import MiniMap from "../map/mini-map";

const CanvasDimension = {
  width: 3600,
  height: 2200,
};
const MapDimension = {
  width: 20 * 16,
  height: 12 * 16,
};

const scale = {
  width: CanvasDimension.width / MapDimension.width,
  height: CanvasDimension.height / MapDimension.height,
};
interface IPosition {
  x: number;
  y: number;
}
const Layout = () => {
  const [canvasPos, setCanvasPos] = useState<IPosition>({ x: 0, y: 0 });
  const [mapPos, setMapPos] = useState<IPosition>({ x: 0, y: 0 });
  const isMouseDown = useRef(false);
  const positionCalculator = useCallback(
    (initialPos: IPosition, event: any, refernce: any, window: any) => {
      const position = {
        x: initialPos.x + event.movementX,
        y: initialPos.y + event.movementY,
      };
      if (position.x >= 0) {
        position.x = 0;
      }
      if (position.y >= 0) {
        position.y = 0;
      }
      if (Math.abs(position.x) >= refernce.width - window.innerWidth) {
        position.x = (refernce.width - window.innerWidth) * -1;
      }
      if (Math.abs(position.y) >= refernce.height - window.innerHeight) {
        position.y = (refernce.height - window.innerHeight) * -1;
      }
      return position;
    },
    []
  );
  const contentRef = useRef<HTMLDivElement>(null);
  const onMouseMove = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    onClick?: false
  ) => {
    if (!isMouseDown.current && !onClick) return;
    const position = positionCalculator(
      canvasPos,
      event,
      CanvasDimension,
      window
    );

    const newMapPos = {
      x: Math.abs(position.x / scale.width),
      y: Math.abs(position.y / scale.height),
    };
    setCanvasPos(position);
    setMapPos(newMapPos);
  };

  useEffect(() => {
    if (contentRef.current) {
      console.log(contentRef.current);
    }
  }, [contentRef.current]);

  useEffect(() => {
    document.addEventListener("mouseup", () => {
      isMouseDown.current = false;
    });
  }, []);
  return (
    <>
      <MiniMap mapPos={mapPos} scale={scale} onMapClick={onMouseMove} />
      <div
        className={style.layout}
        onMouseDown={(e) => {
          isMouseDown.current = true;
        }}
        onMouseMove={onMouseMove}
      >
        <div
          ref={contentRef}
          className={style.canvas}
          style={{
            width: CanvasDimension.width,
            height: CanvasDimension.height,
            transform: `translate(${canvasPos.x}px,${canvasPos.y}px)`,
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <DataHolder />
        </div>
      </div>
    </>
  );
};

export default Layout;
