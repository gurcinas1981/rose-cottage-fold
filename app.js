const plots=[
{name:'The Farmhouse',beds:3,rooms:2,bathrooms:'1 + WC',gia:'To be confirmed',form:'Two-storey detached',copy:'A detached home fronting the access road, with a sitting room, kitchen / dining / garden room and three first-floor bedrooms.',image:'farmhouse',drawing:'plot-1',film:3},
{name:'The Stalls',beds:2,rooms:1,bathrooms:'1 shower room',gia:'To be confirmed',form:'Single-storey barn range',copy:'A two-bedroom courtyard home with an open-plan kitchen, dining and sitting room, plus utility storage.',image:'stalls-dairy',drawing:'plots-2-3',film:0},
{name:'The Dairy',beds:2,rooms:1,bathrooms:'1 shower room',gia:'To be confirmed',form:'Single-storey barn range',copy:'A two-bedroom home arranged on one level, with open-plan kitchen, dining and sitting space.',image:'stalls-dairy',drawing:'plots-2-3',film:0},
{name:'The Threshing Barn',beds:4,rooms:2,bathrooms:'2 + WC',gia:'To be confirmed',form:'1½ / two-storey barn design',copy:'A generous four-bedroom barn home with open-plan kitchen and living space, a snug, master suite and threshing-style glazing.',image:'threshing-barn',drawing:'plot-4',film:2},
{name:'The Granary',beds:4,rooms:2,bathrooms:'2 + WC',gia:'To be confirmed',form:'Two-storey barn design',copy:'A four-bedroom courtyard home with open-plan kitchen / dining and sitting / garden rooms, plus a master suite and dressing area.',image:'granary-carthouse',drawing:'plots-5-6',film:1},
{name:'The Carthouse',beds:3,rooms:1,bathrooms:'2 + WC',gia:'To be confirmed',form:'Two-storey barn design',copy:'A three-bedroom home with open-plan kitchen, dining and sitting space, a master suite and external brick stair.',image:'granary-carthouse',drawing:'plots-5-6',film:1}
];
let selected=0,view='visual';
const $=s=>document.querySelector(s);const viewer=$('#viewer'),content=$('#viewer-content'),hero=$('#hero-video'),fox=$('#fox-video');
function render(){
 const p=plots[selected],isPlan=view==='drawing';
 $('#home-label').textContent='PLOT '+String(selected+1).padStart(2,'0');
 $('#home-title').textContent=p.name;$('#home-copy').textContent=p.copy;
 for(const [id,value] of [['beds',p.beds],['form',p.form],['rooms',p.rooms],['bathrooms',p.bathrooms],['gia',p.gia]])$('#'+id).textContent=value;
 const drawing=$('#drawing');drawing.src='assets/'+(isPlan?p.drawing+'-plans.webp':p.image+'.webp');
 drawing.srcset=isPlan?'':`assets/${p.image}-640.webp 640w, assets/${p.image}-1024.webp 1024w, assets/${p.image}.webp ${p.image==='threshing-barn'?1694:p.image==='stalls-dairy'?1721:1672}w`;
 drawing.alt='Plot '+(selected+1)+' · '+p.name+' · '+(isPlan?'Floor plans and elevations':'Architectural visualisation');
 $('#drawing-open').classList.toggle('is-plan',isPlan);$('#drawing-note').hidden=!isPlan;
 document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===view)));
 for(const id of ['property-prev','property-next'])$('#'+id).setAttribute('aria-label',isPlan?'Show CGI':'Show floor plans');
 document.dispatchEvent(new Event('plotchange'));
}
function togglePropertyView(){view=view==='visual'?'drawing':'visual';render()}
document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{view=b.dataset.view;render()}));
for(const id of ['property-prev','property-next'])$('#'+id).addEventListener('click',togglePropertyView);
let lightboxNavigator=null;
function showPropertyImage(){const p=plots[selected];show('assets/'+(view==='drawing'?p.drawing+'-plans.webp':p.image+'-original.webp'),p.name+' · '+(view==='drawing'?'Floor plans and elevations':'CGI'),false,true)}
function show(src,caption,isVideo=false,isProperty=false){
 content.querySelector('video')?.pause();
 $('#visuals-bar').hidden=true;viewer.classList.remove('visuals-viewer');
 lightboxNavigator?.destroy();lightboxNavigator=null;content.replaceChildren();content.classList.remove('zoomed');
 const isPlan=/-plans\.webp$/.test(src),media=document.createElement(isVideo?'video':'img');media.src=src;
 viewer.classList.toggle('drawing-viewer',isPlan);viewer.classList.toggle('property-viewer',isProperty);
 if(isVideo){media.controls=true;media.playsInline=true;media.preload='metadata';content.append(media)}
 else{
  media.alt=caption;media.draggable=false;
  const wrap=document.createElement('div');wrap.className='lightbox-wrap';
  const stage=document.createElement('div');stage.className='image-stage lightbox-stage';stage.tabIndex=0;stage.setAttribute('role','region');stage.setAttribute('aria-label','Image viewer. Pinch or scroll to zoom; drag to move. Plus and minus zoom, arrow keys pan, Home resets.');
  const layer=document.createElement('div');layer.className='image-layer';layer.append(media);stage.append(layer);wrap.append(stage);content.append(wrap);
  if(isProperty){for(const direction of ['prev','next']){const b=document.createElement('button');b.type='button';b.className='gallery-arrow gallery-'+direction;b.textContent=direction==='prev'?'‹':'›';b.setAttribute('aria-label',view==='drawing'?'Show CGI':'Show floor plans');b.addEventListener('click',()=>{togglePropertyView();showPropertyImage();content.querySelector('.gallery-'+direction)?.focus()});wrap.append(b)}}
  lightboxNavigator=createImageNavigator(stage,layer,{maxZoom:10,wheelZoom:true});
  const currentNavigator=lightboxNavigator;const loaded=()=>currentNavigator.setImage(media.naturalWidth,media.naturalHeight);
  media.addEventListener('load',loaded,{once:true});media.addEventListener('error',()=>{stage.textContent='The image could not load. Please close the viewer and try again.';stage.setAttribute('role','status')},{once:true});if(media.complete&&media.naturalWidth)loaded();
 }
 $('#viewer-caption').textContent=caption;hero.pause();fox.pause();storyVideo.pause();
 if(!viewer.open)viewer.showModal();document.body.classList.add('viewer-open');lightboxNavigator?.resize();if(isVideo)media.play().catch(()=>{});
}
document.querySelectorAll('[data-image]').forEach(b=>b.addEventListener('click',()=>show(b.dataset.image,b.dataset.caption)));
const visualCards=[...document.querySelectorAll('[data-film]')];
function openVisual(index){
 const card=visualCards[index];
 show('assets/film-'+card.dataset.film+'.mp4',card.dataset.caption,true);
 $('#visuals-bar').hidden=false;viewer.classList.add('visuals-viewer');
 $('#visuals-current').textContent='Visual '+(index+1);
 $('#visuals-name').textContent=card.dataset.caption+' · '+(index+1)+' of '+visualCards.length;
 [...$('#visuals-nav').children].forEach((button,i)=>button.setAttribute('aria-pressed',String(i===index)));
 if(document.activeElement===$('.close'))$('#visuals-close').focus();
}
visualCards.forEach((card,index)=>{
 const button=document.createElement('button');button.type='button';button.textContent=index+1;
 button.setAttribute('aria-label','View '+card.dataset.caption);button.setAttribute('aria-pressed','false');
 button.addEventListener('click',()=>openVisual(index));$('#visuals-nav').append(button);
 card.addEventListener('click',()=>openVisual(index));
});
$('#visuals-close').addEventListener('click',()=>viewer.close());
// Preserve existing links to the former section name.
if(location.hash==='#films')document.getElementById('visuals').scrollIntoView();
$('#drawing-open').addEventListener('click',showPropertyImage);
$('.close').addEventListener('click',()=>viewer.close());
viewer.addEventListener('close',()=>{lightboxNavigator?.destroy();lightboxNavigator=null;content.querySelector('video')?.pause();content.replaceChildren();document.body.classList.remove('viewer-open')});
viewer.addEventListener('click',e=>{if(e.target===viewer)viewer.close()});
const menu=$('.menu-toggle'),nav=$('#main-nav');menu.addEventListener('click',()=>{const open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',open);nav.classList.toggle('is-open',open)});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{menu.setAttribute('aria-expanded','false');nav.classList.remove('is-open')}));document.addEventListener('keydown',e=>{if(e.key==='Escape'){menu.setAttribute('aria-expanded','false');nav.classList.remove('is-open')}});
function sync(video,button){const paused=video.paused;button.textContent=paused?'▶':'Ⅱ';button.setAttribute('aria-label',paused?'Play film':'Pause film');button.setAttribute('title',paused?'Play':'Pause')}
for(const [video,button] of [[hero,$('#pause')],[fox,$('#fox-play')]]){button.addEventListener('click',()=>{if(video.paused)video.play().catch(()=>{});else video.pause()});video.addEventListener('play',()=>sync(video,button));video.addEventListener('pause',()=>sync(video,button));video.addEventListener('error',()=>{button.hidden=true})}
$('#fox-full').addEventListener('click',()=>show('assets/fox-land-story.mp4','FOX · Every piece of land has a story',true));
if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&!navigator.connection?.saveData)hero.play().catch(()=>{});
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)e.target.pause();else if(e.target===hero&&!document.querySelector('dialog[open]')&&!matchMedia('(prefers-reduced-motion: reduce)').matches)hero.play().catch(()=>{})}),{threshold:.1});observer.observe(hero);observer.observe(fox);document.addEventListener('visibilitychange',()=>{if(document.hidden){hero.pause();fox.pause();content.querySelector('video')?.pause()}});

