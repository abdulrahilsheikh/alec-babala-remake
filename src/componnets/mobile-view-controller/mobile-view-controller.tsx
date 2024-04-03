import style from "./mobile-view-controller.module.scss";
type Props = {
  activeItem: number;
  totalItems: number;
  section: string;
  changeSection: (data: number) => void;
};

const MobileViewController = ({
  activeItem,
  totalItems,
  section,
  changeSection,
}: Props) => {
  return (
    <div className={style.mobile_view_nav}>
      <button className={style.button} onClick={() => changeSection(-1)}>
        <i className={`fa-solid fa-chevron-left `}></i>
      </button>

      <div className={style.content_info}>
        <div className={style.section}>{section}</div>
        <div className={style.count}>
          {activeItem} of {totalItems}
        </div>
      </div>
      <button className={style.button} onClick={() => changeSection(1)}>
        <i className={`fa-solid fa-chevron-right `}></i>
      </button>
    </div>
  );
};

export default MobileViewController;
