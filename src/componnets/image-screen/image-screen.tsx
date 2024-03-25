import { IContent, IImageScreen } from "../section-stack/section-stack.types";
import style from "./image-screen.module.scss";
type Props = {
  data: IImageScreen;
  updateMapItem: () => void;
};

const ImageScreen = ({ data, updateMapItem }: Props) => {
  return (
    <div
      data-zone={data.link}
      className={style.imgae_container}
      style={{ left: data.position.x, top: data.position.y }}
    >
      <div className={style.imgae_card}>
        <div className={style.image_screen_title}>{data.title}</div>
        <img onLoad={updateMapItem} src={data.src} draggable="false" />
      </div>
      <div className={style.image_meta}>{data.metaData}</div>
    </div>
  );
};

export default ImageScreen;
