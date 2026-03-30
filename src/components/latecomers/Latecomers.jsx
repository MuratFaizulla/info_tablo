import React from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import styles from "./Latecomers.module.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const fetchLatecomers = async () => {
  const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/family_four_quarter`);
  return data;
};

const houseNames = {
  Қазығұрт: ["8G", "9F", "8K", "10F"],
  Атамекен: ["7L", "8N", "10M", "12A"],
  Ордабасы: ["7K", "8A", "9E", "8B"],
  Хантағы: ["9A", "9L", "11B", "11A"],
  Мұзтау: ["7A", "9M", "10C", "11C"],
  Тұран: ["7B", "9D", "10A", "10K"],
  Алаш: ["7C", "8C", "8F", "11L", "11K"],
  Отырар: ["7D", "9B", "9K", "10B"],
  Оқжетпес: ["7N", "9N", "11N", "11E"],
  Фараб: ["8L", "8D", "11M", "12K"],
  Арыстанды: ["7E", "8M", "10D", "11D"],
  Яссы: ["7M", "8E", "9C", "10L"],
};

const getHouseName = (c) =>
  Object.keys(houseNames).find((h) => houseNames[h].includes(c)) || null;

const Latecomers = () => {
  const { data: latecomers, isLoading, error } = useQuery("latecomers", fetchLatecomers, {
    refetchInterval: 60000,
  });

  if (isLoading) return <div className={styles.loading}><span className={styles.spinner} /></div>;
  if (error) return <div className={styles.error}>Ошибка загрузки</div>;

  const enriched = latecomers
    .map((p) => ({ ...p, HOUSE_NAME: getHouseName(p.CLASS_NAME) }))
    .filter((p) => p.HOUSE_NAME);

  const grouped = Object.keys(houseNames).reduce((a, h) => { a[h] = 0; return a; }, {});
  enriched.forEach((p) => { grouped[p.HOUSE_NAME] += p.LATE_COUNT; });

  const sorted = Object.entries(grouped).sort((a, b) => b[1] - a[1]);

  const makeColor = (i, alpha) => {
   
    return `#80c342`;          // NIS blue rest
  };
const maxValue = Math.max(...sorted.map(([, v]) => v));

const yMax = Math.max(10, Math.ceil(maxValue * 1.2));
  const chartData = {
    labels: sorted.map(([k]) => k),
    datasets: [{
      data: sorted.map(([, v]) => v),
      backgroundColor: sorted.map((_, i) => makeColor(i, 0.85)),
      borderColor: sorted.map((_, i) => makeColor(i, 1)),
      borderWidth: 1,
      borderRadius: 4,
    }],
  };

  const options = {

    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        top: 30,   // 👈 ВОТ ЭТО главное
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#003F8A',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#1A8FE3',
        borderWidth: 1,
      },
      datalabels: {
        display: true,
        color: '#4877b4',
        font: { weight: 'bold', size: 14, family: 'Montserrat' },
        formatter: (v) => v > 0 ? v : '',
        anchor: 'end',
        align: 'top',   
        offset: 4,      
        clip: false,   
      },
    },
    scales: {
  y: {
    min: 0,
    max: yMax, // 👈 динамический потолок
    grid: { display: false },
    ticks: { display: false },
  },
  x: {
    grid: { display: false },
    ticks: { color: '#445A7A', font: { size: 14 }, maxRotation: 35 },
  },
},
  };

  return (
    <div className={styles.container}>
      <div className={styles.panelTitle}>
        <span className={styles.dot} />
        Опоздания по шаңырақам
      </div>
      <div className={styles.chartWrap}>
        <Bar data={chartData} options={options} />
      </div>
    </div>
  );
};

export default Latecomers;