import { useCallback, useRef, useState } from "react";
import style from "./mini-map-desktop.module.scss";

import MiniMap from "../map/mini-map";
type Props = {
  mapPos: { x: number; y: number };
  scale: { height: number; width: number };
  onMapClick: (data: any, bool: any) => void;
  changeSection: (index: number) => void;
  sections: any[];
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

  return (
    <div className={style["map-container"]}>
      <div className={style["canvas-map"]}>
        <div className={style.title}>
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
        <MiniMap
          activeSection={activeSection}
          changeSection={changeSection}
          mapPos={mapPos}
          onMapClick={onMapClick}
          scale={scale}
          sections={sections}
        />
      </div>
    </div>
  );
};

export default MiniMapDesktop;
