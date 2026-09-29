import * as THREE from './vendor/three.module.js';

const host=document.querySelector('.sculpture'), hero=document.querySelector('.immersive-hero');
try {
 const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio,1.75));
 renderer.setClearColor(0x171816,0);renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.2;
 host.append(renderer.domElement);
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(36,1,.1,50);camera.position.set(0,0,7.8);
 // Original beveled monogram, built as geometry rather than a borrowed model.
 // Softer shoulders, an open counter, slimmer feet, and a deeper sculpted edge.
 const outline=new THREE.Shape();outline.moveTo(-1.42,-1.48);outline.lineTo(-.44,1.37);outline.quadraticCurveTo(-.39,1.53,-.22,1.53);outline.lineTo(.25,1.53);outline.quadraticCurveTo(.4,1.53,.46,1.36);outline.lineTo(1.43,-1.48);outline.quadraticCurveTo(1.46,-1.56,1.34,-1.56);outline.lineTo(.83,-1.56);outline.quadraticCurveTo(.73,-1.56,.7,-1.46);outline.lineTo(.42,-.65);outline.lineTo(-.43,-.65);outline.lineTo(-.71,-1.46);outline.quadraticCurveTo(-.74,-1.56,-.84,-1.56);outline.lineTo(-1.34,-1.56);outline.quadraticCurveTo(-1.45,-1.56,-1.42,-1.48);outline.closePath();
 const hole=new THREE.Path();hole.moveTo(-.36,-.12);hole.lineTo(.35,-.12);hole.lineTo(.035,.92);hole.quadraticCurveTo(0,1.02,-.035,.92);hole.closePath();outline.holes.push(hole);
 const geometry=new THREE.ExtrudeGeometry(outline,{depth:.74,bevelEnabled:true,bevelSegments:8,steps:1,bevelSize:.085,bevelThickness:.12,curveSegments:24});geometry.center();
 const material=new THREE.MeshPhysicalMaterial({color:0xc8ff31,metalness:.64,roughness:.23,clearcoat:.55,clearcoatRoughness:.2});
 const sideMaterial=new THREE.MeshStandardMaterial({color:0x536b1b,metalness:.76,roughness:.25});
 const group=new THREE.Group(),letter=new THREE.Mesh(geometry,[material,sideMaterial]);group.add(letter);
 group.scale.setScalar(.7);
 scene.add(group);
 // A small procedural studio supplies broad, clean reflections on the bevels.
 const studio=new THREE.Scene();studio.background=new THREE.Color(0x55594b);
 const softbox=(x,y,z,sx,sy,intensity)=>{const box=new THREE.Mesh(new THREE.PlaneGeometry(sx,sy),new THREE.MeshBasicMaterial({color:new THREE.Color().setScalar(intensity),side:THREE.DoubleSide}));box.position.set(x,y,z);box.lookAt(0,0,0);studio.add(box)};
 softbox(-4,5,4,5,7,5);softbox(5,1,2,2,7,3);softbox(0,-4,3,5,2,.8);
 const pmrem=new THREE.PMREMGenerator(renderer);const environment=pmrem.fromScene(studio,.04);scene.environment=environment.texture;
 scene.add(new THREE.HemisphereLight(0xf6ffe3,0x253009,2.2));
 const key=new THREE.DirectionalLight(0xffffff,4.2);key.position.set(-3,5,5);scene.add(key);
 const rim=new THREE.DirectionalLight(0xddff88,3);rim.position.set(4,1,-2);scene.add(rim);
 const initialRect=hero.getBoundingClientRect();
 let paused=hero.classList.contains('motion-paused'),visible=initialRect.bottom>0&&initialRect.top<innerHeight,frame=0,last=0,time=0,px=0,py=0,rx=0,ry=0;
 function resize(){const width=host.clientWidth,height=host.clientHeight;if(!width||!height)return;renderer.setSize(width,height);camera.aspect=width/height;camera.updateProjectionMatrix();draw();}
 function draw(){group.rotation.set(.08+ry*.3,-.4+rx*.65+Math.sin(time*.42)*.22,-.1+Math.sin(time*.5)*.045);group.position.set(0,Math.sin(time*.7)*.085,0);renderer.render(scene,camera)}
 function animate(now){frame=0;const delta=Math.min((now-last)/1000,.05);last=now;if(!visible||document.hidden)return;
  if(!paused){time+=delta;rx+=(px-rx)*.055;ry+=(py-ry)*.055;draw();frame=requestAnimationFrame(animate)}else draw();}
 function start(){if(!frame&&visible&&!document.hidden){last=performance.now();frame=requestAnimationFrame(animate)}}
 hero.addEventListener('scene-pointer',e=>{px=e.detail.x;py=e.detail.y;start()});
 hero.addEventListener('scene-motion',e=>{paused=e.detail.paused;if(paused){px=py=rx=ry=0;cancelAnimationFrame(frame);frame=0;draw()}else start()});
 hero.addEventListener('scene-visibility',e=>{visible=e.detail.visible;if(visible)start();else{cancelAnimationFrame(frame);frame=0}});
 document.addEventListener('visibilitychange',()=>{if(document.hidden){cancelAnimationFrame(frame);frame=0}else start()});
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();cancelAnimationFrame(frame);frame=0;host.classList.remove('has-webgl')});
 renderer.domElement.addEventListener('webglcontextrestored',()=>{host.classList.add('has-webgl');resize();start()});
 new ResizeObserver(resize).observe(host);resize();host.classList.add('has-webgl');start();
} catch(error) {
 host.classList.remove('has-webgl');
 console.warn('3D unavailable; static monogram and all projects remain accessible.',error);
}
