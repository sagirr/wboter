const express = require('express');
const { Client, MessageMedia, LocalAuth, NoAuth } = require('whatsapp-web.js');
const http = require('http');
const axios = require('axios');
const qrcode = require('qrcode');
const path = require('path');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const server = http.createServer(app);
const port = 3008;

// API ve react uygulamasının adreslerini burada belirleyin
const { apinumaravemesaj, reactport } = require('./api-urls');

const corsOptions = {
  origin: reactport, // React uygulamasının adresi
  credentials: true,
};

app.use(cors(corsOptions));

const client = new Client({
  authStrategy: new  LocalAuth (),
  puppeteer: {
    args: ['--no-sandbox'],
  },
});

let qrCodeData = null;
let apiPhoneNumberList = [];
let   qrCodeFilePath;
client.on('qr', (qr) => {
  qrCodeData = qr;
   qrCodeFilePath = __dirname + '/public/qrCode.png';

  qrcode.toFile(qrCodeFilePath, qr, (error) => {
    if (error) {
      console.error('Error generating QR code:', error);
    } else {
      console.log('QR code generated successfully!');
    }
  });
});



app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});



const db = new sqlite3.Database('db/users.db');

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT UNIQUE, password TEXT)');
});

app.post('/register', (req, res) => {
  const { username, password } = req.body;

  console.log(username);
  
  if (!username || !password) {
    return res.status(400).json({ error: 'Kullanıcı adı ve şifre gerekli' });
  }

  db.get('SELECT * FROM users WHERE username = ?', [username], (error, row) => {
    if (error) {
      return res.status(500).json({ error: 'Veritabanı hatası' });
    }

    if (row) {
      return res.status(400).json({ error: 'Kullanıcı adı zaten kullanılıyor' });
    }

    db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, password], (error) => {
      if (error) {
        return res.status(500).json({ error: 'Veritabanı hatası' });
      }
      res.status(200).json({ message: 'OK' });
    });
  });
});


app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Kullanıcı adı ve şifre gerekli' });
  }

  // Kullanıcıyı veritabanından sorgulayın
  db.get('SELECT * FROM users WHERE username = ?', [username], (error, row) => {
    if (error) {
      return res.status(500).json({ error: 'Veritabanı hatası' });
    }

    if (!row) {
      return res.status(401).json({ error: 'Geçersiz kullanıcı adı veya şifre' });
    }

    if (row.password !== password) {
      return res.status(401).json({ error: 'Geçersiz kullanıcı adı veya şifre' });
    }

    res.sendStatus(200);
  });
});










// WhatsApp Web oturumunu başlatın
client.initialize();

// API'den verileri al ve numaraları kullanılacak formata çevir
async function getApiData(url) {
  try {
    const response = await axios.get(url);
    const jsonData = response.data;

    apiPhoneNumberList = jsonData.map(item => [item[0], item[1]]);

    console.log('API verileri alındı:', apiPhoneNumberList);
  } catch (error) {
    console.error('API verileri alınırken hata oluştu:', error);
  }
}

async function sendMessager(phoneNumber, messageContent, mediaurl) {
  try {
    // Mesajı gönder
    const mediaPath = mediaurl;


    const mediapost = await MessageMedia.fromUrl(mediaPath);

    await Promise.all([
      client.sendMessage(phoneNumber + '@c.us', mediapost),
      client.sendMessage(phoneNumber + '@c.us', messageContent)
    ]);
    

    console.log('Mesaj başarıyla gönderildi:', messageContent);

    // Sıradaki numarayı işlemek için bekleyin
    await new Promise((resolve) => setTimeout(resolve, 5000));
  } catch (error) {
    console.error('Hata oluştu:', error);
  }
}


let currentIndex = 0;

let messager = '';
let medias = 'http://localhost/r10/vericek/img/resim.jpeg';
let apiurls='';

app.post('/send-message', async (req, res) => {
  currentIndex = 0;

  messager = req.body.message;
  medias = req.body.media;
  apiurls = req.body.apiUrl;

  console.log( apiurls+'--'+medias+'-'+messager );

  if (apiurls !== '') {
    getApiData(apiurls); // Assuming apinumaravemesaj is the API endpoint to get data
  }

  res.sendStatus(200);
});

client.on('message', async (message) => {

  
   console.log(message._data.id.remote);
  
    
  if(apiurls!==""){
console.log(message._data.id.remote);

    if(message._data.id.remote=='905510107939@c.us')  { 
        if (currentIndex < apiPhoneNumberList.length) {
          const phoneNumber = apiPhoneNumberList[currentIndex][1];
          console.log('cr: ' + currentIndex);
          const lastFourDigits = phoneNumber;
        
          const messageContent = messager+' #'+lastFourDigits;
          const mediaurl = medias;
          console.log(mediaurl);
          await sendMessager(phoneNumber, messageContent, mediaurl);
          
          currentIndex++;
        } else {
          console.log('Tüm numaralara mesaj gönderildi.');
        }
        
      }


  }
  
  });
  
  



app.get('/qr-code', (req, res) => {

  res.json({ qrCodeData: './qrCode.png' });
});


client.on('authenticated', () => {

  console.log('Authenticated');


});

app.get('/is-client-ready', (req, res) => {

 
  res.json('clientReady');
});


server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});