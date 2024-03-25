import { useContext, useMemo } from "react";
import profileImg from "../../assets/profile-img.png";
import { IMainSection } from "../section-stack/section-stack.types";
import style from "./main-section.module.scss";
import { LayoutContext } from "../layout/layout.context";
type Props = {
  data: IMainSection;
};

const MainSection = ({ data }: Props) => {
  const { sectionList, changeSection }: any = useContext(LayoutContext);

  return (
    <div
      key={data.link}
      data-zone={data.link}
      className={style.container}
      style={{ left: data.position.x, top: data.position.y }}
    >
      <div className={style.title}>{data.title}</div>

      <div className={style.body}>
        <div className={style.img_contaienr}>
          <div className={style.img_section}>
            <img draggable={false} src={profileImg} className={style.img} />
          </div>
        </div>
        <div className={style.info}>
          <div className={style.name}>Rahil Sheikh</div>
          <div className={style.profession}>UI Developer</div>
        </div>
        <div className={style.bio}>
          As a developer, I create innovative frontend solutions, integrating
          seamlessly into teams for impactful digital experiences.
        </div>
        <div className={style.intro_row}>
          <div className={style.intro_row_title}>Capabilities</div>
          <div className={style.intr0_row_content}>
            {sectionList.map((i, index) =>
              i == data.link ? null : (
                <div className={style.row_item}>
                  <span>{i}</span>
                  <button onClick={() => changeSection(index)}>
                    <i className="fa-solid fa-arrow-right-long"></i>
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainSection;
