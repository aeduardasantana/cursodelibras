function renderVisualMap(){
 const host=document.querySelector("#visualMap"); if(!host||!window.COURSE_MATERIALS)return;
 host.innerHTML=window.COURSE_MATERIALS.main.sections.map(s=>{
  const pages=s.pages||[s.printedPage], range=pages.length>1?"P. "+pages[0]+"–"+pages[pages.length-1]:"P. "+pages[0];
  return '<article class="visual-item"><div><span class="page-ref">APOSTILA · '+range+'</span><h3>'+s.title+'</h3><p>'+(s.pages?"Sequência visual identificada e preparada para exibição integral.":"Conteúdo visual mapeado para incorporação.")+'</p></div><button class="source-badge visual-open" data-key="'+s.key+'">VER SEÇÃO</button></article>'
 }).join("");
 host.querySelectorAll(".visual-open").forEach(b=>b.addEventListener("click",()=>openVisualSection(b.dataset.key)));
}
function openVisualSection(key){
 const s=window.COURSE_MATERIALS.main.sections.find(x=>x.key===key); if(!s)return;
 const pages=s.pages||[s.printedPage]; let index=0;
 let modal=document.querySelector("#visualViewer");
 if(!modal){modal=document.createElement("div");modal.id="visualViewer";modal.className="visual-viewer";document.body.appendChild(modal)}
 modal.innerHTML='<div class="viewer-panel single"><button class="viewer-close" aria-label="Fechar">×</button><div class="viewer-heading"><div><p class="eyebrow">MATERIAL DE APOIO</p><h2>'+s.title+'</h2></div><span id="viewerCounter"></span></div><div class="single-stage"><button class="slide-arrow prev" aria-label="Página anterior">‹</button><figure id="viewerPage"></figure><button class="slide-arrow next" aria-label="Próxima página">›</button></div><div class="viewer-dots" id="viewerDots"></div><p class="viewer-help">Use as setas ou deslize para o lado.</p></div>';
 modal.classList.add("open");
 const fig=modal.querySelector("#viewerPage"),counter=modal.querySelector("#viewerCounter"),dots=modal.querySelector("#viewerDots");
 function draw(){
  const p=pages[index], asset=s.assetBase?s.assetBase+"/pagina-"+p+".webp":null;
  fig.innerHTML=asset?'<img src="'+asset+'" alt="'+s.title+' — página '+p+'" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><div class="page-placeholder" hidden><strong>Página '+p+'</strong><span>Imagem original será inserida neste endereço</span></div><figcaption>Apostila · página '+p+'</figcaption>':'<div class="page-placeholder"><strong>Página '+p+'</strong><span>Material de apoio mapeada</span></div><figcaption>Apostila · página '+p+'</figcaption>';
  counter.textContent="Página "+(index+1)+" de "+pages.length+" · p. "+p;
  modal.querySelector(".prev").disabled=index===0; modal.querySelector(".next").disabled=index===pages.length-1;
  dots.innerHTML=pages.map((_,i)=>'<button aria-label="Ir para página '+(i+1)+'" class="'+(i===index?"active":"")+'" data-i="'+i+'"></button>').join("");
  dots.querySelectorAll("button").forEach(b=>b.onclick=()=>{index=Number(b.dataset.i);draw()});
 }
 modal.querySelector(".viewer-close").onclick=()=>modal.classList.remove("open");
 modal.querySelector(".prev").onclick=()=>{if(index>0){index--;draw()}};
 modal.querySelector(".next").onclick=()=>{if(index<pages.length-1){index++;draw()}};
 modal.onclick=e=>{if(e.target===modal)modal.classList.remove("open")};
 let startX=null; fig.addEventListener("touchstart",e=>startX=e.changedTouches[0].clientX,{passive:true});
 fig.addEventListener("touchend",e=>{if(startX===null)return;const dx=e.changedTouches[0].clientX-startX;if(Math.abs(dx)>45){if(dx<0&&index<pages.length-1)index++;if(dx>0&&index>0)index--;draw()}startX=null},{passive:true});
 modal.onkeydown=e=>{if(e.key==="ArrowLeft"&&index>0){index--;draw()}if(e.key==="ArrowRight"&&index<pages.length-1){index++;draw()}if(e.key==="Escape")modal.classList.remove("open")};
 modal.tabIndex=-1;modal.focus();draw();
}
// Inicialização resiliente: monta o mapa sempre que a navegação dinâmica inserir #visualMap.
(function initVisualMaterials(){
 let scheduled=false;
 function mount(){
  scheduled=false;
  const host=document.querySelector("#visualMap");
  if(host && window.COURSE_MATERIALS && !host.dataset.mounted){
   host.dataset.mounted="1";
   renderVisualMap();
  }
 }
 function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(mount)}}
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",schedule);else schedule();
 const observer=new MutationObserver(schedule);
 observer.observe(document.documentElement,{childList:true,subtree:true});
 window.addEventListener("hashchange",schedule);
})();