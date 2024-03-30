import style from "./notifications-wrapper.module.scss";
type Props = {
  notifications: any;
};

const NotificationWrapper = ({ notifications }: Props) => {
  notifications;
  return (
    <div className={style.notifiaction_wrapper}>{/* <Notifications /> */}</div>
  );
};

export default NotificationWrapper;
