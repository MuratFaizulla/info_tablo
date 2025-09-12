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
import ChartDataLabels from "chartjs-plugin-datalabels"; 
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
  Қазығұрт: ["8G", "9F", "8K", "10F"],
  Атамекен: ["7L", "8N", "10M", "12A"],
  Ордабасы: ["7K", "8A", "9E", "8B"],
  Хантағы: ["9A", "9L", "11B", "11A"],
  Мұзтау: ["7A", "9M", "10C", "11C"],
  Тұран: ["7B", "9D", "10A", "10K"],
  Алаш: ["7C", "8C","8F", "11L", "11K"],
  Отырар: ["7D", "9B", "9K", "10B"],
  Оқжетпес: ["7N", "9N", "11E", "11E"],
  Фараб: ["8L", "8D", "11M", "12K"],
  Арыстанды: ["7E", "8M", "10D", "11D"],
  Яссы: ["7M", "8E", "9C", "10L"],
};

const getHouseName = (className) => {
  return (
    Object.keys(houseNames).find((house) =>
      houseNames[house].includes(className)
    ) || null
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

  const enrichedLatecomers = latecomers
    .map((person) => ({
      ...person,
      HOUSE_NAME: getHouseName(person.CLASS_NAME),
    }))
    .filter((person) => person.HOUSE_NAME); // убираем "Неизвестный шаңырақ"

  // Группировка по шаңыракам
  const groupedByHouse = Object.keys(houseNames).reduce((acc, house) => {
    acc[house] = 0;
    return acc;
  }, {});

  // Считаем количество опоздавших
  enrichedLatecomers.forEach((person) => {
    groupedByHouse[person.HOUSE_NAME]++;
  });

  // Сортировка по количеству
  const sortedGroupedByHouse = Object.entries(groupedByHouse)
    .sort((a, b) => b[1] - a[1])
    .reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {});

  const chartData = {
    labels: Object.keys(sortedGroupedByHouse),
    datasets: [
      {
        label: "Опоздавшие",
        data: Object.values(sortedGroupedByHouse),
        backgroundColor: "#607D8B",
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
              },
              tooltip: {
                enabled: false,
              },
              datalabels: {
                display: true,
                color: "white",
                font: {
                  weight: "bold",
                  size: 14,
                },
                formatter: (value) => `${value} `,
              },
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  display: false,
                },
                ticks: {
                  display: false,
                },
              },
              x: {
                grid: {
                  display: false,
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
