import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './MessageForm.css';

const MessageForm = () => {
  const [qrCodeData, setQrCodeData] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState('');
  const [media, setMedia] = useState('');
  const [apiUrl, setApiUrl] = useState(''); // State for API URL
  const [isClientReady, setIsClientReady] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);

  useEffect(() => {
    checkClientReady();
  }, []);

  const fetchQrCodeData = async () => {
    try {
      const response = await fetch('http://localhost:3008/qr-code');
      if (response.ok) {
        const data = await response.json();
        setQrCodeData(data.qrCodeData);
        setShowQrCode(true);
      } else {
        throw new Error('Failed to fetch QR code data.');
      }
    } catch (error) {
      console.error('Error fetching QR code data:', error);
    }
  };

  const checkClientReady = async () => {
    try {
      const response = await fetch('http://localhost:3008/is-client-ready');
      if (response.ok) {
        setIsClientReady(true);
      } else {
        throw new Error('Failed to check client readiness.');
      }
    } catch (error) {
      console.error('Error checking client readiness:', error);
    }
  };

  const handleSendMessage = async () => {
    try {
      setIsSending(true);
      setIsSending(true);
      const response = await fetch('http://localhost:3008/send-message', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: message, media: media, apiUrl:apiUrl }),
      });

      if (response.status === 200) {
        toast.success('Mesajlar gönderilmeye Başladı!', {
          position: 'top-right',
          autoClose: 3000,
          hideProgressBar: true,
        });
      } else {
        throw new Error('Mesaj gönderilirken bir hata oluştu.');
      }
    } catch (error) {
      console.error('Mesaj gönderilirken hata oluştu:', error);
      toast.error('Mesaj gönderilirken bir hata oluştu.', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: true,
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleShowQrCode = () => {
    if (!qrCodeData) {
      fetchQrCodeData();
    } else {
      setShowQrCode(true);
    }
  };

  return (
    <div className="container">
      <div className="qr-code-container">
        {showQrCode ? (
          qrCodeData ? (
            <img src={qrCodeData} alt="QR Kodu" />
          ) : (
            <p>Oturum açıkken QR kod okutmaya gerek yoktur ...</p>
          )
        ) : (
          <button className="qr-code"  onClick={handleShowQrCode}>Bağlantı yok ise QR Kodu Göster</button>
        )}
      </div>
      <input
        className="api-url-input"
        value={apiUrl}
        onChange={(e) => setApiUrl(e.target.value)}
        placeholder="API URL'sini girin..."
      />
      {isClientReady && <p>Toplu WhatsApp Mesajı gönderime hazır!</p>}
      <input
        className="media-url"
        value={media}
        onChange={(e) => setMedia(e.target.value)}
        placeholder="Media URL girin..."
      />
      <textarea
        className="message-textarea"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Mesajınızı girin..."
      />

      <button
        type="button"
        className="send-button"
        onClick={handleSendMessage}
        disabled={isSending}
      >
        {isSending ? 'Mesajlar Gönderiliyor...' : 'Toplu Mesaj Gönder'}
      </button>

      <ToastContainer />
    </div>
  );
};

export default MessageForm;
