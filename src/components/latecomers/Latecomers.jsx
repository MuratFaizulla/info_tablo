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

const fetchHouses = async () => {
  const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/houses`);
  return data;
};

const Latecomers = () => {
  const { data: latecomers, isLoading, error } = useQuery("latecomers", fetchLatecomers, {
    refetchInterval: 60000,
  });
  const { data: houses, isLoading: housesLoading } = useQuery("houses", fetchHouses, {
    refetchInterval: 300000,
  });

  if (isLoading || housesLoading) return <div className={styles.loading}><span className={styles.spinner} /></div>;
  if (error) return <div className={styles.error}>Ошибка загрузки</div>;

  const houseList = houses || [];

  const getHouseName = (cls) => {
    const h = houseList.find(h => h.classes.includes(cls));
    return h ? h.name : null;
  };

  const enriched = latecomers
    .map((p) => ({ ...p, HOUSE_NAME: getHouseName(p.CLASS_NAME) }))
    .filter((p) => p.HOUSE_NAME);

  const grouped = houseList.reduce((a, h) => { a[h.name] = 0; return a; }, {});
  enriched.forEach((p) => { grouped[p.HOUSE_NAME] += p.LATE_COUNT; });

  const sorted = Object.entries(grouped).sort((a, b) => b[1] - a[1]);
  const maxValue = Math.max(...sorted.map(([, v]) => v), 1);
  const yMax = Math.ceil(maxValue * 1.3);

  const chartData = {
    labels: sorted.map(([k]) => k),
    // datasets: [{
    //   data: sorted.map(([, v]) => v),
    //   backgroundColor: sorted.map((_, i) =>
    //     i === 0 ? 'rgba(211,47,47,0.82)' :
    //     i === 1 ? 'rgba(230,126,0,0.78)' :
    //     'rgba(128,195,66,0.78)'
    //   ),
    //   borderColor: sorted.map((_, i) =>
    //     i === 0 ? '#D32F2F' : i === 1 ? '#E67E00' : '#5a9a28'
    //   ),
    //   borderWidth: 1,
    //   borderRadius: 5,
    // }],
    datasets: [{
  data: sorted.map(([, v]) => v),
  backgroundColor: 'rgba(128,195,66,0.78)',
  borderColor: 'rgba(128,195,66,0.78)',
  borderWidth: 1,
  borderRadius: 5,
}],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { top: 26 } },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#5a9a28',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#80c342',
        borderWidth: 1,
        titleFont: { family: 'Montserrat', weight: 'bold', size: 13 },
        bodyFont: { family: 'Inter', size: 13 },
      },
      datalabels: {
        display: true,
        color: '#1a2e0d',
        font: { weight: 'bold', size: 14, family: 'Montserrat' },
        formatter: (v) => v > 0 ? v : '',
        anchor: 'end',
        align: 'top',
        offset: 2,
        clip: false,
      },
    },
    scales: {
      y: {
        min: 0,
        max: yMax,
        grid: { color: '#f1f8e9' },
        ticks: { display: false },
      },
      x: {
        grid: { display: false },
        ticks: {
          color: '#3d5c1a',
          font: { size: 11, family: 'Montserrat', weight: '600' },
          maxRotation: 35,
        },
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