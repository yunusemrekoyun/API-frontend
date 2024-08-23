import React, { useState } from 'react';
import './TransferPage.css'; // Stil dosyalarını ayırıyoruz

function TransferPage() {
  const [senderId, setSenderId] = useState('');
  const [receiverId, setReceiverId] = useState('');
  const [amount, setAmount] = useState('');
  const [resultMessage, setResultMessage] = useState('');
  const [animationClass, setAnimationClass] = useState('');

  const handleTransfer = async (event) => {
    event.preventDefault();
    // Burada form validasyonları yapılır
    if (!senderId || !receiverId || !amount || amount <= 0) {
      setResultMessage('Tüm alanları doldurmanız gerekmektedir ve miktar pozitif olmalıdır.');
      setAnimationClass('fail');
      return;
    }

    // Transfer API isteği
    const response = await fetch('https://localhost:7265/api/Transfer/transfer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        senderId: parseInt(senderId, 10),
        receiverId: parseInt(receiverId, 10),
        amount: parseFloat(amount)
      })
    });

    const result = await response.json();
    if (response.ok) {
      setAnimationClass('success');
    } else {
      setAnimationClass('fail');
    }
    setResultMessage(result.message);
  };

  return (
    <div className="transfer-container">
      <h2>Para Transferi</h2>
      <form onSubmit={handleTransfer}>
        <input
          type="number"
          placeholder="Gönderen Id"
          value={senderId}
          onChange={(e) => setSenderId(e.target.value)}
        />
        <input
          type="number"
          placeholder="Alıcı Id"
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
        />
        <input
          type="number"
          placeholder="Transfer Edilecek Bakiye"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <button type="submit">Transfer Yap</button>
      </form>
      <div className={`result-message ${animationClass}`}>{resultMessage}</div>
    </div>
  );
}

export default TransferPage;
