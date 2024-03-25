import React, { useCallback, useEffect, useRef, useState } from "react";
import data from "../../constants/content-data";
import {
  CanvasDimension,
  CanvasPadding,
  scale,
} from "../../constants/size.constants";
import SectionStack from "../section-stack/section-stack";
import { IContent } from "../section-stack/section-stack.types";
import MiniMap from "../map/mini-map";
import style from "./layout.module.scss";

interface IPosition {
  x: number;
  y: number;
}
const positionCalculator = (
  initialPos: IPosition,
  event: any,
  refernce: any,
  window: any
) => {
  const position = {
    x: initialPos.x + event.movementX,
    y: initialPos.y + event.movementY,
  };
  if (position.x >= CanvasPadding.x) {
    position.x = CanvasPadding.x;
  }
  if (position.y >= CanvasPadding.y) {
    position.y = CanvasPadding.y;
  }
  if (
    Math.abs(position.x) >=
    refernce.width + CanvasPadding.x - window.innerWidth
  ) {
    position.x = (refernce.width + CanvasPadding.x - window.innerWidth) * -1;
  }
  if (
    Math.abs(position.y) >=
    refernce.height + CanvasPadding.y - window.innerHeight
  ) {
    position.y = (refernce.height + CanvasPadding.y - window.innerHeight) * -1;
  }
  return position;
};
const Layout = () => {
  const [canvasPos, setCanvasPos] = useState<IPosition>({ x: 0, y: 0 });
  const [mapPos, setMapPos] = useState<IPosition>({ x: 0, y: 0 });

  const [content, setContent] = useState<IContent[]>([]);

  const [mapItems, setMapItems] = useState<any[]>([]);
  const [sectionList, setSectionList] = useState<any[]>([]);

  const isMouseDown = useRef(false);

  const contentRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<any>();

  const onMouseMove = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    onClick = false
  ) => {
    if (!isMouseDown.current && !onClick) return;
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
  const changeSection = (mapItems: any, to: number) => {
    let newSectionList: any = [];
    switch (to) {
      case 0:
        newSectionList = [...sectionList];
        break;
      case 1:
        newSectionList = [...sectionList.slice(1), sectionList[0]];
        break;
      case -1:
        newSectionList = [
          sectionList[sectionList.length - 1],
          ...sectionList.slice(0, sectionList.length - 1),
        ];
        break;
    }
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
      isMouseDown.current = false;
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

    const uniqueLinks: any = new Set();
    response.forEach((item: any) => {
      if (item.link) {
        uniqueLinks.add(item.link);
      }
    });

    setSectionList([...uniqueLinks]);
    setContent(response);
  };

  useEffect(() => {
    if (!contentRef.current || !content.length) return;
    const map = generateMiniMap();
    setMapItems(map);
    focusItem(sectionList[0], map);
  }, [contentRef.current, content]);

  const updateZoneList = (zone: string) => {
    const list = sectionList;
    const index = list.findIndex((item) => item == zone);
    if (index >= 0) {
      const item = list.splice(index, 1);
      setSectionList([item, ...list]);
    }
  };

  const updateClosestZone = () => {
    let closestDistanceX = Infinity;
    let closestDistanceY = Infinity;
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
      console.log(item.getAttribute("data-zone"), distance);

      if (distance < closestDistance) {
        closestZone = item.getAttribute("data-zone");
        closestDistance = distance;
      }
    });
    console.log(closestZone);

    if (sectionList[0] != closestZone && closestZone) {
      updateZoneList(closestZone);
    }
  };

  useEffect(() => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      updateClosestZone();
    }, 450);
  }, [contentRef.current, canvasPos]);

  useEffect(() => {
    getContent();
  }, []);

  return (
    <>
      <MiniMap
        activeSection={sectionList[0]}
        mapPos={mapPos}
        scale={scale}
        onMapClick={onMouseMove}
        sections={mapItems}
        changeSection={(index) => changeSection(mapItems, index)}
      />
      <div
        style={{
          position: "fixed",
          left: window.innerWidth / 2,
          top: 0,
          height: "100vh",
          borderLeft: "thin solid black",
          zIndex: 1000,
        }}
      ></div>
      <div
        className={style.layout}
        onMouseDown={() => {
          isMouseDown.current = true;
        }}
        onMouseMove={onMouseMove}
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
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: "10px",
          }}
        >
          <SectionStack updateMapItem={updateMapItem} data={content} />
        </div>
      </div>
    </>
  );
};

export default Layout;
