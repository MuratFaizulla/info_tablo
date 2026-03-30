import React, { useEffect, useState } from 'react';
import StaffBuildingStatus from '../components/staff_building_status/StaffBuildingStatus';
import EventList from '../components/rows 100/EventList';
import BirthdaysList from '../components/BirthdaysList/BirthdaysList';
import Latecomers from '../components/latecomers/Latecomers';
import styles from './homepage.module.css';
import LOGO from '../assets/images/lOGO_ZHAPIRAK.png'

function HomePage() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const timeStr = time.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const dateStr = time.toLocaleDateString('ru-RU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.headerLeft}>
          <div className={styles.logo}>
            <img src={LOGO} alt="Логотип"></img>
          </div>
          <div className={styles.headerTitle}>
            <span className={styles.titleMain}>Информационное табло</span>
            <span className={styles.titleSub}>Назарбаев Интеллектуальные Школы · Туркестан</span>
          </div>
        </div>
        <div className={styles.headerRight}>
          <div className={styles.clock}>{timeStr}</div>
          <div className={styles.date}>{dateStr}</div>
        </div>
      </header>

      <main className={styles.grid}>
        <section className={styles.col1}>
          <StaffBuildingStatus />
        </section>

        <section className={styles.col2}>
          <div className={styles.col2Top}>
            <EventList />
          </div>
          <div className={styles.col2Bottom}>
            <div className={styles.col2BottomLeft}>
              <Latecomers />
            </div>
            <div className={styles.col2BottomRight}>
              <BirthdaysList />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default HomePage;