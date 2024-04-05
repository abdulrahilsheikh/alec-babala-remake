import style from "./notifications.module.scss";

type Props = {
  title: string;
  description: string;
  index: number;
  unmount: boolean;
  onAnimationEnd?: () => void;
  link?: { text: string; href: string };
  color: string;
};

const Notifications = ({
  onAnimationEnd,
  description,
  title,
  index,
  unmount,
  color,
  link,
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
      <div className={style.description}>
        {description}
        {link ? (
          <a style={{ marginLeft: "0.25rem" }} href={link.href} target="_blank">
            @{link.text}
          </a>
        ) : null}
      </div>
    </div>
  );
};

export default Notifications;
