import React, { useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import styles from "./Latecomers.module.css";

const fetchLatecomers = async () => {
  const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/latecomers`);
  return data;
};

const houseNames = {
  "Қазығұрт": ["7C", "8A", "9N", "10N"],
  "Атамекен": ["7N", "9M", "11A", "12A"],
  "Ордабасы": ["7B", "10K", "11K", "12B"],
  "Хантағы": ["7A", "8L", "10A", "12C"],
  "Мұзтау": ["7D", "8M", "9C", "10C"],
  "Тұран": ["8F", "8D", "9A", "9K"],
  "Алаш": ["7F", "9F", "10L", "12K"],
  "Отырар": ["7K", "8B", "9B", "10F"],
  "Оқжетпес": ["7E", "8N", "10E"],
  "Фараб": ["7L", "8C", "8K", "10M"],
  "Арыстанды": ["7M", "9D", "9E", "10D"],
  "Яссы": ["7G", "8E", "9L", "10B"]
};

const getHouseName = (className) => {
  return Object.keys(houseNames).find(house => houseNames[house].includes(className)) || "Неизвестный шаңырақ";
};

const Latecomers = () => {
  const { data: latecomers, isLoading, error } = useQuery("latecomers", fetchLatecomers, {
    refetchInterval: 60000,
  });

  const [expandedHouse, setExpandedHouse] = useState(null);

  const toggleHouse = (house) => {
    setExpandedHouse(expandedHouse === house ? null : house);
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString();
  };

  if (isLoading) {
    return <div className={styles.loading}>Загрузка...</div>;
  }

  if (error) {
    return <div className={styles.error}>Ошибка загрузки данных</div>;
  }

  const enrichedLatecomers = latecomers.map((person) => ({
    ...person,
    HOUSE_NAME: getHouseName(person.CLASS_NAME),
  }));

  const groupedByHouse = Object.keys(houseNames).reduce((acc, house) => {
    acc[house] = [];
    return acc;
  }, {});

  enrichedLatecomers.forEach(person => {
    groupedByHouse[person.HOUSE_NAME].push(person);
  });

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Статистика опозданий по шаңырақам</h2>
      <div className={styles.housesContainer}>
        {Object.entries(groupedByHouse).map(([house, students]) => (
          <div key={house} className={styles.houseCard}>
            <h3 className={styles.houseTitle} onClick={() => toggleHouse(house)}>
              {house} <span className={styles.count}>(Опоздавших: {students.length})</span>
            </h3>
            {expandedHouse === house && (
              <div className={styles.tableContainer}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>ФИО</th>
                      <th>Класс</th>
                      <th>Время входа</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.length > 0 ? (
                      students.map((person, index) => (
                        <tr key={index}>
                          <td>{person.FULL_FIO}</td>
                          <td>{person.CLASS_NAME}</td>
                          <td>{formatTime(person.FIRST_ENTRY)}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" style={{ textAlign: "center" }}>Нет опоздавших</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Latecomers;
