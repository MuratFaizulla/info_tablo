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
    data: latecomers = [],
    isLoading,
    error,
  } = useQuery("latecomers", fetchLatecomers, {
    refetchInterval: 60000,
  });

  if (isLoading) return <div className={styles.loading}>Загрузка...</div>;
  if (error) return <div className={styles.error}>Ошибка загрузки данных</div>;

  // 1. Обогащаем данные информацией о шаңырақе
  const enrichedLatecomers = latecomers.map((person) => ({
    ...person,
    HOUSE_NAME: getHouseName(person.CLASS_NAME),
  }));

  // 2. Группируем по шаңырақам и СУММИРУЕМ LATE_COUNT
  const groupedByHouse = enrichedLatecomers.reduce((acc, person) => {
    const house = person.HOUSE_NAME;
    if (!acc[house]) acc[house] = 0;
    acc[house] += person.LATE_COUNT || 0; // Суммируем опоздания
    return acc;
  }, {});

  // 3. Добавляем шаңырақи с нулевыми значениями
  Object.keys(houseNames).forEach(house => {
    if (!groupedByHouse[house]) groupedByHouse[house] = 0;
  });

  // 4. Сортируем по убыванию количества опозданий
  const sortedEntries = Object.entries(groupedByHouse)
    .sort((a, b) => b[1] - a[1]);

  const chartData = {
    labels: sortedEntries.map(([house]) => house),
    datasets: [
      {
        label: "Суммарное количество опозданий",
        data: sortedEntries.map(([_, count]) => count),
        backgroundColor: "#607D8B",
        borderColor: "rgba(54, 162, 235, 1)",
        borderRadius: 4,
      },
    ],
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Суммарное количество опозданий по шаңырақам</h2>
      <div className={styles.chartContainer}>
        <Bar
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              datalabels: {
                color: "white",
                font: { weight: "bold", size: 14 },
                formatter: (value) => value > 0 ? value : "",
              },
            },
            scales: {
              y: { beginAtZero: true, grid: { display: false }, ticks: { display: false } },
              x: { grid: { display: false } },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Latecomers;