import { useContext } from "react";
import profileImg from "../../assets/face.png";
import { LayoutContext } from "../layout/layout.context";
import { IMainSection } from "../section-stack/section-stack.types";
import style from "./main-section.module.scss";
type Props = {
  data: IMainSection;
};

const MainSection = ({ data }: Props) => {
  const { sectionList, changeSection, updatemapVisibility } =
    useContext(LayoutContext);

  return (
    <div
      onAnimationEnd={updatemapVisibility}
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
          <div></div>
          <div className={style.intr0_row_content}>
            {sectionList.map((i: any, index: number) =>
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
          <div></div>
        </div>
        <div className={style.credits}>
          Took reference for design from{" "}
          <a href="https://www.alecbabala.com/" target="_blank">
            @alecbabala/
          </a>
        </div>
      </div>
    </div>
  );
};

export default MainSection;
