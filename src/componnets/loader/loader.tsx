import style from "./loader.module.scss";
type Props = {
  loading: boolean;
};

const Loader = ({ loading }: Props) => {
  return (
    <div className={style.container}>
      <div className={style.section}>
        <div className={style.spinner}>
          <div></div>
        </div>
        <div className={style.stats}>
          {loading ? "Getting assets.." : "Initializing.."}
        </div>
      </div>
    </div>
  );
};

export default Loader;
