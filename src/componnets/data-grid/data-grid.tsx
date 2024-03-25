import { useMemo } from "react";
import ItemGrid from "../item-grid/item-grid";
import style from "./data-grid.module.scss";
import { IDataGrid } from "../section-stack/section-stack.types";
type Props = { data: IDataGrid };

const DataGrid = ({ data }: Props) => {
  const itemList = useMemo(() => {
    return data.content.map((item) => {
      return (
        <a draggable="false" className={style.grid_item} href={item.link || ""}>
          <img draggable="false" src={item.src} />
          <span>{item.title}</span>
        </a>
      );
    });
  }, [data]);
  return (
    <section
      data-zone={data.link}
      className={style.data_grid_container}
      style={{ left: data.position.x, top: data.position.y }}
    >
      <div className={style.title}>{data.title}</div>
      <div className={style.body}>
        <ItemGrid list={itemList} />
      </div>
    </section>
  );
};

export default DataGrid;
