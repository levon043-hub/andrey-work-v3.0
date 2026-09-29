(() => {
 const root=document.documentElement, curtain=document.querySelector('.intro-curtain');
 if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 root.classList.add('intro-active');
 const start=performance.now(), duration=1600, count=curtain.querySelector('.intro-count'), bar=curtain.querySelector('.intro-progress');
 let finished=false;
 const finish=()=>{if(finished)return;finished=true;root.classList.remove('intro-active');root.classList.add('intro-done');count.textContent='100';bar.style.transform='scaleX(1)';};
 // This counter is an entrance sequence, not a network-loading percentage.
 function tick(now){if(finished)return;const progress=Math.min(1,(now-start)/duration);count.textContent=String(Math.floor(progress*100)).padStart(3,'0');bar.style.transform=`scaleX(${progress})`;if(progress<1)requestAnimationFrame(tick);else finish();}
 requestAnimationFrame(tick);setTimeout(finish,2300);
 document.addEventListener('keydown',finish,{once:true});
})();
