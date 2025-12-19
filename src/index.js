// import React, { useEffect, useRef } from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import { BrowserRouter } from 'react-router-dom';
// import { QueryClient, QueryClientProvider } from 'react-query';
// import Snowfall from 'react-snowfall';

// const queryClient = new QueryClient();

// function SantaFly() {
//   const santaRef = useRef(null);

//   useEffect(() => {
//     const santa = santaRef.current;
//     let screenWidth = window.innerWidth;
//     let screenHeight = window.innerHeight;

//     function onResize() {
//       screenWidth = window.innerWidth;
//       screenHeight = window.innerHeight;
//     }

//     window.addEventListener('resize', onResize);

//     function flySanta() {
//       const duration = 8000 + Math.random() * 4000;
//       const fromLeft = Math.random() > 0.5;
//       let startX;
//       let endX;

//       if (fromLeft) {
//         startX = -200;
//         endX = screenWidth + 200;
//         santa.style.transform = 'scaleX(-1)';
//       } else {
//         startX = screenWidth + 200;
//         endX = -200;
//         santa.style.transform = 'scaleX(1)';
//       }

//       const startY = 50 + Math.random() * (screenHeight - 250);
//       const endY = 50 + Math.random() * (screenHeight - 250);

//       santa.style.transition = 'none';
//       santa.style.left = startX + 'px';
//       santa.style.top = startY + 'px';
//       santa.style.opacity = 0;

//       // Принудительный reflow для применения стилей
//       void santa.offsetHeight;

//       santa.style.transition = 'left ' + duration + 'ms linear, top ' + duration + 'ms linear';
//       santa.style.left = endX + 'px';
//       santa.style.top = endY + 'px';

//       setTimeout(function () {
//         santa.style.transition = 'left ' + duration + 'ms linear, top ' + duration + 'ms linear, opacity 1s ease';
//         santa.style.opacity = 1;
//       }, 100);

//       function onEnd(e) {
//         if (e.propertyName === 'left' || e.propertyName === 'top') {
//           santa.style.opacity = 0;
//           santa.removeEventListener('transitionend', onEnd);
//         }
//       }

//       santa.addEventListener('transitionend', onEnd);
//     }

//     const interval = setInterval(function () {
//       setTimeout(flySanta, Math.random() * 8000);
//     }, 10000);

//     setTimeout(flySanta, 2000);

//     return function () {
//       clearInterval(interval);
//       window.removeEventListener('resize', onResize);
//     };
//   }, []);

//   return (
//     <div
//       ref={santaRef}
//       style={{
//         position: 'fixed',
//         width: '150px',
//         height: '150px',
//         pointerEvents: 'none',
//         zIndex: 9999,
//         opacity: 0,
//         transition: 'opacity 1s ease'
//       }}
//     >
//       <img 
//         src="https://www.animatedimages.org/data/media/359/animated-santa-claus-image-0420.gif" 
//         alt="Flying Santa" 
//         style={{
//           width: '100%',
//           height: '100%',
//           objectFit: 'contain'
//         }}
//       />
//     </div>
//   );
// }

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <QueryClientProvider client={queryClient}>
//     <BrowserRouter>
//       <Snowfall snowflakeCount={200} />
//       <SantaFly />
//       <App />
//     </BrowserRouter>
//   </QueryClientProvider>
// );
import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import Snowfall from 'react-snowfall';

const queryClient = new QueryClient();

function SantaFly() {
  const santaRef = useRef(null);

  useEffect(() => {
    const santa = santaRef.current;
    let screenWidth = window.innerWidth;
    let screenHeight = window.innerHeight;

    function onResize() {
      screenWidth = window.innerWidth;
      screenHeight = window.innerHeight;
    }

    window.addEventListener('resize', onResize);

    function flySanta() {
      const duration = 8000 + Math.random() * 4000;
      const fromLeft = Math.random() > 0.5;
      let startX;
      let endX;

      if (fromLeft) {
        startX = -400;
        endX = screenWidth + 400;
        santa.style.transform = 'scaleX(-1)';
      } else {
        startX = screenWidth + 400;
        endX = -400;
        santa.style.transform = 'scaleX(1)';
      }

      const startY = 50 + Math.random() * (screenHeight - 350);
      const endY = 50 + Math.random() * (screenHeight - 350);

      santa.style.transition = 'none';
      santa.style.left = startX + 'px';
      santa.style.top = startY + 'px';
      santa.style.opacity = 0;

      // Принудительный reflow для применения стилей
      void santa.offsetHeight;

      santa.style.transition = 'left ' + duration + 'ms linear, top ' + duration + 'ms linear';
      santa.style.left = endX + 'px';
      santa.style.top = endY + 'px';

      setTimeout(function () {
        santa.style.transition = 'left ' + duration + 'ms linear, top ' + duration + 'ms linear, opacity 1s ease';
        santa.style.opacity = 1;
      }, 100);

      function onEnd(e) {
        if (e.propertyName === 'left' || e.propertyName === 'top') {
          santa.style.opacity = 0;
          santa.removeEventListener('transitionend', onEnd);
          
          // Пауза 5 секунд перед следующим полётом
          setTimeout(flySanta, 5000);
        }
      }

      santa.addEventListener('transitionend', onEnd);
    }

    // Первый полёт через 2 секунды после загрузки
    setTimeout(flySanta, 2000);

    return function () {
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <div
      ref={santaRef}
      style={{
        position: 'fixed',
        width: '300px',
        height: '300px',
        pointerEvents: 'none',
        zIndex: 9999,
        opacity: 0,
        transition: 'opacity 1s ease'
      }}
    >
      <img 
        src="https://www.animatedimages.org/data/media/359/animated-santa-claus-image-0420.gif" 
        alt="Flying Santa" 
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain'
        }}
      />
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <Snowfall snowflakeCount={200} />
      <SantaFly />
      <App />
    </BrowserRouter>
  </QueryClientProvider>
);