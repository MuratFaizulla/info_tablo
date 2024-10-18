import React from 'react';
import { useQuery } from 'react-query';
import axios from 'axios';
import './EventList.css'; // Добавим стили для таблицы

// Функция для получения данных
const fetchEvents = async () => {
  const response = await axios.get(`${process.env.REACT_APP_API_URL}/rows100`);
  return response.data;
};

const EventList = () => {
  // Используем useQuery для получения данных
  const { data: events, isLoading, isError } = useQuery('eventsData', fetchEvents, {
    refetchInterval: 2000, // Запрашиваем данные каждые 2 секунды
  });

  return (
    <div className="event-list-container">
      <h1 style={{ textAlign: 'center', fontSize: '24px' }}>
        Статистика входов и выходов (последние 100 записей)
      </h1>      
      {isLoading && <p>Загрузка...</p>}
      {isError && <p>Ошибка: {isError.message}</p>}

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>№</th>
              <th>ФИО</th>
              {/* <th>ИИН</th> */}
              <th>ID Рег.</th>
              <th>Дата</th>
              <th>Время</th>
              <th>Вход/Выход</th>
              <th>Подразделения</th>
            </tr>
          </thead>
          <tbody>
            {events && events.length > 0 ? (
              events.map((event, index) => (
                <tr key={event.ID_REG || index}>
                  <td>{index + 1}</td>
                  <td>{event.FULL_FIO}</td>
                  {/* <td>{event.TABEL_ID}</td> */}
                  <td>{event.ID_REG}</td>
                  <td>{new Date(event.DATE_EV).toLocaleDateString()}</td>
                  <td>{new Date(event.TIME_EV).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}</td>
                  <td>{event.ENTRY_EXIT}</td>
                  <td>{event.CLASS_NAME}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8">Нет данных для отображения</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EventList;
