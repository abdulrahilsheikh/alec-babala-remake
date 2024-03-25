import { IImageScreen } from "../section-stack/section-stack.types";
import style from "./image-card.module.scss";
type Props = {
  data: IImageScreen;
  updateMapItem: () => void;
};

const ImageCard = ({ data, updateMapItem }: Props) => {
  return (
    <div
      data-zone={data.link}
      className={style.imgae_container}
      style={{ left: data.position.x, top: data.position.y }}
    >
      <div className={style.imgae_card}>
        <img onLoad={updateMapItem} src={data.src} draggable="false" />
      </div>
      <div className={style.image_title}>{data.title}</div>
      <div className={style.image_meta}>{data.metaData}</div>
    </div>
  );
};

export default ImageCard;
