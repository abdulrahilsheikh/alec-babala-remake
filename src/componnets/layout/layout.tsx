import React, { useCallback, useEffect, useRef, useState } from "react";
import data from "../../constants/content-data";
import { notifiactionData } from "../../constants/notifications-data";
import { CanvasDimension, scale } from "../../constants/size.constants";
import { useMobileView } from "../../hooks/use-mobile-view";
import MiniMapDesktop from "../mini-map-desktop/mini-map-desktop";
import MiniMapMobile from "../mini-map-mobile/mini-map-mobile";
import NotificationWrapper from "../notification-wrapper/notification-wrapper";
import SectionStack from "../section-stack/section-stack";
import { IContent } from "../section-stack/section-stack.types";
import { LayoutContext } from "./layout.context";
import { positionCalculator } from "./layout.helper";
import style from "./layout.module.scss";
import { useNavigate, useParams } from "react-router-dom";
import MobileViewController from "../mobile-view-controller/mobile-view-controller";
import Loader from "../loader/loader";

export interface IPosition {
  x: number;
  y: number;
}
export interface IMapItem {
  left: number;
  top: number;
  height: number;
  width: number;
  centerX: number;
  centerY: number;
  isZoneCenter: boolean;
  id: string;
}

const Layout = () => {
  const [loading, setLoading] = useState(false);
  const isMobileView = useMobileView();
  const [renderMap, setRenderMap] = useState(false);
  const [notifications, setNotifications] = useState({});
  const [activeSectionIndex, setActiveSectionIndex] = useState(-1);
  const [content, setContent] = useState<IContent[]>([]);
  const [itemIndex, setItemIndex] = useState(0);
  const [mapItems, setMapItems] = useState<IMapItem[]>([]);
  const [sectionList, setSectionList] = useState<string[]>([]);

  const mouseInitialPos = useRef<null | { initX: number; initY: number }>(null);

  const contentRef = useRef<HTMLDivElement>(null);
  const mapBoxRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<any>();
  const canvasPosRef = useRef({
    currentPos: { x: 0, y: 0 },
    nextPos: { x: 0, y: 0 },
  });
  const mapPosRef = useRef({
    currentPos: { x: 0, y: 0 },
  });

  const route = useParams();
  const navigate = useNavigate();

  const onMouseMove = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    onClick = false
  ) => {
    if (!mouseInitialPos.current && !onClick) return;

    const position = positionCalculator(
      canvasPosRef.current.currentPos,
      event,
      CanvasDimension,
      window
    );

    canvasPosRef.current.nextPos = position;
    transitBetweenVal();
  };

  const onTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const movementX = e.touches[0].clientX - mouseInitialPos.current?.initX!;
    const movementY = e.touches[0].clientY - mouseInitialPos.current?.initY!;

    mouseInitialPos.current!.initX! = e.touches[0].clientX;
    mouseInitialPos.current!.initY! = e.touches[0].clientY;

    onMouseMove({ movementX, movementY } as any);
  };

  const runUpdateClosestZone = () => {
    if (!renderMap) return;
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      updateClosestZone();
    }, 450);
  };

  const transitBetweenVal = useCallback(() => {
    const lerp = (x: number, y: number, a: number) => x * (1 - a) + y * a;
    let move = 0.1;
    let frame: any = null;
    window.cancelAnimationFrame(frame);
    const func = () => {
      const x = lerp(
        canvasPosRef.current.currentPos.x,
        canvasPosRef.current.nextPos.x,
        move
      );
      const y = lerp(
        canvasPosRef.current.currentPos.y,
        canvasPosRef.current.nextPos.y,
        move
      );
      move += 0.1;
      if (move > 1) {
        canvasPosRef.current.currentPos = canvasPosRef.current.nextPos;
        mapPosRef.current.currentPos = {
          x: (canvasPosRef.current.nextPos.x / scale.width) * -1,
          y: (canvasPosRef.current.nextPos.y / scale.height) * -1,
        };

        const { x, y } = canvasPosRef.current.currentPos;
        if (mapBoxRef.current) {
          mapBoxRef.current!.style.transform = `translate(${
            (x / scale.width) * -1
          }px,${(y / scale.height) * -1}px)`;
        }

        contentRef.current!.style.transform = `translate(${x}px,${y}px)`;
        runUpdateClosestZone();
        window.cancelAnimationFrame(frame);
        return;
      }

      canvasPosRef.current.currentPos.x = x;
      canvasPosRef.current.currentPos.y = y;
      if (mapBoxRef.current) {
        mapBoxRef.current!.style.transform = `translate(${
          (x / scale.width) * -1
        }px,${(y / scale.height) * -1}px)`;
      }
      contentRef.current!.style.transform = `translate(${x}px,${y}px)`;

      frame = window.requestAnimationFrame(func);
    };
    window.requestAnimationFrame(func);
  }, [contentRef.current, mapBoxRef.current, runUpdateClosestZone]);

  const changeSection = (mapItems: any, to: number) => {
    let newActiveIndex = activeSectionIndex + to;
    if (newActiveIndex < 0) {
      newActiveIndex = sectionList.length - 1;
    } else if (newActiveIndex > sectionList.length - 1) {
      newActiveIndex = 0;
    }
    focusItem(sectionList[newActiveIndex], mapItems);
    navigate(`${sectionList[newActiveIndex]}`);
    setActiveSectionIndex(newActiveIndex);
  };

  const focusItem = (section: any, mapItems: any) => {
    const positionToFocus = mapItems.find(
      (item: any) => item.id == section && item.isZoneCenter
    );

    const position = {
      x: (positionToFocus.centerX - window.innerWidth / 2) * -1,
      y: (positionToFocus.centerY - window.innerHeight / 2) * -1,
    };

    canvasPosRef.current.nextPos = position;

    transitBetweenVal();
  };

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
    setLoading(true);
    const response: any = data;
    const notifications = notifiactionData;
    const uniqueLinks: any = new Set();
    response.forEach((item: any) => {
      if (item.link) {
        uniqueLinks.add(item.link);
      }
    });
    const linksArray = [...uniqueLinks];
    const activeIdx = linksArray.findIndex((item: string) => item == route.id);

    const positionToFocus = response.findIndex(
      (item: any) =>
        item.link == linksArray[activeIdx >= 0 ? activeIdx : 0] &&
        item.isZoneCenter
    );

    const position = {
      x: (response[positionToFocus].position.x - window.innerWidth / 3) * -1,
      y: (response[positionToFocus].position.y - window.innerHeight / 3) * -1,
    };
    canvasPosRef.current.currentPos = position;
    contentRef.current!.style.transform = `translate(${position.x}px,${position.y}px)`;
    setActiveSectionIndex(activeIdx >= 0 ? activeIdx : 0);
    setItemIndex(positionToFocus);
    setSectionList(linksArray);
    setContent(response);
    setNotifications(notifications);
    setLoading(false);
  };

  useEffect(() => {
    if (!contentRef.current || !content.length || !renderMap) return;
    const map = generateMiniMap();
    setMapItems(map);
    focusItem(sectionList[activeSectionIndex], map);
  }, [contentRef.current, content, renderMap]);

  const updateZoneList = (zone: string) => {
    const index = sectionList.findIndex((item) => item == zone);

    if (index >= 0) {
      setActiveSectionIndex(index);
    }
  };

  const updateClosestZone = () => {
    let closestDistance = Infinity;
    let closestZone = null;
    let itemIndex = -1;
    Array.from(contentRef.current?.children!)?.forEach((item, index) => {
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
        itemIndex = index;
      }
    });

    if (sectionList[activeSectionIndex] != closestZone && closestZone) {
      updateZoneList(closestZone);
      setItemIndex(itemIndex);
    }
  };

  const updatemapVisibility = () => {
    setRenderMap(true);
  };

  useEffect(() => {
    getContent();
    document.addEventListener("mouseup", () => {
      mouseInitialPos.current = null;
    });
    document.addEventListener("touchend", () => {
      mouseInitialPos.current = null;
    });
  }, []);

  const navigateInMobile = (to: number) => {
    let newActiveIndex = itemIndex + to;

    if (newActiveIndex < 0) {
      newActiveIndex = content.length - 1;
    } else if (newActiveIndex > content.length - 1) {
      newActiveIndex = 0;
    }

    const item = contentRef.current?.children[newActiveIndex];
    const rect = item?.getBoundingClientRect();
    const centerX = rect?.width! / 2 + content[newActiveIndex]?.position.x!;
    const centerY = rect?.height! / 2 + content[newActiveIndex]?.position.y!;
    const position = {
      x: (centerX - window.innerWidth / 2) * -1,
      y: (centerY - window.innerHeight / 2) * -1,
    };

    canvasPosRef.current.nextPos = position;
    transitBetweenVal();
    setItemIndex(newActiveIndex);
  };
  return (
    <LayoutContext.Provider
      value={{
        changeSection: (index: number) => changeSection(mapItems, index),
        sectionList,
        updatemapVisibility,
        mapBoxRef: mapBoxRef,
      }}
    >
      {renderMap ? (
        <>
          {isMobileView ? (
            <MiniMapMobile
              activeSection={sectionList[activeSectionIndex]}
              mapPos={mapPosRef.current}
              scale={scale}
              onMapClick={onMouseMove}
              sections={mapItems}
              changeSection={(index) => changeSection(mapItems, index)}
            />
          ) : (
            <MiniMapDesktop
              activeSection={sectionList[activeSectionIndex]}
              mapPos={mapPosRef.current}
              scale={scale}
              onMapClick={onMouseMove}
              sections={mapItems}
              changeSection={(index) => changeSection(mapItems, index)}
            />
          )}
        </>
      ) : null}
      {isMobileView && (
        <MobileViewController
          activeItem={itemIndex + 1}
          totalItems={content.length}
          section={content[itemIndex]?.link}
          changeSection={navigateInMobile}
        />
      )}
      {!isMobileView && renderMap && activeSectionIndex != -1 && (
        <NotificationWrapper
          ///@ts-ignore
          notifications={notifications[sectionList[activeSectionIndex]] || []}
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
            }}
          >
            {!content.length ? (
              <Loader loading={loading} />
            ) : (
              <SectionStack updateMapItem={updateMapItem} data={content} />
            )}
          </div>
        </div>
      </div>
    </LayoutContext.Provider>
  );
};

export default Layout;
