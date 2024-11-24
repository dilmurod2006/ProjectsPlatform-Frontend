import React, { useEffect, useState } from 'react';
import './xarajatlar.css';
import axios from 'axios';

const Xarajatlar = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      const token = localStorage.getItem('authToken'); // Local Storage'dan tokenni olish
      try {
        const response = await axios.post('https://api.projectsplatform.uz/accounts/get_reports', {
          token // Tokenni tanada yuborish
        });
        setTransactions(response.data);
      } catch (error) {
        console.error("Ma'lumot olishda xato:", error);
      }
    };

    fetchReports();
  }, []);

  const formatCurrency = (amount) => {
    return Intl.NumberFormat('uz-UZ', {
      style: 'decimal'
    }).format(amount);
  };

  const groupByMonth = (data) => {
    return data.reduce((acc, transaction) => {
      const month = new Date(transaction.created_at).toLocaleString('uz-UZ', { month: 'long', year: 'numeric' });
      if (!acc[month]) acc[month] = [];
      acc[month].push(transaction);
      return acc;
    }, {});
  };
  const convertMonthString = (monthStr) => {
    // Oy nomlari ro'yxati
    const monthNames = [
      'Yanvar', 'Fevral', 'Mart', 'Aprel', 'May', 'Iyun', 
      'Iyul', 'Avgust', 'Sentabr', 'Oktyabr', 'Noyabr', 'Dekabr'
    ];
  
    // Stringdan yil va oy qismlarini ajratib olish
    const [year, month] = monthStr.split(' M');
  
    // Oy raqamini 0 indeksiga ega bo'lgan oylar ro'yxatidan olish
    const monthName = monthNames[parseInt(month, 10) - 1]; // Oy raqami 1 dan boshlanadi, shuning uchun 1ni chiqarib tashlaymiz
  
    return `${monthName} ${year}`;
  };
  const groupedTransactions = groupByMonth(transactions);

  return (
    <div className="Xarajatlar">
      <h1>Xarajatlar</h1>
      {Object.entries(groupedTransactions).map(([month, transactions]) => (
        <div key={month} className="month-group">
          <h3>{convertMonthString(month)}</h3>
          <div className="transaction-cards">
            {transactions.map((transaction, index) => (
              <div 
                key={index} 
                className={`transaction-card ${transaction.tulov_summasi > 0 ? 'positive' : 'negative'}`}
              >
                <p>UZS <strong className="amount">{formatCurrency(transaction.tulov_summasi)}</strong> so'm</p>
                <p className="bio">Izoh: <i>{transaction.bio}</i></p>
                <p className="date">
                  {new Date(transaction.created_at).toLocaleDateString('uz-UZ', {
                    year: 'numeric', month: 'numeric', day: 'numeric'
                  })}
                </p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Xarajatlar;
