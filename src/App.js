import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Outlet } from 'react-router-dom';
import Login from './account/login';
import Register from './account/register';
import Dashboard from './account/dashboard';
import ResetPassword from './account/resetpassword.js';
import Home from './home';
import About from './about';
import Activation from './account/activation';
import axios from 'axios';
import main_image from './templates/main.png';
import KundalikCom from './kundalikcom.js';
import './home.css';
import KundalikCOM from './account/dashboard/kundalikcom.js';
import Xarajatlar from './account/dashboard/xarajatlar.js';
import Settings from './account/dashboard/sozlamalar.js';
import AddLogins from './add_logins.js';


function App() {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false); // yangi holat

  // Tokenni tekshirish
  useEffect(() => {
    const checkUserToken = async () => {
      const token = localStorage.getItem('authToken'); // Tokenni localStorage'dan olish
      if (token) {
        try {
          const response = await axios.post('https://api.projectsplatform.uz/accounts/about_account', { token });
          if (response.data && response.data.full_name) {
            setIsUserLoggedIn(true); // Foydalanuvchi tizimga kirgan bo'lsa
          }
        } catch (error) {
          console.error('Token bilan foydalanuvchi topilmadi', error);
        }
      }
    };

    checkUserToken();
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };


  return (
    <Router>
      {/* Routes */}
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} >
          <Route path="" element={<div>
            <h1>Shaxsiy kabinetga Xush kelibsiz!</h1><h2 style={{color: "grey"}}>Biz bilan barchasi oson</h2>
            <div className="dashboard-buttons">
              {/* Foydalanish */}
              <a href='/dashboard/kundalikcom' className="card">
                <div className="icon">📋</div>
                <span className="text">Foydalanish</span>
              </a>
              {/* Xarajatlar */}
              <a href='/dashboard/xarajatlar' className="card">
                <div className="icon">💸</div>
                <span className="text">Xarajatlar</span>
              </a>
              {/* Sozlamalar */}
              <a href='/dashboard/sozlamalar' className="card">
                <div className="icon">⚙️</div>
                <span className="text">Sozlamalar</span>
              </a>
            </div>
          </div>} />
          <Route path="kundalikcom" element={<KundalikCOM />} />
          <Route path="xarajatlar" element={<Xarajatlar />} />
          <Route path="sozlamalar" element={<Settings />} />
        </Route>

        <Route path="/" element={<div>
          <div id="asosiy_template">
            {/* Navbar */}
            <nav id="asosiy_navbar">
              <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                  <img src={main_image} alt="Logo" />
                  ProjectsPlatform
                </Link>

                {/* Menu Toggle Button */}
                <button className="menu-toggle" onClick={toggleMenu}>
                  {isMenuOpen ? '×' : '≡'}
                </button>

                {/* Navbar Links */}
                <ul className={`navbar-links ${isMenuOpen ? 'show' : ''}`} style={{ margin: "0" }}>
                  <li className="asosiy_navbar_item">
                    <Link to="/" onClick={toggleMenu}>BOSH SAHIFA</Link>
                  </li>
                  <li className="asosiy_navbar_item">
                    <Link to="/about" onClick={toggleMenu}>BIZ HAQIMIZDA</Link>
                  </li>
                  <li className="asosiy_navbar_item">
                    <Link to="/kundalikcom" onClick={toggleMenu}>KundalikCOM</Link>
                  </li>
                  {/* Foydalanuvchi tizimga kirgan bo'lsa, Dashboard tugmasi ko'rsatiladi */}
                  {isUserLoggedIn ? (
                    <li className="register-button">
                      <a href="/dashboard" onClick={toggleMenu}>Dashboard</a>
                    </li>
                  ) : (
                    <li className="register-button">
                      <a href="/register" onClick={toggleMenu}>BEPUL BOSHLASH</a>
                    </li>
                  )}
                </ul>
              </div>
            </nav>
          </div>
          <Outlet />
        </div>} >
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/kundalikcom" element={<KundalikCom />} />
          <Route path="/activation" element={<Activation />} />
          <Route path="/maktabga_login_parolni_tanitish/:param" element={<AddLogins />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
