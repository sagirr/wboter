const { Client, LocalAuth,MessageMedia } = require('whatsapp-web.js');
const axios = require('axios');
const qrcode = require('qrcode-terminal');

// WhatsApp Web oturumu için client oluşturun ve kimlik doğrulama ayarlarını yapın
const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no-sandbox'],
  },
});

// QR kodunu tarayarak oturum açın
client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

// Oturum açıldığında tetiklenir
client.on('ready', () => {
  console.log('WhatsApp Web Botu hazır!');
});

// WhatsApp Web oturumunu başlatın
client.initialize();

const apiPhoneNumberList = [];
// API'den verileri al ve numaraları kullanılacak formata çevir
async function getApiData() {
  try {
    const response = await axios.get('http://localhost/r10/vericek/wpbotexcel.php');
    const jsonData = response.data;

    for (const item of jsonData) {
      const name = item[0];
      const phoneNumber = item[1];
      apiPhoneNumberList.push([name, phoneNumber]);
    }

    console.log('API verileri alındı:', apiPhoneNumberList);

    // Mesajları ve numaraları göndermek için fonksiyonu çağır
    //sendMessagesToNumbers(apiPhoneNumberList);

  } catch (error) {
    console.error('API verileri alınırken hata oluştu:', error);
  }
}


let currentIndex = 0; // apiPhoneNumberList dizisinin indeksini takip etmek için değişken

// Belirli bir kişiye mesaj göndermek için fonksiyon
async function sendMessage(phoneNumber, messageContent) {
  try {
    // Mesajı gönder

    const mediaPath = 'img/resim1.jpeg';

    const media = MessageMedia.fromFilePath(mediaPath);
  
    await client.sendMessage(phoneNumber + '@c.us',media );
    await client.sendMessage(phoneNumber + '@c.us',messageContent );

    console.log('Mesaj başarıyla gönderildi:', messageContent);

    // Sıradaki numarayı işlemek için bekleyin
    await new Promise((resolve) => setTimeout(resolve, 10000));

    
  } catch (error) {
    console.error('Hata oluştu:', error);
  }
}

// Mesajları izleyen olay dinleyicisi
client.on('message', (message) => {
  // Message olayı burada dinlenir ve herhangi bir mesaj geldiğinde burası çalışır
  const text = message.body.toLowerCase();

  // Sadece bir numaraya mesaj gönder
  if (currentIndex < apiPhoneNumberList.length) {
    const phoneNumber = apiPhoneNumberList[currentIndex][1];
    const messageContent = `Looking to boost your Google Maps reviews?🌟🌟🌟🌟🌟\n\nIncrease your Google Maps score with 5-star ratings and personalized comments of your choice.💯💯💯\n\nYou can improve your Google Maps score by utilizing this service. It can help minimize the impact of negative reviews.✅✅✅`+phoneNumber;
    sendMessage(phoneNumber, messageContent);

    currentIndex++;
  
  } else {

    console.log('Tüm numaralara mesaj gönderildi.');
 
  }

});

getApiData();