const homeDialog=$('#home-dialog');
function openHome(index){storyVideo.pause();selected=index;view='visual';render();hero.pause();fox.pause();if(!homeDialog.open)homeDialog.showModal();document.body.classList.add('home-open');homeDialog.scrollTop=0;}
$('#home-close').addEventListener('click',()=>homeDialog.close());
homeDialog.addEventListener('close',()=>{document.body.classList.remove('home-open')});
homeDialog.addEventListener('click',e=>{if(e.target===homeDialog)homeDialog.close()});
document.querySelectorAll('.home-switch button').forEach((b,i)=>{const p=plots[i];b.removeAttribute('aria-pressed');b.classList.remove('active');b.setAttribute('aria-haspopup','dialog');b.setAttribute('aria-controls','home-dialog');b.innerHTML=`<img src="assets/${p.image}-640.webp" alt="${p.name} architectural visualisation" loading="lazy"><span class="home-card-copy"><small>PLOT ${String(i+1).padStart(2,'0')} · ${p.beds} BEDROOMS</small><strong>${p.name}</strong><span>Explore home ↗</span></span>`;});

const enquiryDialog=$('#enquiry-dialog'),enquiryForm=$('#enquiry-form');
document.querySelectorAll('[data-enquire]').forEach(button=>button.addEventListener('click',()=>enquiryDialog.showModal()));
enquiryDialog.querySelector('.enquiry-close').addEventListener('click',()=>enquiryDialog.close());
enquiryDialog.addEventListener('click',event=>{if(event.target===enquiryDialog)enquiryDialog.close()});
function enquiryMessage(){const data=new FormData(enquiryForm);return{subject:'Rose Cottage Fold — '+data.get('interest'),body:['Name: '+data.get('name'),'Email: '+data.get('email'),'Phone: '+(data.get('phone')||'Not provided'),'Interested in: '+data.get('interest'),'','Message:',data.get('message')].join('\r\n')}}
enquiryForm.addEventListener('submit',event=>{event.preventDefault();if(!enquiryForm.reportValidity())return;const message=enquiryMessage();const gmail='https://mail.google.com/mail/?view=cm&fs=1&to='+encodeURIComponent('contact@foxvisiondesign.co.uk')+'&su='+encodeURIComponent(message.subject)+'&body='+encodeURIComponent(message.body);const opened=window.open(gmail,'_blank');if(opened)opened.opener=null;$('#enquiry-status').textContent=opened?'Your completed message has opened in Gmail. Review it and press Send.':'Your browser blocked the new tab. Please select “Use another email app” below.'});
$('#enquiry-mailto').addEventListener('click',event=>{if(!enquiryForm.reportValidity()){event.preventDefault();return}const message=enquiryMessage();event.currentTarget.href='mailto:contact@foxvisiondesign.co.uk?subject='+encodeURIComponent(message.subject)+'&body='+encodeURIComponent(message.body)});

