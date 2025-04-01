import React from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels"; // Импорт плагина
import styles from "./Latecomers.module.css";

// Регистрация плагинов
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

const fetchLatecomers = async () => {
  const { data } = await axios.get(
    `${process.env.REACT_APP_API_URL}/family_four_quarter`
  );
  return data;
};

const houseNames = {
  Қазығұрт: ["7C", "8A", "9N", "10N"],
  Атамекен: ["7N", "9M", "11A", "12A"],
  Ордабасы: ["7B", "10K", "11K", "12B"],
  Хантағы: ["7A", "8L", "10A", "12C"],
  Мұзтау: ["7D", "8M", "9C", "10C"],
  Тұран: ["8F", "8D", "9A", "9K"],
  Алаш: ["7F", "9F", "10L", "12K"],
  Отырар: ["7K", "8B", "9B", "10F"],
  Оқжетпес: ["7E", "8N", "10E"],
  Фараб: ["7L", "8C", "8K", "10M"],
  Арыстанды: ["7M", "9D", "9E", "10D"],
  Яссы: ["7G", "8E", "9L", "10B"],
};

const getHouseName = (className) => {
  return (
    Object.keys(houseNames).find((house) =>
      houseNames[house].includes(className)
    ) || "Неизвестный шаңырақ"
  );
};

const Latecomers = () => {
  const {
    data: latecomers,
    isLoading,
    error,
  } = useQuery("latecomers", fetchLatecomers, {
    refetchInterval: 60000,
  });

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

  // Группировка по шаңыракам
  const groupedByHouse = Object.keys(houseNames).reduce((acc, house) => {
    acc[house] = 0; // инициализация счетчика
    return acc;
  }, {});

  // Считаем количество опоздавших по каждому шаңыраку
  enrichedLatecomers.forEach((person) => {
    groupedByHouse[person.HOUSE_NAME]++;
  });

  // Сортировка по количеству опоздавших (по убыванию)
  const sortedGroupedByHouse = Object.entries(groupedByHouse)
    .sort((a, b) => b[1] - a[1]) // Сортируем по значению (количеству)
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});

  // Данные для графика
  const chartData = {
    labels: Object.keys(sortedGroupedByHouse), // Названия шаңыраков
    datasets: [
      {
        label: "Опоздавшие",
        data: Object.values(sortedGroupedByHouse), // Количество опоздавших
        backgroundColor: "#607D8B", // Синий
        borderColor: "rgba(54, 162, 235, 1)",
        hoverBackgroundColor: "rgba(54, 162, 235, 1)",
        hoverBorderColor: "rgba(54, 162, 235, 1)",
      },
    ],
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Статистика опозданий по шаңырақам</h2>
      <div className={styles.chartContainer}>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: "Опоздавшие на 4 четверть",
              },
              tooltip: {
                enabled: false, // Отключаем тултипы
              },
              datalabels: {
                display: true,
                color: "white", // Цвет текста на столбцах
                font: {
                  weight: "bold",
                  size: 14,
                },
                formatter: (value) => `${value} `, // Форматируем данные на столбцах
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  display: false, // Убираем сетку по оси Y
                },
                ticks: {
                  display: false, // Убираем цифры на оси Y
                },
              },
              x: {
                grid: {
                  display: false, // Убираем сетку по оси X
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};


export default Latecomers;
