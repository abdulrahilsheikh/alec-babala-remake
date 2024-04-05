import { useContext, useRef } from "react";
import { MapDimension } from "../../constants/size.constants";
import { useMobileView } from "../../hooks/use-mobile-view";
import style from "./mini-map.module.scss";
import { LayoutContext } from "../layout/layout.context";
import { IMapItem } from "../layout/layout";
type Props = {
  mapPos: { currentPos: { x: number; y: number } };
  scale: { height: number; width: number };
  onMapClick: (data: any, bool: any) => void;
  changeSection: (index: number) => void;
  sections: IMapItem[];
  activeSection: string;
};
const MiniMap = ({
  mapPos,
  scale,
  onMapClick,
  sections,
  activeSection,
}: Props) => {
  const { mapBoxRef }: any = useContext(LayoutContext);
  const mapRef = useRef<HTMLDivElement>(null);
  const isMobileView = useMobileView();
  const shiftCanvas = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = mapRef.current?.getBoundingClientRect();
    const x =
      (e.clientX - (rect?.left || 0) - mapPos.currentPos.x) * -scale.width +
      window.innerWidth / 2;
    const y =
      (e.clientY - (rect?.top || 0) - mapPos.currentPos.y) * -scale.height +
      window.innerHeight / 2;

    onMapClick({ movementX: x, movementY: y }, true);
  };

  return (
    <div
      ref={mapRef}
      className={style["map"]}
      style={{ width: MapDimension.width, height: MapDimension.height }}
      onClick={(e) => {
        if (isMobileView) return;
        shiftCanvas(e);
      }}
      onPointerDown={(e) => {
        if (!isMobileView) return;

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
        ref={(ref) => (mapBoxRef.current = ref)}
        style={{
          transition: "all 0.15s linear",
          position: "absolute",
          height: window.innerHeight / scale.height,
          width: window.innerWidth / scale.width,
          backgroundColor: "rgba(155,155,155,0.25)",
          // transform: `translate(${mapPos.x}px,${mapPos.y}px)`,
        }}
      >
        {/* <div
          style={{
            border: "thin solid black",
            margin: "auto",
            width: "1px",
            height: "100%",
          }}
        ></div> */}
      </div>
    </div>
  );
};

export default MiniMap;
