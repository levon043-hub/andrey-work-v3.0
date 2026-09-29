const projects=[
 {id:'sapphire',name:'Sapphire Cars',category:'Аренда автомобилей'},
 {id:'pierre',name:'Pierre',category:'Интерьеры и материалы'},
 {id:'draft',name:'Драфт',category:'Креативное агентство'},
 {id:'milliken',name:'Милликен',category:'Кабельные решения'},
 {id:'remstan',name:'ПКФ Ремстан',category:'Промышленный сервис'},
 {id:'omega',name:'ОмегаПром',category:'Энергетика'},
 {id:'udmgarant',name:'UDMGARANT',category:'Юридические услуги'}
];
const track=document.querySelector('.gallery-track');
track.innerHTML=projects.map(p=>`<button class="project-card" data-project="${p.id}" aria-label="Открыть работу ${p.name}"><div class="project-window"><img src="assets/${p.id}.jpg" alt="Скриншот сайта ${p.name}" loading="lazy" draggable="false"></div><div class="project-meta"><strong>${p.name}</strong><small>${p.category}</small></div></button>`).join('');
const cards=[...track.children], gallery=document.querySelector('.gallery');
let current=1, startX=0, startY=0, dragged=false, down=false;
function renderGallery(){
 const width=gallery.clientWidth, narrow=width<768, spacing=narrow?width*.82:Math.min(width*.42,570);
 cards.forEach((card,i)=>{let d=i-current; card.style.transform=`translate(-50%,-50%) translateX(${d*spacing}px) translateZ(${-Math.abs(d)*110}px) rotateY(${Math.max(-40,Math.min(40,-d*23))}deg) scale(${d===0?1:.9})`;card.style.opacity=Math.abs(d)>2?'0':d===0?'1':'.65';card.style.zIndex=String(10-Math.abs(d));card.style.pointerEvents=Math.abs(d)>1?'none':'auto';card.tabIndex=d===0?0:-1;card.setAttribute('aria-current',String(d===0));card.setAttribute('aria-hidden',String(Math.abs(d)>1));card.inert=Math.abs(d)>1;});
 document.querySelector('#gallery-status').textContent=`${projects[current].name} / ${projects[current].category}`;
 document.querySelector('.previous').disabled=current===0;document.querySelector('.next').disabled=current===projects.length-1;
}
function advance(n){current=Math.max(0,Math.min(projects.length-1,current+n));renderGallery()}
document.querySelector('.previous').onclick=()=>advance(-1);document.querySelector('.next').onclick=()=>advance(1);
gallery.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();advance(e.key==='ArrowRight'?1:-1);cards[current].focus({preventScroll:true})}});
gallery.addEventListener('pointerdown',e=>{if(e.button!==0)return;startX=e.clientX;startY=e.clientY;dragged=false;down=true});
gallery.addEventListener('pointermove',e=>{if(down&&Math.abs(e.clientX-startX)>12)dragged=true});
window.addEventListener('pointerup',e=>{if(!down)return;down=false;let dx=e.clientX-startX,dy=e.clientY-startY;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)){dragged=true;advance(dx<0?1:-1)}setTimeout(()=>dragged=false,0)});
gallery.addEventListener('pointercancel',()=>{down=false;dragged=false});
new ResizeObserver(renderGallery).observe(gallery);renderGallery();
const dialog=document.querySelector('.project-dialog'), full=document.querySelector('.project-full'), scrollArea=document.querySelector('.dialog-scroll');let lastFocus;
document.addEventListener('click',e=>{const el=e.target.closest('[data-project]');if(!el||dragged)return;const p=projects.find(p=>p.id===el.dataset.project);if(!p)return;lastFocus=el;document.querySelector('#project-title').textContent=p.name;full.alt=`Полный скриншот сайта ${p.name}`;full.hidden=false;document.querySelector('.image-error').hidden=true;full.src=`assets/${p.id}.jpg`;scrollArea.classList.remove('zoomed');document.querySelector('.zoom-toggle').textContent='Масштаб 100%';dialog.showModal();document.body.style.overflow='hidden';scrollArea.scrollTop=0;document.querySelector('.close-dialog').focus();});
full.onerror=()=>{full.hidden=true;document.querySelector('.image-error').hidden=false};
document.querySelector('.close-dialog').onclick=()=>dialog.close();
dialog.addEventListener('click',e=>{if(e.target===dialog)dialog.close()});
dialog.addEventListener('close',()=>{document.body.style.overflow='';lastFocus?.focus()});
document.querySelector('.zoom-toggle').onclick=e=>{const zoom=scrollArea.classList.toggle('zoomed');e.currentTarget.textContent=zoom?'По ширине':'Масштаб 100%'};
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
const reduce=window.matchMedia('(prefers-reduced-motion: reduce)');
const stage=document.querySelector('.name-stage'),letters=[...document.querySelectorAll('.footer-name span')];let footerFrame;
stage.addEventListener('pointermove',e=>{if(reduce.matches||e.pointerType==='touch')return;cancelAnimationFrame(footerFrame);footerFrame=requestAnimationFrame(()=>{letters.forEach(letter=>{const r=letter.getBoundingClientRect();const proximity=Math.max(0,1-Math.abs(e.clientX-r.x-r.width/2)/260);letter.style.transform=`translateY(${-proximity*38}px) rotateX(${proximity*12}deg)`;});});});
stage.addEventListener('pointerleave',()=>{cancelAnimationFrame(footerFrame);letters.forEach(l=>l.style.transform='')});
reduce.addEventListener('change',()=>{cancelAnimationFrame(footerFrame);letters.forEach(l=>l.style.transform='')});
function updateClock(){document.querySelector('#clock').textContent=new Intl.DateTimeFormat('ru-RU',{timeZone:'Europe/Moscow',hour:'2-digit',minute:'2-digit',second:'2-digit'}).format(new Date())}updateClock();setInterval(updateClock,1000);
