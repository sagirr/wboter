const { Client} = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

// WhatsApp Web oturumu için client oluşturun ve kimlik doğrulama ayarlarını yapın
const client = new Client();

// QR kodunu tarayarak oturum açın
client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

// Oturum açıldığında tetiklenir
client.on('ready', () => {
  console.log('WhatsApp Web Botu hazır!');
});

const allowedGroups = ['120363138627374068@g.us', '120363047629481017@g.us','120363048160925795@g.us'];


// WhatsApp Web oturumunu başlatın
client.initialize();

// Daha önce gönderilmiş mesajları ve içeriklerini saklayacağımız nesne
// Daha önce gönderilmiş mesajları ve içeriklerini saklayacağımız nesne
const sentMessages = {};

async function sendGroupMessage(groupId, message) {
  try {
    // Daha önce gönderilen mesajlar içerisinde bu mesajın içeriğini ve gönderenini kontrol et
    const messageContent = message;
    const messageId = groupId;

    // Check if the message with the same content and ID has already been sent
    const isDuplicateMessage = sentMessages.hasOwnProperty(messageId)
      ? sentMessages[messageId].content === messageContent
      : false;

    if (!isDuplicateMessage) {
      // Mesajı gönder
      await client.sendMessage(groupId, messageContent);
      console.log('Mesaj başarıyla gönderildi:', messageContent);

      // Gönderilen mesaj ve göndereni sentMessages nesnesine ekle
      sentMessages[messageId] = {
        content: messageContent,
      };
    } else {
      console.log('Aynı veya benzer içerikte mesaj daha önce gönderilmiş:', messageContent);
    }
  } catch (error) {
    console.error('Hata oluştu:', error);
  }
}


const keywordsGroup1 = ['dönüş', 'gidecek', 'uygun', 'acil','boş dönen','araç var'];
const keywordsGroup2 = ['tapu','dönüş boş','daire','aracım boştadır','boştur','kira','saman','pres','dönüş yapacak','aracım boş','boş çıkış yap','dönüşüm boş','aracı yükü olana'];
const keywordsGroup3 = ['euro','tl','transfer', 'uçak','valiz','zarf','bilet','kargo','yolcu','taksi','para','rent','car','tiran'];

// Mesajları izleyen olay dinleyicisi
client.on('message', (message) => {
 
 

  const text = message.body.toLowerCase();

//  console.log(message);
  // 1. Grup Anahtar Kelimelerini Kontrol Et
  let shouldSendGroup1 = false;
  for (const keyword of keywordsGroup1) {
    if (text.includes(keyword)) {
      shouldSendGroup1 = true;
      break;
    }
  }

  // 2. Grup Anahtar Kelimelerini Kontrol Et
  let shouldSendGroup2 = false;
  for (const keyword of keywordsGroup2) {
    if (text.includes(keyword)) {
      shouldSendGroup2 = true;
      break;
    }
  }

  let shouldSendGroup3 = false;
  for (const keyword of keywordsGroup3) {
    if (text.includes(keyword)) {
      shouldSendGroup3 = true;
      break;
    }
  }

 


  const isGroupMessage = !!message.from && !!message.to && !!message.author;

  if (isGroupMessage ) {
    // Sadece 1. grup anahtar kelimelerini içeren mesajları gönder
    //console.log('Anahtar kelime grubu 1 bulundu. Mesaj:', message.body);
        if (shouldSendGroup1 && !shouldSendGroup2 ) {

        //console.log(message._data.author);
        sendGroupMessage('120363138627374068@g.us', message.body + ' Tel : ' + message._data.author.split('@c.us')[0]);
     
      } else {



console.log(message._data.id.remote);

        if (
          message._data.id.remote == '120363142014441970@g.us' ||
          message._data.id.remote == '120363047629481017@g.us' ||
          message._data.id.remote == '120363048160925795@g.us'
        ) {
          const foundKeywords = keywordsGroup3.filter(keyword =>
            lowerCaseMessage.includes(keyword.toLowerCase())
          );
          console.log(foundKeywords);
          
          if (foundKeywords.length > 0) {
            const phoneNumber1 = '905326736445@c.us';
            const phoneNumber2 = '905522854340@c.us';
            const phoneNumber3 = '38268717458@c.us';
            const recipients = [phoneNumber1, phoneNumber2, phoneNumber3];
        
            recipients.forEach(recipient => {
              sendGroupMessage(
                recipient,
                'LikeT. Bot: ' +
                  message.body +
                  ' Tel : ' +
                  message._data.author.split('@c.us')[0]
              );
            
            });
          }
        }
        
   





      } 
    

  }


});

/*
const keywordsGroup4 = ['Balıkesir', 'sakarya','sivas','konya'];

// 5 dakikada bir tekrarlanan işlemi gerçekleştiren fonksiyon
async function checkUnreadMessages() {
 
client.on('unread_count', async (chat) => {
  try {
    // Tüm sohbetleri (chats) al
    const chats = await client.getChats();

    for (const chat of chats) {
      const unreadMessages = await chat.fetchMessages({ limit: 2 });

      // Elde edilen bütün okunmamış mesajları işleyin veya dilediğiniz gibi kullanın.
      for (const message of unreadMessages) {
        const text = message.body.toLowerCase();

        const foundKeywords4 = keywordsGroup4.filter(keyword => text.includes(keyword.toLowerCase()));

        if (foundKeywords4.length > 0) {
          console.log('kimden no: ', message._data.author);
          console.log(' içerik', message._data.body);
   
          console.log('-------------------------');
        }
      }
    }
  } catch (error) {
    console.error('Hata oluştu:', error);
  }
});
}

// İlk çalıştırma ve ardından her 5 dakikada bir işlemi tekrarla
checkUnreadMessages(); // İlk çalıştırma
setInterval(checkUnreadMessages, 5 * 60 * 1000); // Her 5 dakikada bir tekrarla

*/
