(() => {
 const hero=document.querySelector('.immersive-hero'), wall=document.querySelector('.scene-projects');
 const motion=matchMedia('(prefers-reduced-motion: reduce)'), fine=matchMedia('(pointer:fine)'), toggle=document.querySelector('.motion-toggle');
 let paused=motion.matches, visible=true, frame=0, tx=0,ty=0,x=0,y=0;
 function emit(){hero.classList.toggle('motion-paused',paused);toggle.setAttribute('aria-pressed',String(paused));toggle.textContent=paused?'Включить анимацию':'Пауза анимации';hero.dispatchEvent(new CustomEvent('scene-motion',{detail:{paused}}));}
 toggle.addEventListener('click',()=>{paused=!paused;emit();if(!paused)run()});
 motion.addEventListener('change',()=>{paused=motion.matches;tx=ty=0;emit();run()});emit();
 hero.addEventListener('pointermove',e=>{if(paused||!fine.matches)return;const r=hero.getBoundingClientRect();tx=(e.clientX-r.left)/r.width-.5;ty=(e.clientY-r.top)/r.height-.5;hero.dispatchEvent(new CustomEvent('scene-pointer',{detail:{x:tx,y:ty}}));run()});
 hero.addEventListener('pointerleave',()=>{tx=ty=0;hero.dispatchEvent(new CustomEvent('scene-pointer',{detail:{x:0,y:0}}));run()});
 function tick(){frame=0;if(paused||!visible){wall.style.transform='';return;}x+=(tx-x)*.06;y+=(ty-y)*.06;wall.style.transform=`rotateY(${x*8}deg) rotateX(${-y*5}deg) translate3d(${x*-18}px,${y*-14}px,0)`;if(Math.abs(tx-x)+Math.abs(ty-y)>.001)run();}
 function run(){if(!frame)frame=requestAnimationFrame(tick)}
 new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;hero.classList.toggle('scene-offscreen',!visible);hero.dispatchEvent(new CustomEvent('scene-visibility',{detail:{visible}}));if(visible)run();},{threshold:0}).observe(hero);
 const magnet=document.querySelector('.magnetic');
 magnet.addEventListener('pointermove',e=>{if(paused||!fine.matches)return;const r=magnet.getBoundingClientRect();const mx=Math.max(-9,Math.min(9,(e.clientX-r.left-r.width/2)*.12)),my=Math.max(-7,Math.min(7,(e.clientY-r.top-r.height/2)*.18));magnet.style.transform=`translate(${mx}px,${my}px)`});
 for(const event of ['pointerleave','blur'])magnet.addEventListener(event,()=>magnet.style.transform='');
 toggle.addEventListener('click',()=>{magnet.style.transform='';if(paused){wall.style.transform='';tx=ty=x=y=0}});
})();
