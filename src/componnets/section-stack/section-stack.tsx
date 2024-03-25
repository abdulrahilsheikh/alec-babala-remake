import DataGrid from "../data-grid/data-grid";
import DataList from "../data-list/data-list";
import ImageCard from "../image-card/image-card";
import ImageScreen from "../image-screen/image-screen";
import MainSection from "../main-section/main-section";
import SocialLink from "../social-link/social-link";
import TextStack from "../text-stack/text-stack";
import { Root } from "./section-stack.types";

interface Props {
  data: Root;
  updateMapItem: (index: number) => void;
}

const SectionMap: any = {
  TextStack: TextStack,
  MainSection: MainSection,
  ImageCard: ImageCard,
  ImageScreen: ImageScreen,
  SocialLinks: SocialLink,
  DataGrid: DataGrid,
  DataList: DataList,
};

const SectionStack = ({ data, updateMapItem }: Props) => {
  return data.map((item, index) => {
    const Element = SectionMap[item.contentType];
    return Element ? (
      <Element updateMapItem={() => updateMapItem(index)} data={item} />
    ) : (
      <span></span>
    );
  });
};

export default SectionStack;
