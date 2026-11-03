'use strict';
/* E2E PDF A5 sobre el paquete público, usando motores auténticos de Firefox/WebKit.
 * Verifica descarga, formato físico, identidad y ausencia de bloqueos.
 * FORJA_PUBLIC_ROOT=dist/public-drs node tests/pdf-a5-multimotor.cjs
 */
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const http=require('node:http');
const {firefox,webkit}=require('playwright');
const {PDFDocument}=require('pdf-lib');
const root=path.resolve(process.env.FORJA_PUBLIC_ROOT||path.resolve(__dirname,'..'));
const types={'.html':'text/html','.js':'text/javascript','.json':'application/json',
  '.svg':'image/svg+xml','.css':'text/css','.pdf':'application/pdf',
  '.ttf':'font/ttf','.txt':'text/plain'};
const server=http.createServer((req,res)=>{
  let url;
  try{url=new URL(req.url,'http://127.0.0.1');}
  catch(e){res.writeHead(400);res.end();return;}
  const p=path.resolve(root,'.'+(url.pathname==='/'?'/index.html':decodeURIComponent(url.pathname)));
  if(!p.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  fs.readFile(p,(err,data)=>{
    if(err){res.writeHead(404);res.end();return;}
    res.writeHead(200,{'Content-Type':types[path.extname(p)]||'application/octet-stream',
      'Cache-Control':'no-store'});
    res.end(data);
  });
});
async function verificar(nombre,engine,url){
  const browser=await engine.launch({headless:true});
  try{
    const context=await browser.newContext({acceptDownloads:true,viewport:{width:1280,height:860}});
    const page=await context.newPage(),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.goto(url,{waitUntil:'domcontentloaded'});
    await page.locator('#estado').getByText('Datos listos',{exact:false}).waitFor({timeout:60000});
    await page.locator('#generar').click();
    const button=page.locator('.exportar-pdf-ficha').first();
    await button.waitFor({timeout:60000});
    const [download]=await Promise.all([page.waitForEvent('download',{timeout:90000}),button.click()]);
    assert(download.suggestedFilename().endsWith('-A5.pdf'),nombre+': nombre del archivo');
    const bytes=fs.readFileSync(await download.path());
    assert.equal(bytes.subarray(0,5).toString('ascii'),'%PDF-');
    const pdf=await PDFDocument.load(bytes);
    assert(pdf.getPageCount()>=1);
    for(const p of pdf.getPages()){
      const size=p.getSize();
      assert(Math.abs(size.width-419.528)<1&&Math.abs(size.height-595.276)<1,
        nombre+': todas las páginas deben ser A5');
    }
    assert.deepEqual(errors,[],nombre+': errores JS');
    console.log('OK '+nombre+': descarga PDF A5 real, '+pdf.getPageCount()+
      ' páginas; '+bytes.length+' bytes');
    await context.close();
  }finally{await browser.close();}
}
(async()=>{
  await new Promise((resolve,reject)=>{
    server.once('error',reject);server.listen(0,'127.0.0.1',resolve);
  });
  try{
    const url='http://127.0.0.1:'+server.address().port+'/';
    await verificar('Firefox',firefox,url);
    await verificar('WebKit',webkit,url);
  }finally{
    await new Promise(resolve=>server.close(resolve));
  }
})().catch(e=>{console.error(e);process.exitCode=1;});
