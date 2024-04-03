import { createContext } from "react";

export interface ILayoutContext {
  changeSection: (data: number) => void;
  sectionList: string[];
  updatemapVisibility: () => void;
  mapBoxRef: React.RefObject<HTMLDivElement>;
}

export const LayoutContext = createContext<ILayoutContext>({} as any);
