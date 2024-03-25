import profileImg from "../../assets/profile-img.png";
import { IMainSection } from "../section-stack/section-stack.types";
import style from "./main-section.module.scss";
type Props = {
  data: IMainSection;
};

const MainSection = ({ data }: Props) => {
  return (
    <div
      data-zone={data.link}
      className={style.container}
      style={{ left: data.position.x, top: data.position.y }}
    >
      <div className={style.title}>{data.title}</div>

      <div className={style.body}>
        <div className={style.img_contaienr}>
          <div className={style.img_section}>
            <img src={profileImg} className={style.img} />
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
          <div className={style.intr0_row_content}></div>
        </div>
      </div>
    </div>
  );
};

export default MainSection;
