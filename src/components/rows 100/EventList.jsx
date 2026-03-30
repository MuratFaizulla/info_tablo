import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import styles from './EventList.module.css';

const fetchEvents = async () => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/rows100`);
  return response.data;
};

const EventList = () => {
  const { data: events, isLoading, isError } = useQuery('eventsData', fetchEvents, {
    refetchInterval: 2000,
  });

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.panelTitle}>
          <span className={styles.dotLive} />
          Статистика входов и выходов
          <span className={styles.badge}>последние 100 записей</span>
        </div>
      </div>

      {isLoading && <div className={styles.loading}><span className={styles.spinner} /> Загрузка...</div>}
      {isError && <div className={styles.error}>Ошибка загрузки</div>}

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.thNum}>№</th>
              <th>ФИО</th>
              <th>ID Рег.</th>
              <th>Дата</th>
              <th>Время</th>
              <th>Событие</th>
              <th>Подразделение</th>
            </tr>
          </thead>
          <tbody>
            {events && events.length > 0 ? (
              events.map((event, index) => (
                <tr key={event.ID_REG || index}>
                  <td className={styles.tdNum}>{index + 1}</td>
                  <td className={styles.tdName}>{event.FULL_FIO}</td>
                  <td className={styles.tdId}>{event.ID_REG}</td>
                  <td>{new Date(event.DATE_EV).toLocaleDateString('ru-RU')}</td>
                  <td className={styles.tdTime}>
                    {new Date(event.TIME_EV).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </td>
                  <td>
                    <span
                      className={
                        event.ENTRY_EXIT?.trim().toLowerCase() === 'выход'
                          ? styles.tagExit
                          : styles.tagEntry
                      }
                    >
                      {event.ENTRY_EXIT?.trim().toLowerCase() === 'выход'
                        ? '↑ Выход'
                        : '↓ Вход'}
                    </span>
                  </td>
                  <td className={styles.tdDept}>{event.CLASS_NAME}</td>
                </tr>
              ))
            ) : (
              !isLoading && <tr><td colSpan="7" className={styles.empty}>Нет данных</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventList;