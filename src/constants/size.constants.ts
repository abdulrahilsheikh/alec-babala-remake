export const CanvasDimension = {
  width: 3600,
  height: 2200,
};
export const MapDimension = {
  width: 18.75 * 16,
  height: 10 * 16,
};

export const scale = {
  width: CanvasDimension.width / MapDimension.width,
  height: CanvasDimension.height / MapDimension.height,
};
