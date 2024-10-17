import React from 'react';
import { Routes, Route} from 'react-router-dom';
import { routes } from './utils/routes';
import './App.css';
import Home from './pages/HomePage';
// import 'bootstrap/dist/css/bootstrap.min.css';



function App() {
 
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        {routes.map((route, index) => (
          <Route key={index} path={route.path} element={<route.element />} />
        ))}
      </Routes>
    </div>
  );
}

export default App;
