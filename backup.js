require('dotenv').config();
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false }); // headless: false para ver el navegador en acción
  const page = await browser.newPage();

  try {
    // Navegar a Google Drive
    await page.goto('https://drive.google.com');

    // Ingresar el correo electrónico
    await page.type('#identifierId', process.env.GOOGLE_EMAIL);
    await page.click('#identifierNext'); // Hacer clic en "Siguiente"

    // Esperar a que aparezca el campo de la contraseña
    await page.waitForSelector('input[name="password"]', { visible: true });
    
    // Ingresar la contraseña
    await page.type('input[name="password"]', process.env.GOOGLE_PASSWORD);
    await page.click('#passwordNext'); // Hacer clic en "Siguiente"
    
    // Esperar a que la página de Google Drive se cargue
    await page.waitForNavigation();

    // Aquí podrías agregar la lógica para subir un archivo o realizar otras acciones en Google Drive

  } catch (error) {
    console.error("Error durante la automatización:", error);
  } finally {
    // Cerrar el navegador
    await browser.close();
  }
})();
