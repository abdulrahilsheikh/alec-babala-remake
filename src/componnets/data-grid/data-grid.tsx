import { useMemo } from "react";
import ItemGrid from "../item-grid/item-grid";
import style from "./data-grid.module.scss";
import { IDataGrid } from "../section-stack/section-stack.types";
type Props = { data: IDataGrid };

const DataGrid = ({ data }: Props) => {
  const itemList = useMemo(() => {
    return data.content.map((item) => {
      return item.link ? (
        <a
          draggable="false"
          className={style.grid_item}
          href={item.link || ""}
          target="_blank"
        >
          <img draggable="false" src={item.src} />
          <span>{item.title}</span>
        </a>
      ) : (
        <div draggable="false" className={style.grid_item}>
          <img draggable="false" src={item.src} />
          <span>{item.title}</span>
        </div>
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
