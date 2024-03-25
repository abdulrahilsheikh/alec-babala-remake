import { useMemo } from "react";
import ItemGrid from "../item-grid/item-grid";
import { ISocialLinks } from "../section-stack/section-stack.types";
import style from "./social-links.module.scss";
type Props = {
  data: ISocialLinks;
};
const list = [
  {
    icon: "fa-brands fa-github",
    key: "",
    text: "Github",
  },
  {
    icon: "fa-brands fa-linkedin-in",
    key: "",
    text: "LinkedIn",
  },
  {
    icon: "fa-brands fa-dev",
    key: "",
    text: "DevTo",
  },
];
const SocialLink = ({ data }: Props) => {
  const iconsList: any = useMemo(() => {
    return list.map((item) => {
      const links: any = data?.externalLink || {};
      return (
        <a
          draggable="false"
          className={style.social_item}
          href={links[item.key] || ""}
        >
          <i className={item.icon}></i>
          <span>{item.text}</span>
        </a>
      );
    });
  }, []);
  return (
    <div
      data-zone={data.link}
      className={style.socail_link_container}
      style={{ left: data.position.x, top: data.position.y }}
    >
      <ItemGrid list={iconsList} />;
    </div>
  );
};

export default SocialLink;
