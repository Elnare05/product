import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './Routes/Home';
import Contact from './Routes/Contact';
import About from './Routes/About'; 
import '@fortawesome/fontawesome-free/css/all.min.css';
import PageContainer from './container/PageContainer';
import SignUp from './Routes/SignUp';
import Login from './Routes/Login';
const App = () => {
  return (
    <div>
      <Navbar />
      <Routes>   
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
      </Routes>
 
    </div>
  );
};

export default App;
