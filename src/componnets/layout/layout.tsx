import React, { useEffect, useRef, useState } from "react";
import data from "../../constants/content-data";
import { CanvasDimension, scale } from "../../constants/size.constants";
import MiniMapDesktop from "../mini-map-desktop/mini-map-desktop";
import SectionStack from "../section-stack/section-stack";
import { IContent } from "../section-stack/section-stack.types";
import { LayoutContext } from "./layout.context";
import { positionCalculator } from "./layout.helper";
import style from "./layout.module.scss";
import { useMobileView } from "../../hooks/use-mobile-view";
import MiniMapMobile from "../mini-map-mobile/mini-map-mobile";
import NotificationWrapper from "../notification-wrapper/notification-wrapper";
import { notifiactionData } from "../../constants/notifications-data";

export interface IPosition {
  x: number;
  y: number;
}

const Layout = () => {
  const [canvasPos, setCanvasPos] = useState<IPosition>({
    x: Math.abs(window.innerWidth / 2) * -1,
    y: Math.abs(window.innerHeight / 2) * -1,
  });
  const isMobileView = useMobileView();
  const [renderMap, setRenderMap] = useState(false);
  const [mapPos, setMapPos] = useState<IPosition>({ x: 0, y: 0 });
  const [notifications, setNotifications] = useState({});

  const [content, setContent] = useState<IContent[]>([]);

  const [mapItems, setMapItems] = useState<any[]>([]);
  const [sectionList, setSectionList] = useState<any[]>([]);

  const mouseInitialPos = useRef<null | { initX: number; initY: number }>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<any>();

  const onMouseMove = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    onClick = false
  ) => {
    if (!mouseInitialPos.current && !onClick) return;

    const position = positionCalculator(
      canvasPos,
      event,
      CanvasDimension,
      window
    );
    const newMapPos = {
      x: (position.x / scale.width) * -1,
      y: (position.y / scale.height) * -1,
    };
    setCanvasPos(position);
    setMapPos(newMapPos);
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const movementX = e.touches[0].clientX - mouseInitialPos.current?.initX!;
    const movementY = e.touches[0].clientY - mouseInitialPos.current?.initY!;

    mouseInitialPos.current!.initX! = e.touches[0].clientX;
    mouseInitialPos.current!.initY! = e.touches[0].clientY;

    onMouseMove({ movementX, movementY } as any);
  };
  const changeSection = (mapItems: any, to: number) => {
    let newSectionList: any = [];
    const poped = sectionList.splice(to, to > 0 ? sectionList.length - to : 1);
    newSectionList = [...poped, ...sectionList];
    focusItem(newSectionList[0], mapItems);
    setSectionList(newSectionList);
  };

  const focusItem = (section: any, mapItems: any) => {
    const positionToFocus = mapItems.find(
      (item: any) => item.id == section && item.isZoneCenter
    );

    const position = {
      x: (positionToFocus.centerX - window.innerWidth / 2) * -1,
      y: (positionToFocus.centerY - window.innerHeight / 2) * -1,
    };
    setCanvasPos(position);
    setMapPos({
      x: (position.x / scale.width) * -1,
      y: (position.y / scale.height) * -1,
    });
  };
  useEffect(() => {
    document.addEventListener("mouseup", () => {
      mouseInitialPos.current = null;
    });
    document.addEventListener("touchend", () => {
      mouseInitialPos.current = null;
    });
  }, []);

  const generateMiniMap = () => {
    const list = [];
    for (let index = 0; index < content.length!; index++) {
      const element =
        contentRef.current?.children[index]?.getBoundingClientRect();
      const dataItem: any = content[index];
      list.push({
        left: dataItem?.position.x! / scale.width,
        top: dataItem?.position.y! / scale.height,
        height: element?.height! / scale.height,
        width: element?.width! / scale.width,
        centerX: element?.width! / 2 + dataItem?.position.x!,
        centerY: element?.height! / 2 + dataItem?.position.y!,
        isZoneCenter: dataItem.isZoneCenter || false,
        id: dataItem.link,
      });
    }
    return list;
  };
  const updateMapItem = (index: number) => {
    if (!contentRef.current || !mapItems.length) return;

    const element =
      contentRef.current?.children[index]?.getBoundingClientRect();
    setMapItems((prev) => {
      prev[index].height = element?.height! / scale.height;
      return [...prev];
    });
  };

  const getContent = async () => {
    const response: any = data;
    const notifications = notifiactionData;
    const uniqueLinks: any = new Set();
    response.forEach((item: any) => {
      if (item.link) {
        uniqueLinks.add(item.link);
      }
    });

    setSectionList([...uniqueLinks]);
    setContent(response);
    setNotifications(notifications);
  };

  useEffect(() => {
    if (!contentRef.current || !content.length || !renderMap) return;
    const map = generateMiniMap();
    setMapItems(map);

    focusItem(sectionList[0], map);
  }, [contentRef.current, content, renderMap]);

  const updateZoneList = (zone: string) => {
    const list = sectionList;
    const index = list.findIndex((item) => item == zone);
    if (index >= 0) {
      const item = list.splice(index, 1);
      setSectionList([item, ...list]);
    }
  };

  const updateClosestZone = () => {
    let closestDistance = Infinity;
    let closestZone = null;

    Array.from(contentRef.current?.children!)?.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const windowCenterX = window.innerWidth / 2;
      const windowCenterY = window.innerHeight / 2;
      let distanceX = 0;
      let distanceY = 0;

      if (centerX > windowCenterX && centerY < windowCenterY) {
        if (rect.left > window.innerWidth || rect.bottom < 0) return;
      }
      if (centerX < windowCenterX && centerY < windowCenterY) {
        if (rect.right < 0 || rect.bottom < 0) return;
      }
      if (centerX < windowCenterX && centerY > windowCenterY) {
        if (rect.right < 0 || rect.top > window.innerHeight) return;
      }
      if (centerX > windowCenterX && centerY > windowCenterY) {
        if (rect.left > window.innerWidth || rect.top > window.innerHeight)
          return;
      }

      distanceX = Math.abs(centerX - windowCenterX);
      distanceY = Math.abs(centerY - windowCenterY);

      const distance = Math.sqrt(
        Math.abs(Math.pow(distanceX, 2) - Math.pow(distanceY, 2))
      );

      if (distance < closestDistance) {
        closestZone = item.getAttribute("data-zone");
        closestDistance = distance;
      }
    });

    if (sectionList[0] != closestZone && closestZone) {
      updateZoneList(closestZone);
    }
  };

  const updatemapVisibility = () => {
    setRenderMap(true);
  };

  useEffect(() => {
    if (!renderMap) return;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      updateClosestZone();
    }, 450);
  }, [contentRef.current, canvasPos]);

  useEffect(() => {
    getContent();
  }, []);

  return (
    <LayoutContext.Provider
      value={{
        changeSection: (index: number) => changeSection(mapItems, index),
        sectionList,
        updatemapVisibility,
      }}
    >
      {renderMap ? (
        <>
          {isMobileView ? (
            <MiniMapMobile
              activeSection={sectionList[0]}
              mapPos={mapPos}
              scale={scale}
              onMapClick={onMouseMove}
              sections={mapItems}
              changeSection={(index) => changeSection(mapItems, index)}
            />
          ) : (
            <MiniMapDesktop
              activeSection={sectionList[0]}
              mapPos={mapPos}
              scale={scale}
              onMapClick={onMouseMove}
              sections={mapItems}
              changeSection={(index) => changeSection(mapItems, index)}
            />
          )}
        </>
      ) : null}

      {!isMobileView && renderMap && (
        <NotificationWrapper
          notifications={notifications[sectionList[0]] || []}
        />
      )}
      {/* <div
        style={{
          position: "fixed",
          left: window.innerWidth / 2,
          top: 0,
          height: "100vh",
          borderLeft: "thin solid black",
          zIndex: 1000,
        }}
      ></div> */}
      <div>
        <div
          className={style.layout}
          onMouseDown={(e) => {
            mouseInitialPos.current = { initX: e.clientX, initY: e.clientY };
          }}
          onMouseMove={(e) => {
            onMouseMove(e);
          }}
          onPointerDown={(e) => {
            mouseInitialPos.current = { initX: e.clientX, initY: e.clientY };
          }}
          onTouchMove={(e) => {
            onTouchMove(e);
          }}
        >
          <div
            ref={contentRef}
            className={`${style.canvas} ${style["dashed-grid-paper"]}`}
            style={{
              width: CanvasDimension.width,
              height: CanvasDimension.height,
              maxWidth: CanvasDimension.width,
              maxHeight: CanvasDimension.height,
              transform: `translate(${canvasPos.x}px,${canvasPos.y}px)`,
            }}
          >
            <SectionStack updateMapItem={updateMapItem} data={content} />
          </div>
        </div>
      </div>
    </LayoutContext.Provider>
  );
};

export default Layout;
