import React from "react";
import style from "./data-holder.module.scss";
type Props = {};

const DataHolder = (props: Props) => {
  return (
    <div className={style.container} style={{ left: 725, top: 298 }}>
      <div className={style.title}>rahil.sheikh/contact</div>
      <div className={style.body}>
        <h2>i develop web and mobile apps</h2>
        <p>
          I’ve designed apps for iOS, Android, and web. My human-centered
          process and decision making is grounded in qualitative and
          quantitative research.
        </p>
        <p>
          I’ve designed apps for iOS, Android, and web. My human-centered
          process and decision making is grounded in qualitative and
          quantitative research.
        </p>
      </div>
    </div>
  );
};

export default DataHolder;
