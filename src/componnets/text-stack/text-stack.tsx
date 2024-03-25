import ContentStack from "../content-stack/content-stack";
import { ITextStack } from "../section-stack/section-stack.types";
import style from "./text-stack.module.scss";

type Props = {
  data: ITextStack;
};

const DataHolder = ({ data }: Props) => {
  return (
    <div
      data-zone={data.link}
      className={style.container}
      style={{ left: data.position.x, top: data.position.y }}
    >
      <div className={style.title}>{data.title}</div>
      <div className={style.body}>
        <ContentStack content={data.content} />
      </div>
    </div>
  );
};

export default DataHolder;
