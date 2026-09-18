function renderVisualMap(){
 const host=document.querySelector("#visualMap"); if(!host||!window.COURSE_MATERIALS)return;
 host.innerHTML=window.COURSE_MATERIALS.main.sections.map(s=>'<article class="visual-item"><div><span class="page-ref">APOSTILA · P. '+s.printedPage+'</span><h3>'+s.title+'</h3><p>'+(s.type==="visual"?"Conteúdo visual: a prancha original será exibida aqui sem redesenho dos sinais.":"Conteúdo misto: texto digital + elementos visuais originais.")+'</p></div><span class="source-badge">FONTE ORIGINAL</span></article>').join("");
}