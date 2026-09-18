function renderVisualMap(){
 const host=document.querySelector("#visualMap"); if(!host||!window.COURSE_MATERIALS)return;
 host.innerHTML=window.COURSE_MATERIALS.main.sections.map(s=>{
   const range=s.pages&&s.pages.length>1 ? "P. "+s.pages[0]+"–"+s.pages[s.pages.length-1] : "P. "+s.printedPage;
   return '<article class="visual-item"><div><span class="page-ref">APOSTILA · '+range+'</span><h3>'+s.title+'</h3><p>'+(s.pages?"Sequência visual identificada e preparada para exibição integral.":"Conteúdo visual mapeado para incorporação.")+'</p></div><button class="source-badge visual-open" data-key="'+s.key+'">VER SEÇÃO</button></article>'
 }).join("");
 host.querySelectorAll(".visual-open").forEach(b=>b.onclick=()=>openVisualSection(b.dataset.key));
}
function openVisualSection(key){
 const s=window.COURSE_MATERIALS.main.sections.find(x=>x.key===key); if(!s)return;
 let modal=document.querySelector("#visualViewer"); if(!modal){modal=document.createElement("div");modal.id="visualViewer";modal.className="visual-viewer";document.body.appendChild(modal)}
 const pages=s.pages||[s.printedPage];
 modal.innerHTML='<div class="viewer-panel"><button class="viewer-close" aria-label="Fechar">×</button><p class="eyebrow">MATERIAL ORIGINAL</p><h2>'+s.title+'</h2><p>Páginas '+pages.join(", ")+' da apostila.</p><div class="viewer-pages">'+pages.map(p=>'<figure><div class="page-placeholder"><strong>Página '+p+'</strong><span>Prancha original mapeada</span></div><figcaption>Apostila · p. '+p+'</figcaption></figure>').join("")+'</div></div>';
 modal.classList.add("open"); modal.querySelector(".viewer-close").onclick=()=>modal.classList.remove("open");
}