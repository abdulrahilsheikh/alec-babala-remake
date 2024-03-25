import { CanvasPadding } from "../../constants/size.constants";
import { IPosition } from "./layout";

export const positionCalculator = (
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
