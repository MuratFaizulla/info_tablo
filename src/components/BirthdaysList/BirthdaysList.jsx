import React from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { getUpcomingBirthdays } from "../../utils/utils";
import styles from "./BirthdaysList.module.css";

const fetchBirthdays = async () => {
  const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/birthday`);
  return data;
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
                {user.PORTRET ? (
                  <img src={`data:image/jpeg;base64,${user.PORTRET}`} alt={user.FULL_FIO} className={styles.avatarImg} />
                ) : (
                  <div className={styles.avatarPlaceholder}>{user.FULL_FIO ? user.FULL_FIO[0] : '?'}</div>
                )}
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