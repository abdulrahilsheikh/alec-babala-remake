import style from "./notifications.module.scss";

type Props = {
  title: string;
  description: string;
  index: number;
  unmount: boolean;
  onAnimationEnd?: () => void;
};

const Notifications = ({
  onAnimationEnd,
  description,
  title,
  index,
  unmount,
}: Props) => {
  return (
    <div
      onAnimationEnd={() => onAnimationEnd?.()}
      style={{ animationDelay: `${index * 0.2}s` }}
      className={`${style.container} ${unmount ? style.unmount : style.mount}`}
    >
      <div className={style.header}>
        <div className={style.indicator}></div> {title}
      </div>
      <div className={style.description}>{description}</div>
    </div>
  );
};

export default Notifications;
