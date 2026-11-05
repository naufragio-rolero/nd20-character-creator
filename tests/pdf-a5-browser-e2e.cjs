'use strict';
/* E2E: generación auténtica, clic en PDF A5, descarga e inspección.
 * Las dependencias tienen que estar preparadas por scripts/preparar-vendor-pdf-a5.cjs.
 */
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const {PDFDocument}=require('pdf-lib');
const root=path.resolve(process.env.FORJA_PUBLIC_ROOT||path.resolve(__dirname,'..'));
const tipos={'.js':'text/javascript','.css':'text/css','.html':'text/html',
  '.svg':'image/svg+xml','.json':'application/json','.pdf':'application/pdf',
  '.ttf':'font/ttf','.txt':'text/plain'};
const server=http.createServer((req,res)=>{
  let parsed;
  try{parsed=new URL(req.url,'http://127.0.0.1');}catch(e){res.writeHead(400);res.end();return;}
  const file=path.resolve(root,'.'+decodeURIComponent(parsed.pathname==='/'?'/index.html':parsed.pathname));
  if(!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  fs.readFile(file,(err,bytes)=>{
    if(err){res.writeHead(404);res.end();return;}
    res.writeHead(200,{'Content-Type':tipos[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});
    res.end(bytes);
  });
});
async function main(){
  await new Promise((resolve,reject)=>{
    server.once('error',reject);server.listen(0,'127.0.0.1',resolve);
  });
  let browser;
  try{
    browser=await chromium.launch({channel:'chrome',headless:true,args:['--no-sandbox']});
    const context=await browser.newContext({acceptDownloads:true});
    const page=await context.newPage();
    const errores=[];
    page.on('pageerror',e=>errores.push(e.message));
    await page.goto('http://127.0.0.1:'+server.address().port+'/',{waitUntil:'domcontentloaded'});
    await page.waitForFunction(()=>!document.querySelector('#generar').disabled,{timeout:45000});
    await page.click('#generar');
    await page.waitForSelector('.exportar-pdf-ficha',{timeout:45000});
    assert.equal(await page.locator('.exportar-pdf-ficha').count(),1);
    // Comprobar descarga individual con dependencias cargadas de nuestro servidor.
    const [download]=await Promise.all([
      page.waitForEvent('download',{timeout:90000}),
      page.click('.exportar-pdf-ficha')
    ]);
    const fname=download.suggestedFilename();
    assert(fname.endsWith('-A5.pdf'),fname);
    const file=await download.path();
    const bytes=fs.readFileSync(file);
    // Conservar evidencia real del navegador para auditar los pictogramas PDF.
    const qaDir=path.join(path.resolve(__dirname,'..'),'dist','pdf-a5-preimpresion');
    fs.mkdirSync(qaDir,{recursive:true});
    fs.writeFileSync(path.join(qaDir,'e2e-chrome-con-iconos.pdf'),bytes);
    assert(bytes.subarray(0,5).toString('ascii')==='%PDF-');
    const pdf=await PDFDocument.load(bytes);
    assert(pdf.getPageCount()>=1);
    for(const pg of pdf.getPages()){
      const {width,height}=pg.getSize();
      assert(Math.abs(width-419.528)<1&&Math.abs(height-595.276)<1);
    }
    // Regresión fase 4: la tercera pestaña no altera la ficha ni su PDF.
    await page.locator('#tab-criaturas').click();
    assert.equal(await page.locator('#editor-criaturas').isVisible(),true);
    await page.locator('#tab-personajes').click();
    assert.equal(await page.locator('.exportar-pdf-ficha').count(),1);
    assert.deepEqual(errores,[]);
    console.log('OK: navegador Chrome, descarga real '+fname+
      ', '+pdf.getPageCount()+' páginas A5 ('+bytes.length+' bytes)');
  }finally{
    if(browser)await browser.close();
    await new Promise(resolve=>server.close(resolve));
  }
}
main().catch(e=>{console.error(e);process.exitCode=1;});
