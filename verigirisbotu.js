const puppeteer = require('puppeteer');
const fetch = require('node-fetch');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Tarayıcıyı başlat ve sayfayı aç
async function openBrowserAndPage() {
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    return { browser, page };
}

// Verileri çek ve sayfayı doldur
async function fetchAndFillData(page) {
    try {
        const response = await fetch('http://localhost/r10/vericek/wpbotexcel.php');
        const data = await response.json();

        await page.goto('http://localhost/r10/datagir/', { timeout: 30000 });

        const priceInputs = await page.$$('input[name="price-input"]');
        const quantityInputs = await page.$$('input[name="quantity-input"]');

        for (let i = 0; i < data.length; i++) {
            const price = data[i][2];
            const quantity = data[i][3];

            if (price !== null) {
                await priceInputs[i].type(price.toString());
            }

            if (quantity !== null) {
                await quantityInputs[i].type(quantity.toString());
            }

            await page.evaluate(() => {
                document.activeElement.blur();
            });

            await page.waitForTimeout(1000);
        }

        console.log('İşlem tamamlandı.');
    } catch (error) {
        console.error('Hata:', error);
    }
}

// Sunucu
const server = http.createServer((req, res) => {
    if (req.url === '/') {
        const htmlPath = path.join(__dirname, 'index.html');
        fs.readFile(htmlPath, (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Sunucu hatası');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else if (req.url === '/start') {
        (async () => {
            const { browser, page } = await openBrowserAndPage();
            await fetchAndFillData(page);
            // Kapatmak istediğinizde: await browser.close();
        })();
        res.writeHead(200);
        res.end('İşlem başlatıldı. Tarayıcı penceresini kontrol edin.');
    }
});

const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Server çalışıyor: http://localhost:${PORT}`);
});
