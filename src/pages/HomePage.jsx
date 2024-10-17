import React from 'react';
import StaffBuildingStatus from '../components/staff_building_status/StaffBuildingStatus';
import EventList from '../components/rows 100/EventList';
import BirthdaysList from '../components/BirthdaysList/BirthdaysList';
import Latecomers from '../components/latecomers/Latecomers';

function HomePage() {
  return (
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
  <div style={{ flexBasis: '25%' }}>
    <StaffBuildingStatus />
  </div>
  <div style={{ flexBasis: '75%', display: 'flex', flexDirection: 'column', gap: '20px' }}>
    {/* Компонент EventList будет сверху */}
    <div style={{ width: '100%' }}>
      <EventList />
    </div>
    
    {/* Компоненты Latecomers и BirthdaysList снизу, выстроенные по горизонтали */}
    <div style={{ display: 'flex', justifyContent: 'space-between'}}>
      <div style={{ flex: 1 }}>
        <Latecomers />
      </div>
      <div style={{ flex: 1 }}>
        <BirthdaysList />
      </div>
    </div>
  </div>
</div>


  );
}

export default HomePage;
