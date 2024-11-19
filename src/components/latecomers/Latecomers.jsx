import React from "react";
import { useQuery } from "react-query";
import axios from "axios";
import styles from "./Latecomers.module.css";

// Функция для запроса данных о опоздавших сотрудниках
const fetchLatecomers = async () => {
  const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/latecomers`);
  return data;
};

const Latecomers = () => {
  // Используем React Query для получения данных
  const { data: latecomers, isLoading, error } = useQuery(
    "latecomers", // Ключ для кэширования данных
    fetchLatecomers, // Функция запроса данных
    {
      refetchInterval: 60000, // Обновление данных каждые 60 секунд (1 минута)
    }
  );

  // Функция для форматирования времени
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString();
  };

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (error) {
    return <div>Ошибка загрузки данных</div>;
  }

  // Сортируем данные по FIRST_ENTRY
  const sortedLatecomers = [...latecomers].sort((a, b) => {
    const dateA = new Date(a.FIRST_ENTRY);
    const dateB = new Date(b.FIRST_ENTRY);
    return dateA - dateB; // Для сортировки по возрастанию
  });

  return (
    <div className={styles.container}>
      <h2 style={{ textAlign: "center", fontSize: "24px" }}>Опоздавшие ученики</h2>
      <div className={styles["table-container"]}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ФИО</th>
              {/* <th>ИИН</th> */}
              <th>Подразделения</th>
              <th>Входы</th>
            </tr>
          </thead>
          <tbody>
            {sortedLatecomers.map((person, index) => (
              <tr key={index}>
                <td>{person.FULL_FIO}</td>
                {/* <td>{person.TABEL_ID}</td> */}
                <td>{person.CLASS_NAME}</td>
                <td>{formatTime(person.FIRST_ENTRY)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Latecomers;
