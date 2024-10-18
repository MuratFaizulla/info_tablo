import React from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { getUpcomingBirthdays } from "../../utils/utils";
import styles from "./BirthdaysList.module.css"; // Импортируем стили

// Функция для запроса данных о днях рождения
const fetchBirthdays = async () => {
  const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/birthday`);
  return data;
};

const BirthdaysList = () => {
  // Используем React Query для загрузки данных
  const { data: users, isLoading, error } = useQuery("birthdays", fetchBirthdays, {});

  if (isLoading) return <div>Загрузка...</div>;
  if (error) return <div>Ошибка при загрузке данных: {error.message}</div>;

  const upcomingBirthdays = getUpcomingBirthdays(users);

  const calculateAge = (birthDate) => {
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();

    const hasHadBirthdayThisYear =
      today.getMonth() > birthDate.getMonth() ||
      (today.getMonth() === birthDate.getMonth() &&
        today.getDate() >= birthDate.getDate());

    return hasHadBirthdayThisYear ? age : age - 1;
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Ближайшие дни рождения</h1>
      <div className={styles.scrollableList}>
        <ul className={styles.list}>
          {upcomingBirthdays.map((user, index) => {
            const birthDate = new Date(user.birthDate);
            const age = calculateAge(birthDate) + 1;

            return (
              <li key={user.ID_STAFF || index} className={styles.listItem}>
                {user.PORTRET ? (
                  <img
                    src={`data:image/jpeg;base64,${user.PORTRET}`}
                    alt={`Портрет сотрудника ${user.STAFF_ID}`}
                    style={{
                      width: "80px",
                      height: "80px",
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div className={styles.placeholder}>
                    <p>Портрет отсутствует</p>
                  </div>
                )}
                <div>
                  <span className={styles.userName}>{user.FULL_FIO}</span>
                  <span className={styles.className}>({user.CLASS_NAME})</span>
                  <span className={styles.birthDate}>
                    {birthDate.toLocaleDateString()}
                  </span>
                  <span className={styles.age}>{age - 1} год(а)</span>
                  <span
                    className={`${styles.daysLeft} ${
                      user.daysUntilBirthday === 0 ? styles.today : ""
                    }`}
                  >
                    {user.daysUntilBirthday === 0
                      ? "Сегодня день рождения! Поздравляем!"
                      : `${user.daysUntilBirthday} дней осталось`}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default BirthdaysList;
