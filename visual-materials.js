function renderVisualMap(){
 const host=document.querySelector("#visualMap"); if(!host||!window.COURSE_MATERIALS)return;
 host.innerHTML=window.COURSE_MATERIALS.main.sections.map(s=>{
  const pages=s.pages||[s.printedPage], range=pages.length>1?"P. "+pages[0]+"–"+pages[pages.length-1]:"P. "+pages[0];
  return '<article class="visual-item"><div><span class="page-ref">APOSTILA · '+range+'</span><h3>'+s.title+'</h3><p>Material de apoio vinculado à apostila do curso.</p></div><button class="source-badge visual-open" data-key="'+s.key+'">VER MATERIAL</button></article>'
 }).join("");
 host.querySelectorAll(".visual-open").forEach(b=>b.addEventListener("click",()=>openVisualSection(b.dataset.key)));
}
function getPdfUrl(file){
 return file ? encodeURI(file) : "";
}
function openVisualSection(key){
 const s=window.COURSE_MATERIALS.main.sections.find(x=>x.key===key); if(!s)return;
 openPdfSupport(s.title,s.pdfFile,s.pdfPages||[1],s.pages||[s.printedPage]);
}
function openPdfSupport(title,pdfFile,pdfPages,printedPages){
 let index=0; pdfPages=Array.isArray(pdfPages)?pdfPages:[pdfPages]; printedPages=Array.isArray(printedPages)?printedPages:[printedPages];
 let modal=document.querySelector("#visualViewer");
 if(!modal){modal=document.createElement("div");modal.id="visualViewer";modal.className="visual-viewer";document.body.appendChild(modal)}
 modal.innerHTML='<div class="viewer-panel single"><button class="viewer-close" aria-label="Fechar">×</button><div class="viewer-heading"><div><p class="eyebrow">MATERIAL DE APOIO</p><h2>'+title+'</h2></div><span id="viewerCounter"></span></div><div class="single-stage"><button class="slide-arrow prev" aria-label="Página anterior">‹</button><figure id="viewerPage"></figure><button class="slide-arrow next" aria-label="Próxima página">›</button></div><div class="viewer-dots" id="viewerDots"></div><p class="viewer-help">Use as setas para navegar entre as páginas deste material.</p></div>';
 modal.classList.add("open"); const fig=modal.querySelector("#viewerPage"),counter=modal.querySelector("#viewerCounter"),dots=modal.querySelector("#viewerDots");
 function draw(){
  const pdfPage=pdfPages[index], printed=printedPages[index]||printedPages[printedPages.length-1]||"";
  if(pdfFile){
   const src=getPdfUrl(pdfFile)+"#page="+pdfPage+"&zoom=page-fit&toolbar=0&navpanes=0&scrollbar=0";
   fig.innerHTML='<object class="pdf-page" data="'+src+'" type="application/pdf"><iframe class="pdf-page" src="'+src+'" title="'+title+' — página '+printed+'"></iframe></object><figcaption>Apostila · página '+printed+'</figcaption>';
  }else fig.innerHTML='<div class="page-placeholder"><strong>Página '+printed+'</strong><span>Material de apoio ainda não vinculado</span></div>';
  counter.textContent="Página "+(index+1)+" de "+pdfPages.length+" · p. "+printed;
  modal.querySelector(".prev").disabled=index===0; modal.querySelector(".next").disabled=index===pdfPages.length-1;
  dots.innerHTML=pdfPages.map((_,i)=>'<button aria-label="Ir para página '+(i+1)+'" class="'+(i===index?"active":"")+'" data-i="'+i+'"></button>').join("");
  dots.querySelectorAll("button").forEach(b=>b.onclick=()=>{index=Number(b.dataset.i);draw()});
 }
 modal.querySelector(".viewer-close").onclick=()=>modal.classList.remove("open");
 modal.querySelector(".prev").onclick=()=>{if(index>0){index--;draw()}};
 modal.querySelector(".next").onclick=()=>{if(index<pdfPages.length-1){index++;draw()}};
 modal.onclick=e=>{if(e.target===modal)modal.classList.remove("open")};
 modal.onkeydown=e=>{if(e.key==="ArrowLeft"&&index>0){index--;draw()}if(e.key==="ArrowRight"&&index<pdfPages.length-1){index++;draw()}if(e.key==="Escape")modal.classList.remove("open")};
 modal.tabIndex=-1;modal.focus();draw();
}
(function initVisualMaterials(){
 let scheduled=false; function mount(){scheduled=false;const host=document.querySelector("#visualMap");if(host&&window.COURSE_MATERIALS&&!host.dataset.mounted){host.dataset.mounted="1";renderVisualMap()}}
 function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(mount)}}
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",schedule);else schedule();
 new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true}); window.addEventListener("hashchange",schedule);
})();
function openSupportMaterial(title,pages,assetBase,pdfFile,pdfPages){if(pdfFile)return openPdfSupport(title,pdfFile,pdfPages||[1],pages);pages=Array.isArray(pages)?pages:[pages];let index=0;let modal=document.querySelector("#visualViewer");if(!modal){modal=document.createElement("div");modal.id="visualViewer";modal.className="visual-viewer";document.body.appendChild(modal)}modal.innerHTML='<div class="viewer-panel single"><button class="viewer-close" aria-label="Fechar">×</button><div class="viewer-heading"><div><p class="eyebrow">MATERIAL DE APOIO</p><h2>'+title+'</h2></div><span id="viewerCounter"></span></div><div class="single-stage"><button class="slide-arrow prev">‹</button><figure id="viewerPage"></figure><button class="slide-arrow next">›</button></div><div class="viewer-dots" id="viewerDots"></div></div>';modal.classList.add("open");const fig=modal.querySelector("#viewerPage"),counter=modal.querySelector("#viewerCounter"),dots=modal.querySelector("#viewerDots");function draw(){const p=pages[index],asset=assetBase?assetBase+"/pagina-"+p+".webp":null;fig.innerHTML=asset?'<img src="'+asset+'" alt="'+title+' — página '+p+'"><figcaption>Apostila · página '+p+'</figcaption>':'<div class="page-placeholder"><strong>Página '+p+'</strong><span>Material de apoio em preparação</span></div>';counter.textContent="Página "+(index+1)+" de "+pages.length+" · p. "+p;modal.querySelector(".prev").disabled=index===0;modal.querySelector(".next").disabled=index===pages.length-1;dots.innerHTML=pages.map((_,i)=>'<button class="'+(i===index?"active":"")+'" data-i="'+i+'"></button>').join("");dots.querySelectorAll("button").forEach(b=>b.onclick=()=>{index=+b.dataset.i;draw()})}modal.querySelector(".viewer-close").onclick=()=>modal.classList.remove("open");modal.querySelector(".prev").onclick=()=>{if(index){index--;draw()}};modal.querySelector(".next").onclick=()=>{if(index<pages.length-1){index++;draw()}};draw()}
function bindSupportButtons(){document.querySelectorAll(".support-open").forEach(b=>{if(b.dataset.bound)return;b.dataset.bound="1";b.onclick=()=>openSupportMaterial(b.dataset.title,(b.dataset.pages||"").split(",").filter(Boolean).map(Number),b.dataset.asset||"",b.dataset.pdf||"", (b.dataset.pdfPages||"").split(",").filter(Boolean).map(Number))})}
new MutationObserver(bindSupportButtons).observe(document.documentElement,{childList:true,subtree:true});document.addEventListener("DOMContentLoaded",bindSupportButtons);

