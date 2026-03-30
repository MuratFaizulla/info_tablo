import React from 'react';
import axios from 'axios';
import { useQuery } from 'react-query';
import styles from './StaffBuildingStatus.module.css';

const fetchData = async () => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/count_stud`);
  return response.data;
};

const StaffBuildingStatus = () => {
  const { data, isLoading, isError, error } = useQuery('staffData', fetchData, { refetchInterval: 2000 });

  if (isLoading) return <div className={styles.loading}><span className={styles.spinner} /> Загрузка...</div>;
  if (isError)   return <div className={styles.error}>Ошибка: {error.message}</div>;

  const totalStaff    = data.reduce((s, i) => s + i.TOTAL_STAFF, 0);
  const inBuilding    = data.reduce((s, i) => s + i.IN_BUILDING, 0);
  const outOfBuilding = data.reduce((s, i) => s + i.OUT_OF_BUILDING, 0);
  const notArrived    = data.reduce((s, i) => s + i.NOT_ARRIVED, 0);
  const pct = totalStaff ? Math.round((inBuilding / totalStaff) * 100) : 0;

  const sortedData = [...data].sort((a, b) => {
    const nA = parseInt(a.CLASS_NAME, 10), nB = parseInt(b.CLASS_NAME, 10);
    return nA === nB ? a.CLASS_NAME.localeCompare(b.CLASS_NAME) : nA - nB;
  });

  return (
    <div className={styles.container}>
      <div className={styles.panelTitle}>
        <span className={styles.dot} />
        Статистика учеников
      </div>

      <div className={styles.cards}>
        <div className={`${styles.card} ${styles.cardTotal}`}>
          <div className={styles.cardLabel}>Всего</div>
          <div className={styles.cardValue}>{totalStaff}</div>
        </div>
        <div className={`${styles.card} ${styles.cardIn}`}>
          <div className={styles.cardLabel}>В здании</div>
          <div className={styles.cardValue}>{inBuilding}</div>
        </div>
        <div className={`${styles.card} ${styles.cardOut}`}>
          <div className={styles.cardLabel}>Вышли</div>
          <div className={styles.cardValue}>{outOfBuilding}</div>
        </div>
        <div className={`${styles.card} ${styles.cardNot}`}>
          <div className={styles.cardLabel}>Не пришли</div>
          <div className={styles.cardValue}>{notArrived}</div>
        </div>
      </div>

      <div className={styles.progressWrap}>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${pct}%` }} />
        </div>
        <span className={styles.progressLabel}>{pct}% в здании</span>
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Класс</th>
              <th>Всего</th>
              <th>В зд.</th>
              <th>Вышли</th>
              <th>Нет</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((item) => (
              <tr key={item.CLASS_NAME} className={item.NOT_ARRIVED > 0 ? styles.rowWarn : ''}>
                <td className={styles.className}>{item.CLASS_NAME}</td>
                <td>{item.TOTAL_STAFF}</td>
                <td className={styles.tdIn}>{item.IN_BUILDING}</td>
                <td>{item.OUT_OF_BUILDING}</td>
                <td className={item.NOT_ARRIVED > 0 ? styles.tdNot : ''}>{item.NOT_ARRIVED}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffBuildingStatus;