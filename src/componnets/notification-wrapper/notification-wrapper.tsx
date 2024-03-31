import { useEffect, useState } from "react";
import Notifications from "../notifications/notifications";
import style from "./notifications-wrapper.module.scss";
type Props = {
  notifications: any;
};

const NotificationWrapper = ({ notifications }: Props) => {
  const [notificationList, setNotificationsList] = useState(notifications);
  const [unmount, setUnmount] = useState(false);
  useEffect(() => {
    if (notificationList == notifications) return;

    setUnmount(true);
  }, [notifications]);
  const updateListState = () => {
    setUnmount(false);
    setNotificationsList(notifications);
  };
  return (
    <div className={style.notifiaction_wrapper}>
      {notificationList.map((item, index) => (
        <Notifications
          onAnimationEnd={
            index == notificationList.length - 1
              ? () => updateListState()
              : () => {}
          }
          unmount={unmount}
          index={index + 1}
          title={item.title}
          description={item.description}
        />
      ))}
    </div>
  );
};

export default NotificationWrapper;