let inlinePdfLibPromise=null;
async function ensureInlinePdfLib(){
 if(window.pdfjsLib)return window.pdfjsLib;
 if(inlinePdfLibPromise)return inlinePdfLibPromise;
 inlinePdfLibPromise=new Promise((resolve,reject)=>{
   const existing=document.querySelector('script[data-inline-pdfjs="1"]');
   if(existing){existing.addEventListener("load",()=>resolve(window.pdfjsLib),{once:true});existing.addEventListener("error",reject,{once:true});return;}
   const s=document.createElement("script");
   s.dataset.inlinePdfjs="1";
   s.src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js";
   s.onload=()=>{window.pdfjsLib.GlobalWorkerOptions.workerSrc="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";resolve(window.pdfjsLib)};
   s.onerror=reject;
   document.head.appendChild(s);
 }).catch(()=>null);
 return inlinePdfLibPromise;
}
async function renderInlinePdfFigures(){
 const figures=[...document.querySelectorAll(".inline-pdf-figure:not([data-rendered])")];
 if(!figures.length)return;
 const lib=await ensureInlinePdfLib();
 if(!lib)return;
 for(const fig of figures){
   fig.dataset.rendered="1";
   try{
     const pdf=await lib.getDocument(encodeURI(fig.dataset.pdf)).promise;
     const page=await pdf.getPage(Number(fig.dataset.page||1));
     const viewport=page.getViewport({scale:2});
     const full=document.createElement("canvas"); full.width=viewport.width; full.height=viewport.height;
     await page.render({canvasContext:full.getContext("2d"),viewport}).promise;
     let sx=0,sy=0,sw=full.width,sh=full.height;
     if(fig.dataset.crop){
       const [x,y,w,h]=fig.dataset.crop.split(",").map(Number);
       sx=full.width*x; sy=full.height*y; sw=full.width*w; sh=full.height*h;
     }
     const canvas=document.createElement("canvas"); canvas.width=Math.round(sw); canvas.height=Math.round(sh);
     canvas.getContext("2d").drawImage(full,sx,sy,sw,sh,0,0,canvas.width,canvas.height);
     const old=fig.querySelector(".inline-visual-loading"); if(old)old.remove();
     fig.insertBefore(canvas,fig.querySelector("figcaption"));
   }catch(e){
     fig.removeAttribute("data-rendered");
     const old=fig.querySelector(".inline-visual-loading"); if(old)old.textContent="Não foi possível carregar esta imagem.";
   }
 }
}
document.addEventListener("DOMContentLoaded",renderInlinePdfFigures);
