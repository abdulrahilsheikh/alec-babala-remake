import style from "./data-list.module.scss";
type Props = { data: any };

const DataList = ({ data }: Props) => {
  return (
    <div
      data-zone={data.link}
      className={style.data_list_container}
      style={{ left: data.position.x, top: data.position.y }}
    >
      <div className={style.title}>{data.title}</div>
      <div className={style.body}>
        <div className={` ${style.row_header}`}>
          <div>Name</div>
          <div>Tag</div>
          <div>Date</div>
        </div>
        {data.content.map((item: any) => {
          return (
            <div className={style.row}>
              <div>{item.name}</div>
              <div>{item.tag}</div>
              <div>{item.date}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DataList;
