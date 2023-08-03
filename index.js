const express = require('express');
const { Client, LocalAuth ,NoAuth} = require('whatsapp-web.js');
const http = require('http');
const socketIO = require('socket.io');
const axios = require('axios');
const qrcode = require('qrcode');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); 
const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const port = 3002;
const { apinumaravemesaj, reactport } = require('./api-urls');

const corsOptions = {
  origin: reactport, // React uygulamasının adresi
  credentials: true, 
};

app.use(cors(corsOptions)); 

const client =  new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox'],
  },
  
});


let qrCodeData = null;
let sentMessages = []; // Gönderilen mesajların durumunu saklayan dizi
let senders = []; // Gönderenlerin adlarını saklayan dizi

client.on('qr', (qr) => {
  qrCodeData = qr;
  const qrCodeFilePath = __dirname + '/public/qrCode.png';

  qrcode.toFile(qrCodeFilePath, qr, (error) => {
    if (error) {
      console.error('Error generating QR code:', error);
    } else {
      console.log('QR code generated successfully!');
    }
  });
});



client.on('ready', () => {
  console.log('Mesaj Gönderim işlemi hazır');
  io.emit('clientReady'); // Socket.io ile 'clientReady' mesajını frontend'e iletiyoruz.
});

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


app.post('/send-message', async (req, res) => {
  const message = req.body.message;

  if (!message) {
    try {
      const response = await axios.get(apinumaravemesaj);
      const data = response.data;

      for (const item of data) {
        const { number, message } = item;
        const formattedNumber = number + '@c.us';

        const delay = Math.floor(Math.random() * 3000) + 3000; // Random delay between 2 and 4 seconds (in milliseconds)

        await wait(delay);

        await client.sendMessage(formattedNumber, message);
        console.log(`Message sent successfully to ${number}`);

        // Mesaj gönderildiğinde durumu 'sent' olarak işaretle ve sentMessages dizisine ekle
        sentMessages.push({ id: formattedNumber, status: 'sent', content: message });
        // Gönderenlerin adını senders dizisine ekle
        senders.push(formattedNumber);

      }

      return res.status(200).send('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      return res.status(500).send('An error occurred while sending the message');
    }
  } else {
    // Eğer textarea doluysa belirtilen mesajı tüm numaralara gönder
    try {
      const response = await axios.get(apinumaravemesaj);
      const data = response.data;

      for (const item of data) {
        const { number } = item;
        const formattedNumber = number + '@c.us';

        const delay = Math.floor(Math.random() * 3000) + 3000; // Random delay between 2 and 4 seconds (in milliseconds)

        await wait(delay);

        await client.sendMessage(formattedNumber, message);
        console.log(`Message sent successfully to ${number}`);
        sentMessages.push({ id: formattedNumber, status: 'sent', content: message });
        // Gönderenlerin adını senders dizisine ekle
        senders.push(formattedNumber);
      }

      return res.status(200).send('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      return res.status(500).send('An error occurred while sending the message');
    }
  }
});


client.initialize();


io.on('connection', (socket) => {

  console.log('A client connected!');

  if (qrCodeData) {
    socket.emit('qrCodeData', qrCodeData);
  }
});


server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

