import React from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import styles from './StaffBuildingStatus.module.css';

// Функция для получения данных
const fetchData = async () => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/count_stud`);
  return response.data;
};

const StaffBuildingStatus = () => {
  const { data, isLoading, isError, error } = useQuery('staffData', fetchData, {
    refetchInterval: 2000, // Обновление каждые 2 секунды
  });

  if (isLoading) return <div>Загрузка...</div>;
  if (isError) return <div>Ошибка загрузки данных: {error.message}</div>;

  // Считаем общую статистику
  const totalStaff = data.reduce((sum, item) => sum + item.TOTAL_STAFF, 0);
  const inBuilding = data.reduce((sum, item) => sum + item.IN_BUILDING, 0);
  const outOfBuilding = data.reduce((sum, item) => sum + item.OUT_OF_BUILDING, 0);
  const notArrived = data.reduce((sum, item) => sum + item.NOT_ARRIVED, 0);

  // Сортируем данные по номеру и букве класса
  const sortedData = [...data].sort((a, b) => {
    const numA = parseInt(a.CLASS_NAME, 10);
    const numB = parseInt(b.CLASS_NAME, 10);

    if (numA === numB) {
      return a.CLASS_NAME.localeCompare(b.CLASS_NAME);
    }

    return numA - numB;
  });

  return (
    <div className={styles.eventStudContainer}>
      <h1 style={{ fontSize: '24px', textAlign: 'center' }}>Статистика событий студентов</h1>
      <div className={styles.statistics}>
        <div className={styles.statisticItem}>
          <h2>Всего</h2>
          <h3>{totalStaff}</h3>
        </div>
        <div className={styles.statisticItem}>
          <h2>В здании</h2>
          <h3>{inBuilding}</h3>
        </div>
        <div className={styles.statisticItem}>
          <h2>Не в здании</h2>
          <h3>{outOfBuilding}</h3>
        </div>
        <div className={styles.statisticItem}>
          <h2>Не пришли</h2>
          <h3>{notArrived}</h3>
        </div>
      </div>

      <div className={styles.tableContainer}>
        <table>
          <thead>
            <tr>
              <th>Класс</th>
              <th>Всего</th>
              <th>В здании</th>
              <th>На выходе</th>
              <th>Не пришли</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item) => (
              <tr key={item.CLASS_NAME}>
                <td>{item.CLASS_NAME}</td>
                <td>{item.TOTAL_STAFF}</td>
                <td>{item.IN_BUILDING}</td>
                <td>{item.OUT_OF_BUILDING}</td>
                <td>{item.NOT_ARRIVED}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffBuildingStatus;