function resumeHero(){if(!document.hidden&&!document.querySelector('dialog[open]')&&!matchMedia('(prefers-reduced-motion: reduce)').matches)hero.play().catch(()=>{});}
for(const modal of [viewer,homeDialog])modal.addEventListener('close',resumeHero);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)resumeHero()});

const storyVideo=document.getElementById('story-video'),storyPlay=document.getElementById('story-play');
storyPlay.addEventListener('click',()=>{hero.pause();fox.pause();storyVideo.controls=true;storyVideo.play().catch(()=>{storyPlay.hidden=false})});
storyVideo.addEventListener('play',()=>{storyPlay.hidden=true});
storyVideo.addEventListener('ended',()=>{storyPlay.hidden=false;storyVideo.controls=false});
document.addEventListener('visibilitychange',()=>{if(document.hidden)storyVideo.pause()});

function updateHomeNavigation(){
 document.getElementById('home-current-plot').textContent='Plot '+(selected+1);
 document.getElementById('home-current-name').textContent=plots[selected].name+' · Plot '+(selected+1)+' of '+plots.length;
 document.querySelectorAll('[data-home-jump]').forEach(button=>{const i=Number(button.dataset.homeJump);button.setAttribute('aria-pressed',String(i===selected));button.setAttribute('aria-label','View Plot '+(i+1)+': '+plots[i].name)});
}
document.querySelectorAll('[data-home-jump]').forEach(button=>button.addEventListener('click',()=>openHome(Number(button.dataset.homeJump))));
document.addEventListener('plotchange',updateHomeNavigation);
updateHomeNavigation();
