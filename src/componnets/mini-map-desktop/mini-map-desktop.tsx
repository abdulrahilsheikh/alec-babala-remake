import { useState } from "react";
import style from "./mini-map-desktop.module.scss";

import MiniMap from "../map/mini-map";
import { IMapItem } from "../layout/layout";
type Props = {
  mapPos: { currentPos: { x: number; y: number } };
  scale: { height: number; width: number };
  onMapClick: (data: any, bool: any) => void;
  changeSection: (index: number) => void;
  sections: IMapItem[];
  activeSection: string;
};
const MiniMapDesktop = ({
  mapPos,
  scale,
  onMapClick,
  sections,
  changeSection,
  activeSection,
}: Props) => {
  const [open, setOpen] = useState(true);
  const [ready, setReady] = useState(false);
  return (
    <div
      onAnimationEnd={() => setReady(true)}
      className={style["map-container"]}
    >
      <div className={style["canvas-map"]}>
        <div className={style.header_title}>
          <button className={style.button} onClick={() => setOpen(!open)}>
            <i
              className={`fa-solid fa-chevron-down ${open ? style.open : ""}`}
            ></i>
          </button>
          <div className={style.text}>
            rahil.sheikh / <span>{activeSection}</span>
          </div>
          <button className={style.button} onClick={() => changeSection(-1)}>
            <i className={`fa-solid fa-chevron-left `}></i>
          </button>
          <button className={style.button} onClick={() => changeSection(1)}>
            <i className={`fa-solid fa-chevron-right `}></i>
          </button>
        </div>
        <div
          className={style.mini_map_area}
          style={{
            maxHeight: open ? 500 : 0,
            opacity: open ? 1 : 0,
            transition: `max-height .3s ease`,
          }}
        >
          <MiniMap
            activeSection={activeSection}
            changeSection={ready ? changeSection : () => {}}
            mapPos={mapPos}
            onMapClick={onMapClick}
            scale={scale}
            sections={sections}
          />
        </div>
      </div>
    </div>
  );
};

export default MiniMapDesktop;
