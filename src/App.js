import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './account/login';
import Register from './account/register';
import Dashboard from './account/dashboard';
import ResetPassword from './account/resetpassword.js';
import Home from './home';
import About from './about';
import Activation from './account/activation';
import KundalikCom from './kundalikcom.js';
import './home.css';
import KundalikCOM from './account/dashboard/kundalikcom.js';
import Xarajatlar from './account/dashboard/xarajatlar.js';
import Settings from './account/dashboard/sozlamalar.js';
import AddLogins from './add_logins.js';
import AdminPanel from './adminpanel.js';
import HeaderNavbar from './navbar.js';

function App() {

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

        <Route path="/" element={HeaderNavbar} >
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/kundalikcom" element={<KundalikCom />} />
          <Route path="/activation" element={<Activation />} />
          <Route path="/maktabga_login_parolni_tanitish/:param" element={<AddLogins />} />
          <Route path="/adminpanel/:admin_token" element={<AdminPanel />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
