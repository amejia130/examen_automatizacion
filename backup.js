require('dotenv').config();
const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: false }); // headless: false para ver el navegador en acción
  const page = await browser.newPage();

  try {
    // Navegar a Google Drive
    await page.goto('https://accounts.google.com/v3/signin/identifier?continue=https%3A%2F%2Fdrive.google.com%2Fdrive%2F&emr=1&followup=https%3A%2F%2Fdrive.google.com%2Fdrive%2F&osid=1&passive=1209600&service=wise&ifkv=Ab5oB3oxfwww2-oC9bD_9bY5Zw6LYti2mkQA8WhZgXkkVEXsOd1SeQA3FFp50Ig6TaJ_TVKWy1Or&ddm=0&flowName=GlifWebSignIn&flowEntry=ServiceLogin');

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

    // Subir un archivo
    const filePath = '/ruta/al/archivoa.txt'; 
    await page.waitForSelector('div[aria-label="Nuevo"]');
    await page.click('div[aria-label="Nuevo"]');
    await page.waitForSelector('div[aria-label="Subir archivos"]');
    await page.click('div[aria-label="Subir archivos"]');

    
    const [fileChooser] = await Promise.all([
      page.waitForFileChooser(),
      page.click('div[aria-label="Subir archivos"]'),
    ]);
    await fileChooser.accept([filePath]);

    
    await page.waitForSelector('div[aria-label="Archivo subido"]');
    const successMessage = await page.$eval('div[aria-label="Archivo subido"]', el => el.textContent);
    expect(successMessage).toContain('subido'); // Validar que el mensaje de éxito sea visible

  } catch (error) {
    console.error("Error durante la automatización:", error);
  } finally {
    // Cerrar el navegador
    await browser.close();
  }
})();
