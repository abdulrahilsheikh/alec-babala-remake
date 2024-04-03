import { Fragment, useState } from "react";
import MiniMap from "../map/mini-map";
import style from "./mini-map-mobile.module.scss";
import { IMapItem } from "../layout/layout";
type Props = {
  mapPos: { currentPos: { x: number; y: number } };
  scale: { height: number; width: number };
  onMapClick: (data: any, bool: any) => void;
  changeSection: (index: number) => void;
  sections: IMapItem[];
  activeSection: string;
};

const MiniMapMobile = ({
  mapPos,
  scale,
  onMapClick,
  sections,
  changeSection,
  activeSection,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  return (
    <Fragment>
      <button
        onClick={() => {
          setOpen(true);
        }}
        className={style.map_open_button}
      >
        Map
      </button>
      {open && (
        <div
          onAnimationEnd={() => setReady(true)}
          className={style.map_container}
        >
          <div className={style.map_body}>
            <div className={style.map_header}>
              <button
                className={style.map_close_buton}
                onClick={() => setOpen(!open)}
              >
                <i className={`fa-solid fa-xmark`}></i>
              </button>
              <div className={style.map_title}>Map</div>
            </div>
            <div>
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
      )}
    </Fragment>
  );
};

export default MiniMapMobile;
