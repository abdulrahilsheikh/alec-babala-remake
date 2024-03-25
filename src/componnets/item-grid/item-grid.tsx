import style from "./item-grid.module.scss";

type Props = {
  list: any[];
};

const ItemGrid = ({ list }: Props) => {
  return <div className={style.grid_container}>{list}</div>;
};

export default ItemGrid;
