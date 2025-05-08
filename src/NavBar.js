
import { useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import axios from 'axios';
import main_image from './templates/main.png';

const HeaderNavbar = () => {
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
        <div>
          <div id="asosiy_template">
            {/* Navbar */}
            <nav id="asosiy_navbar">
              <div className="navbar-container">
                <Link to="/" className="navbar-logo">
                  <img src={main_image} alt="Logo" />
                  ProjectsPlatform
                </Link>


                {/* Navbar Links */}
                
                <div className={`navbar_links_div ${isMenuOpen ? 'show' : ''}`}>
                {/* Menu Toggle Button */}
                <button className="menu-toggle" onClick={toggleMenu}>
                  {isMenuOpen ? '×' : '≡'}
                </button>
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
                </ul></div>
              </div>
            </nav>
          </div>
          <div style={{height: "100px"}}></div>
          <Outlet />
        </div>)
}

export default HeaderNavbar;
