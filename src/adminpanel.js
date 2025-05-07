// Admin panel page
import "./adminpanel.css";
import { useState, useEffect } from "react";
import { useParams } from 'react-router-dom';


const AdminPanel = () => {
    const [usersCount, setUsersCount] = useState(0);
    const [mobileCount, setMobileCount] = useState(0);
    const [kundalikcomCount, setKundalikcomCount] = useState(0);
    const [paymentStatus, setPaymentStatus] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    // Urldan admin_token ni olish
    const { admin_token } = useParams();
    const YOUR_TOKEN = admin_token || "";
    const apiBaseUrl = "https://api.projectsplatform.uz";
  
    useEffect(() => {
      const fetchData = async (endpoint) => {
        try {
          const response = await fetch(`${apiBaseUrl}${endpoint}`);
          const data = await response.json();
          return data;
        } catch (error) {
          console.error("API Error:", error);
          return "Error";
        }
      };
  
      const loadStats = async () => {
        const usersData = await fetchData(`/admin/get-users?token=${YOUR_TOKEN}`);
        const mobileData = await fetchData(`/admin/get-mobilekundalikcom?token=${YOUR_TOKEN}`);
        const pcData = await fetchData(`/admin/get-pckundalikcom?token=${YOUR_TOKEN}`);
        setUsersCount(usersData?.users?.length || 0);
        setMobileCount(mobileData?.mobilekundalikcom?.length || 0);
        setKundalikcomCount(pcData?.pckundalikcom?.length || 0);
      };
  
      loadStats();
    }, [YOUR_TOKEN]);
  
    const handlePaymentSubmit = async (e) => {
      e.preventDefault();
      setPaymentStatus("🔄 Biroz kuting ...");
      const form = e.target;
      const tgId = form["tg-id"].value;
      const amount = form["amount"].value;
      const description = form["description"].value;
      const paymentFile = form["payment-file"].files[0];
  
      const formData = new FormData();
      formData.append("tg_id", tgId);
      formData.append("tulov_summasi", amount);
      formData.append("bio", description);
      formData.append("payment_chek_img", paymentFile);
      formData.append("admin_token", YOUR_TOKEN);
  
      try {
        const response = await fetch(`${apiBaseUrl}/admin/payment`, {
          method: "POST",
          body: formData
        });
  
        const result = await response.json();
        if (response.ok) {
          setPaymentStatus("✅ To'lov muvaffaqiyatli qo'shildi!");
        } else {
          throw new Error(result.detail || "❌ Xatolik yuz berdi");
        }
      } catch (error) {
        setPaymentStatus(`Xatolik: ${error.message}`);
      }
    };
  
    const handleSearchSubmit = async (e) => {
      e.preventDefault();
      const query = e.target["search-query"].value.trim();
      try {
        const response = await fetch(`${apiBaseUrl}/admin/find_user`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ admin_token: YOUR_TOKEN, text: query })
        });
  
        const res = await response.json();
        if (response.ok && res.users.length > 0) {
          setSearchResults(res.users);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Xatolik:", error);
        setSearchResults([]);
      }
    };




    return (
    <div className="admin-panel">
        <div className="container">
            <header className="header">
                <h1 style={{color: "rgb(0, 145, 113)", textShadow: "0 0 2px rgba(0, 0, 0, 0.253)"}}>Admin Panel</h1>
                <input style={{display: "none"}} id="admin_token" value="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImJleHJ1emRldmVsb3BlciIsInBhc3N3b3JkIjoiYWJkZWl4MTAwNiIsInRnX2lkIjo1MTM5MzEwOTc4LCJleHAiOjE3OTU2NzQyMzR9.UVwMuU5nZ_dZv0W5VzG5vtj9SgFrxzJ1NzgsSJLC900"/>
            </header>
            <main>
                <h2>Statistika</h2>
                <section className="stats">
                    <div id="stats-container">
                        <div className="stat-item">
                            <h3>Products</h3>
                            <p id="usersCount-count">{ usersCount || "Loading..."}</p>
                        </div>
                        <div className="stat-item">
                            <h3>Mobile</h3>
                            <p id="mobile-count">{ mobileCount || "Loading..."}</p>
                        </div>
                        <div className="stat-item">
                            <h3>KundalikCOM</h3>
                            <p id="kundalikcom-count">{ kundalikcomCount || "Loading..."}</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
        <div className="container">
            <section className="search-user">
                <h2>Foydalanuvchini qidirish</h2>
                <form id="search-form" onSubmit={handleSearchSubmit}>
                    <div style={{
                        display: 'flex',
                        gap: '10px'
                        }}>
                        <input type="text" id="search-query" name="query" placeholder="Username yoki Ism" />
                        <button type="submit">Qidirish</button>
                    </div>
                </form>
                <div id="search-results">
                {searchResults.length > 0 ? searchResults.map(user => (
                    <div key={user.id} className="result-item" onClick={() => setSelectedUser(user)}>
                        <strong>ID:</strong> {user.id}<br />
                        <strong>Username:</strong> {user.username}<br />
                        <strong>Ism:</strong> {user.full_name}<br />
                        <strong>Email:</strong> {user.email}<br />
                        <strong>Telefon:</strong> {user.phone}
                    </div>
                    )) : <p style={{color: 'orange'}}>Natijalar topilmadi.</p>}
                </div>
                {selectedUser && (
                    <div id="payment-card">
                    <div className="container">
                        <main>
                            <section className="payment">
                                <h1 style={{
                                    textAlign: 'center',
                                    color: 'green'
                                    }}>To'lov qo'shish</h1>
                                <h2><strong>ID:</strong> {selectedUser.id} <br />{selectedUser.full_name}</h2>
                                <strong>Username:</strong> {selectedUser.username}<br />
                                <form id="payment-form" onSubmit={handlePaymentSubmit}>
                                    <div id="payment-data">:</div>
                                    <input type="number" id="tg-id" name="tg-id" required defaultValue={selectedUser.tg_id}/>

                                    <label htmlFor="amount">To'lov summasi:</label>
                                    <input type="number" id="amount" name="amount" required />

                                    <label htmlFor="bio">To'lov haqida:</label>
                                    <textarea id="description" name="bio" rows="4" cols="50" required>Bizga ishonch bildirganingiz uchun rahmat!</textarea>

                                    <label htmlFor="file">To'lov tasdig'i (rasm):</label>
                                    <input type="file" id="payment-file" name="file" required />

                                    <button type="submit">Yuborish</button>
                                </form>
                                <p id="payment-status">{paymentStatus}</p>
                            </section>

                        </main>
                    </div>
                    <button id="payment-page-close" onClick={() => setSelectedUser(null)}></button>
                </div>
                )}
            </section>
            
        </div>
    </div>
    )
}



export default AdminPanel;