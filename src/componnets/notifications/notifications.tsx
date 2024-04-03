import style from "./notifications.module.scss";

type Props = {
  title: string;
  description: string;
  index: number;
  unmount: boolean;
  onAnimationEnd?: () => void;
  color: string;
};

const Notifications = ({
  onAnimationEnd,
  description,
  title,
  index,
  unmount,
  color,
}: Props) => {
  return (
    <div
      onAnimationEnd={() => onAnimationEnd?.()}
      style={{ animationDelay: `${index * 0.2}s` }}
      className={`${style.container} ${unmount ? style.unmount : style.mount}`}
    >
      <div className={style.header}>
        <div
          style={{ backgroundColor: color }}
          className={style.indicator}
        ></div>{" "}
        {title}
      </div>
      <div className={style.description}>{description}</div>
    </div>
  );
};

export default Notifications;
