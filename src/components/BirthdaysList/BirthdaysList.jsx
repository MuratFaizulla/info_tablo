import React from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { getUpcomingBirthdays } from "../../utils/utils";
import styles from "./BirthdaysList.module.css";

const fetchBirthdays = async () => {
  const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/birthday`);
  return data;
};

// Фото: в PerCo Өскемена портретов нет, поэтому бэкенд отдаёт ссылку
// /photo/<ID_STAFF> — там портрет из PerCo, а если его нет, то из HikCentral
// по ИИН. Если фото нет нигде, ссылка вернёт 404 и покажем первую букву имени.
const PhotoOrInitial = ({ user }) => {
  const [failed, setFailed] = React.useState(false);
  const src = user.PORTRET
    ? `data:image/jpeg;base64,${user.PORTRET}`
    : user.PHOTO_URL
      ? `${process.env.REACT_APP_API_URL}/photo/${user.ID_STAFF}`
      : null;

  if (!src || failed) {
    return <div className={styles.avatarPlaceholder}>{user.FULL_FIO ? user.FULL_FIO[0] : '?'}</div>;
  }
  return (
    <img
      src={src}
      alt={user.FULL_FIO}
      className={styles.avatarImg}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
};

const calculateAge = (birthDate) => {
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();
  const had = today.getMonth() > birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
  return had ? age : age - 1;
};

const BirthdaysList = () => {
  const { data: users, isLoading, error } = useQuery("birthdays", fetchBirthdays);

  if (isLoading) return <div className={styles.loading}><span className={styles.spinner} /></div>;
  if (error) return <div className={styles.error}>Ошибка загрузки</div>;

  const upcoming = getUpcomingBirthdays(users);

  return (
    <div className={styles.container}>
      <div className={styles.panelTitle}>
        <span className={styles.dot} />
        Ближайшие дни рождения
      </div>

      <div className={styles.list}>
        {upcoming.map((user, index) => {
          const birthDate = new Date(user.birthDate);
          const age = calculateAge(birthDate);
          const isToday = user.daysUntilBirthday === 0;

          return (
            <div key={user.ID_STAFF || index} className={`${styles.item} ${isToday ? styles.itemToday : ''}`}>
              <div className={styles.avatar}>
                <PhotoOrInitial user={user} />
                {isToday && <span className={styles.todayBadge}>🎂</span>}
              </div>

              <div className={styles.info}>
                <div className={styles.name}>{user.FULL_FIO}</div>
                <div className={styles.meta}>
                  <span className={styles.className}>{user.CLASS_NAME}</span>
                  <span className={styles.sep}>·</span>
                  <span className={styles.ageBirth}>{age} лет · {birthDate.toLocaleDateString('ru-RU')}</span>
                </div>
              </div>

              <div className={styles.daysWrap}>
                {isToday
                  ? <span className={styles.todayTag}>Сегодня!</span>
                  : <span className={styles.daysTag}>{user.daysUntilBirthday}д</span>
                }
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BirthdaysList;