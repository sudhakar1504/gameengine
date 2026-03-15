/**
 * Generates a fully self-contained HTML file that replicates the Preview experience:
 * - All pages, percentage-based element positions
 * - Entrance / continuous / hover / click animations
 * - Click interactions: audio, page navigation, URL, visual effects, trigger-animation
 * - Drag-and-drop with correct / wrong / missed-drop outcomes
 * - Score HUD
 * - Visual effects (confetti, fireworks, floating icons)
 */

function escapeHtml(str: string): string {
    return String(str ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function styleObj(obj: Record<string, any>): string {
    return Object.entries(obj)
        .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}:${v}`)
        .join(';');
}

function buildAnimString(anim: any, loop = false): string {
    if (!anim || anim.effect === 'none') return '';
    let kf = anim.effect;
    if (anim.effect === 'slide' && anim.direction !== 'none') kf = `slide-${anim.direction}`;
    const dir = anim.animationDirection || 'normal';
    const ease = anim.transitionType || 'ease';
    let s = `${kf} ${anim.speed || 1}s ${ease} ${anim.delay || 0}s ${dir} both`;
    if (loop) s += ' infinite';
    return s;
}

function buildElementHtml(el: any, containerWidthVw: number): string {
    const { coords, type, id, zIndex, animations, interaction, dragDrop, filter, transform, font, text, src, audio } = el;

    const isDraggable = !!dragDrop?.dropTargetId;

    const baseStyle: Record<string, any> = {
        position: 'absolute',
        left: `${coords.x}%`,
        top: `${coords.y}%`,
        width: `${coords.width}%`,
        height: `${coords.height}%`,
        'z-index': zIndex || 1,
        'box-sizing': 'border-box',
        'user-select': 'none',
    };
    if (coords.angle) baseStyle.transform = `rotate(${coords.angle}deg)`;
    const hasInteraction = (interaction?.type && interaction.type !== 'none') || interaction?.showWindow;
    if (isDraggable && !hasInteraction) baseStyle.cursor = 'grab';
    else if (hasInteraction) baseStyle.cursor = 'pointer';

    // animations dataset (serialised to data-attr)
    const animEntrance = buildAnimString(animations?.entrance);
    const animContinuous = buildAnimString(animations?.continuous, true);
    const animHover = buildAnimString(animations?.hover);
    const animClick = buildAnimString(animations?.click);

    // inner content
    let innerHtml = '';

    if (type === 'img') {
        const filterStr = filter
            ? `opacity(${filter.opacity ?? 100}%) brightness(${filter.brightness ?? 100}%) contrast(${filter.contrast ?? 100}%) saturate(${filter.saturate ?? 100}%) blur(${filter.blur ?? 0}px)`
            : '';
        const scaleX = transform?.flipX ? -1 : 1;
        const scaleY = transform?.flipY ? -1 : 1;
        innerHtml = `<img src="${escapeHtml(src || '')}" style="width:100%;height:100%;object-fit:contain;${filterStr ? `filter:${filterStr};` : ''}transform:scaleX(${scaleX}) scaleY(${scaleY});" alt="" draggable="false" />`;
    } else if (type === 'text') {
        const fs = `${(parseFloat(font?.fontSize || '0.1') / 100) * containerWidthVw}vw`;
        const fontStyle: Record<string, any> = {
            width: '100%',
            height: '100%',
            'font-family': font?.fontFamily || 'Arial',
            'font-size': fs,
            'font-weight': font?.fontWeight || 'normal',
            'font-style': font?.fontStyle || 'normal',
            'text-decoration': font?.textDecoration || 'none',
            'text-align': font?.textAlign || 'left',
            'line-height': font?.lineHeight || '1.2',
            'letter-spacing': `${font?.letterSpacing || 0}px`,
            color: font?.color || '#000',
        };
        innerHtml = `<div style="${styleObj(fontStyle)}">${escapeHtml(text || '')}</div>`;
    } else if (type === 'audio') {
        // hidden; autoplay handled by JS
        innerHtml = '';
    } else if (type === 'group' && Array.isArray(el.children)) {
        const childrenHtml = el.children.map((child: any) => {
            const cs = `position:absolute;left:${child.coords.x}%;top:${child.coords.y}%;width:${child.coords.width}%;height:${child.coords.height}%;transform:rotate(${child.coords.angle || 0}deg);`;
            if (child.type === 'img') {
                return `<div style="${cs}"><img src="${escapeHtml(child.src || '')}" style="width:100%;height:100%;object-fit:contain;" alt="" /></div>`;
            }
            if (child.type === 'text') {
                const fs = `${(parseFloat(child.font?.fontSize || '0.1') / 100) * containerWidthVw}vw`;
                return `<div style="${cs}font-family:${child.font?.fontFamily || 'Arial'};font-size:${fs};color:${child.font?.color || '#000'}">${escapeHtml(child.text || '')}</div>`;
            }
            return '';
        }).join('');
        innerHtml = `<div style="position:relative;width:100%;height:100%;pointer-events:none;">${childrenHtml}</div>`;
    }

    // Serialise all interaction + drag-drop data as data-attributes
    const dataAttrs = [
        `data-id="${escapeHtml(String(id))}"`,
        `data-type="${escapeHtml(type)}"`,
        animEntrance ? `data-anim-entrance="${escapeHtml(animEntrance)}"` : '',
        animContinuous ? `data-anim-continuous="${escapeHtml(animContinuous)}"` : '',
        animHover ? `data-anim-hover="${escapeHtml(animHover)}"` : '',
        animClick ? `data-anim-click="${escapeHtml(animClick)}"` : '',
    ];

    if (interaction) {
        dataAttrs.push(`data-interaction="${escapeHtml(JSON.stringify(interaction))}"`);
    }
    if (dragDrop?.dropTargetId) {
        dataAttrs.push(`data-dragdrop="${escapeHtml(JSON.stringify(dragDrop))}"`);
    }
    if (type === 'audio') {
        dataAttrs.push(`data-audio-src="${escapeHtml(src || '')}"`);
        dataAttrs.push(`data-audio-loop="${audio?.loop ? 'true' : 'false'}"`);
        dataAttrs.push(`data-audio-volume="${audio?.volume ?? 100}"`);
    }

    return `
  <div class="ge-el" style="${styleObj(baseStyle)}" ${dataAttrs.filter(Boolean).join(' ')}>
    <div class="ge-content" style="width:100%;height:100%;position:relative;">
      ${innerHtml}
    </div>
  </div>`;
}

function buildWindowPopupHtml(el: any): string {
    if (!el.interaction?.showWindow) return '';
    const windowElements: any[] = el.interaction.windowElements || [];
    const bgEl = windowElements.find((e: any) => e.type === 'bg');
    const bgStyle = bgEl?.src
        ? `background-image:url('${bgEl.src}');background-size:cover;background-position:center;`
        : 'background:#ffffff;';
    // window canvas is ~90vw wide; use 90 as containerWidthVw for font scaling
    const innerHtml = windowElements
        .filter((e: any) => e.type !== 'bg')
        .map((e: any) => buildElementHtml(e, 90))
        .join('');
    const title = escapeHtml(el.interaction.windowTitle || 'Window');
    return `
<div class="ge-window-modal" id="ge-window-${escapeHtml(String(el.id))}">
  <div class="ge-window-header">
    <span>${title}</span>
    <button class="ge-window-close" id="ge-close-${escapeHtml(String(el.id))}">&#215;</button>
  </div>
  <div class="ge-window-canvas-wrap">
    <div class="ge-window-canvas" style="${bgStyle}">
      ${innerHtml}
      <div class="ge-window-effect-layer" style="position:absolute;inset:0;pointer-events:none;z-index:999999;overflow:hidden;"></div>
    </div>
  </div>
</div>`;
}

export function generateHtml(allpages: any): string {
    const pages: any[] = allpages?.pages ?? [];
    const containerWidthVw = 100; // exported file uses 100vw-equivalent calc

    // ── collect all window popups across all pages ────────────────────────────
    const windowPopupsHtml = pages.flatMap((page: any) =>
        (page.data ?? []).filter((el: any) => el.interaction?.showWindow)
            .map((el: any) => buildWindowPopupHtml(el))
    ).join('\n');

    // ── build pages HTML ─────────────────────────────────────────────────────
    const pagesHtml = pages.map((page: any, pi: number) => {
        const data: any[] = page.data ?? [];
        const bgItem = data.find((d: any) => d.type === 'bg');

        const bgStyle = bgItem
            ? `background-image:url('${bgItem.src}');background-size:cover;background-position:center;`
            : 'background:#ffffff;';

        const elements = data
            .filter((d: any) => d.type !== 'bg')
            .map((el: any) => buildElementHtml(el, containerWidthVw))
            .join('');

        return `
  <div class="ge-page" id="page-${page.id}" style="display:${pi === 0 ? 'block' : 'none'};position:absolute;inset:0;${bgStyle}overflow:hidden;">
    ${elements}
  </div>`;
    }).join('\n');

    // serialise pages data for runtime drag-drop (coordinate lookups)
    const pagesJson = JSON.stringify(pages.map((p: any) => ({
        id: p.id,
        data: (p.data ?? []).map((el: any) => ({
            id: el.id,
            type: el.type,
            coords: el.coords,
            dragDrop: el.dragDrop ?? null,
        })),
    })));

    // ── HTML template ────────────────────────────────────────────────────────
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Exported Presentation</title>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" crossorigin="anonymous" />
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
html,body{width:100%;height:100%;overflow:hidden;background:#000;font-family:Arial,sans-serif;}

/* ── stage ── */
#ge-stage{
  position:fixed;inset:0;display:flex;align-items:center;justify-content:center;
}
#ge-canvas{
  position:relative;
  width:100vw;height:60vw;
  max-height:100vh;max-width:166.67vh;
  overflow:hidden;
}

/* ── score hud ── */
#ge-score{
  position:absolute;top:10px;right:10px;z-index:99999;
  background:rgba(0,0,0,.6);color:#fff;font-size:14px;
  padding:4px 12px;border-radius:20px;backdrop-filter:blur(4px);
  display:none;pointer-events:none;
}

/* ── effect layer ── */
#ge-effect-layer{
  position:absolute;inset:0;pointer-events:none;z-index:999999;overflow:hidden;
}

/* ── start overlay ── */
#ge-start-overlay{
  position:fixed;inset:0;z-index:9999999;
  background:rgba(0,0,0,.72);
  display:flex;flex-direction:column;align-items:center;justify-content:center;
  cursor:pointer;
}
#ge-start-overlay .ge-start-btn{
  background:rgba(255,255,255,.15);
  border:2px solid rgba(255,255,255,.5);
  color:#fff;font-size:18px;font-weight:600;
  padding:16px 48px;border-radius:12px;
  backdrop-filter:blur(8px);
  pointer-events:none;
  letter-spacing:.04em;
}
#ge-start-overlay p{
  color:rgba(255,255,255,.5);font-size:13px;margin-top:12px;
}

/* ── nav arrows ── */
.ge-nav{
  position:fixed;bottom:18px;left:50%;transform:translateX(-50%);
  display:flex;gap:12px;z-index:99998;
}
.ge-nav button{
  background:rgba(255,255,255,.2);border:1px solid rgba(255,255,255,.4);
  color:#fff;border-radius:6px;padding:6px 18px;cursor:pointer;font-size:13px;
  backdrop-filter:blur(4px);transition:background .15s;
}
.ge-nav button:hover{background:rgba(255,255,255,.35);}

/* ── animation keyframes ── */
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes fadeInOut { 0%, 100% { opacity: 0; } 50% { opacity: 1; } }
@keyframes focus { from { filter: blur(10px); opacity: 0; } to { filter: blur(0); opacity: 1; } }
@keyframes zoom { from { transform: scale(0); } to { transform: scale(1); } }
@keyframes turnOn { from { transform: rotate(-90deg); opacity: 0; } to { transform: rotate(0); opacity: 1; } }
@keyframes slide-left { from { transform: translateX(-100%); } to { transform: translateX(0); } }
@keyframes slide-right { from { transform: translateX(100%); } to { transform: translateX(0); } }
@keyframes slide-top { from { transform: translateY(-100%); } to { transform: translateY(0); } }
@keyframes slide-bottom { from { transform: translateY(100%); } to { transform: translateY(0); } }
@keyframes bounce {
  0%,20%,50%,80%,100%{transform:translateY(0);}
  40%{transform:translateY(-30px);}
  60%{transform:translateY(-15px);}
}
@keyframes swirl {
  from{transform:rotate(-540deg) scale(0);opacity:0;}
  to{transform:rotate(0) scale(1);opacity:1;}
}
@keyframes rotate { from{transform:rotate(0deg);}to{transform:rotate(360deg);} }
@keyframes rollIn {
  from{transform:translateX(-100%) rotate(-120deg);opacity:0;}
  to{transform:translateX(0) rotate(0);opacity:1;}
}
@keyframes pulse {
  0%{transform:scale(1);}50%{transform:scale(1.05);}100%{transform:scale(1);}
}
@keyframes heartbeat {
  0%{transform:scale(1);}14%{transform:scale(1.3);}28%{transform:scale(1);}
  42%{transform:scale(1.3);}70%{transform:scale(1);}
}
@keyframes flicker {
  0%,19.999%,22%,62.999%,64%,64.999%,70%,100%{opacity:1;}
  20%,21.999%,63%,63.999%,65%,69.999%{opacity:0.4;}
}
@keyframes random {
  0%{transform:translate(0,0);}25%{transform:translate(5px,-5px);}
  50%{transform:translate(-5px,5px);}75%{transform:translate(5px,5px);}
  100%{transform:translate(0,0);}
}
@keyframes notification {
  0%,100%{transform:scale(1);}10%,20%{transform:scale(.9) rotate(-3deg);}
  30%,50%,70%,90%{transform:scale(1.1) rotate(3deg);}
  40%,60%,80%{transform:scale(1.1) rotate(-3deg);}
}
@keyframes float {
  0%{transform:translateY(0);}50%{transform:translateY(-10px);}100%{transform:translateY(0);}
}

/* ── window popup ── */
#ge-window-overlay{
  display:none;position:fixed;inset:0;z-index:9999998;
  background:rgba(0,0,0,.6);align-items:center;justify-content:center;
}
#ge-window-overlay.active{display:flex;}
.ge-window-modal{
  display:none;position:relative;width:90vw;max-width:900px;
  background:#fff;border-radius:8px;overflow:hidden;
  box-shadow:0 20px 60px rgba(0,0,0,.5);
}
.ge-window-modal.active{display:block;}
.ge-window-header{
  display:flex;align-items:center;justify-content:space-between;
  padding:12px 16px;border-bottom:1px solid #e8e8e8;
  font-size:14px;font-weight:600;
}
.ge-window-close{
  background:none;border:none;cursor:pointer;font-size:20px;
  width:28px;height:28px;border-radius:50%;
  display:flex;align-items:center;justify-content:center;
  color:#666;line-height:1;
}
.ge-window-close:hover{background:#f5f5f5;}
.ge-window-canvas-wrap{position:relative;width:100%;padding-top:60%;}
.ge-window-canvas{position:absolute;inset:0;overflow:hidden;}

/* ── effect animations ── */
@keyframes confetti-fall {
  0%{transform:translateY(-10vh) rotate(0deg);opacity:1;}
  100%{transform:translateY(110vh) rotate(360deg);opacity:0;}
}
@keyframes firework-explode {
  0%{transform:scale(0);opacity:1;}100%{transform:scale(20);opacity:0;}
}
@keyframes float-up {
  0%{transform:translateY(20%) translateX(0);opacity:0;}
  10%{opacity:1;}
  100%{transform:translateY(-100vh) translateX(20px);opacity:0;}
}
</style>
</head>
<body>
<div id="ge-stage">
  <div id="ge-canvas">
    ${pagesHtml}
    <div id="ge-score">⭐ Score: <span id="ge-score-val">0</span></div>
    <div id="ge-effect-layer"></div>
  </div>
</div>

<!-- Window popup overlay -->
<div id="ge-window-overlay">
${windowPopupsHtml}
</div>

<div id="ge-start-overlay">
  <div class="ge-start-btn">&#9654; Click to Start</div>
  <p>Tap anywhere to begin</p>
</div>

<div class="ge-nav">
  <button id="btn-prev">&#8592; Prev</button>
  <button id="btn-next">Next &#8594;</button>
</div>

<script>
(function(){
'use strict';

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const PAGES_DATA = ${pagesJson};

/* ─────────────────────────────────────────────
   STATE
───────────────────────────────────────────── */
let currentPageIndex = 0;
let score = 0;
const droppedSet = new Set();   // ids that were correctly dropped
const missedTimers = new Map(); // id → timeoutId

/* ─────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────── */
function getCanvas(){ return document.getElementById('ge-canvas'); }

function allPageEls(){
  return Array.from(document.querySelectorAll('.ge-page'));
}

function getPageData(pageId){
  return PAGES_DATA.find(p => String(p.id) === String(pageId));
}

function currentPageData(){
  const pageEl = allPageEls()[currentPageIndex];
  return pageEl ? getPageData(pageEl.id.replace('page-','')) : null;
}

function getElementById(pageData, elId){
  return (pageData?.data ?? []).find(e => String(e.id) === String(elId));
}

/* ─────────────────────────────────────────────
   PAGE NAVIGATION
───────────────────────────────────────────── */
function goToPageById(pageId){
  const pages = allPageEls();
  const idx = pages.findIndex(p => p.id === 'page-' + pageId);
  if(idx !== -1) goToPageIndex(idx);
}

function goToPageIndex(idx){
  const pages = allPageEls();
  if(idx < 0 || idx >= pages.length) return;
  stopPageAudio(pages[currentPageIndex]);
  pages[currentPageIndex].style.display = 'none';
  currentPageIndex = idx;
  pages[currentPageIndex].style.display = 'block';
  // reset dropped + timers on page change
  droppedSet.clear();
  missedTimers.forEach(t => clearTimeout(t));
  missedTimers.clear();
  // re-run entrance animations and start background audio for new page
  runEntranceAnimations(pages[currentPageIndex]);
  startPageAudio(pages[currentPageIndex]);
}

document.getElementById('btn-prev').addEventListener('click', () => goToPageIndex(currentPageIndex - 1));
document.getElementById('btn-next').addEventListener('click', () => goToPageIndex(currentPageIndex + 1));

/* ─────────────────────────────────────────────
   SCORE
───────────────────────────────────────────── */
function addScore(val){
  score += val;
  const hud = document.getElementById('ge-score');
  const span = document.getElementById('ge-score-val');
  span.textContent = (score > 0 ? '+' : '') + score;
  hud.style.display = 'block';
}

/* ─────────────────────────────────────────────
   ANIMATIONS
───────────────────────────────────────────── */
function playAnim(contentEl, animStr, afterMs){
  if(!contentEl || !animStr) return;
  contentEl.style.animation = 'none';
  void contentEl.offsetWidth; // reflow
  contentEl.style.animation = animStr;
  if(afterMs != null){
    setTimeout(() => { contentEl.style.animation = ''; }, afterMs);
  }
}

function runEntranceAnimations(pageEl){
  pageEl.querySelectorAll('.ge-el').forEach(elDiv => {
    const content = elDiv.querySelector('.ge-content');
    const entrance = elDiv.dataset.animEntrance;
    const continuous = elDiv.dataset.animContinuous;
    if(!entrance && !continuous) return;
    let anims = [];
    if(entrance){
      content.style.animation = entrance;
      anims.push(entrance);
      const speed = parseFloat(entrance.split(' ')[1]) * 1000;
      const delay = parseFloat(entrance.split(' ')[3]) * 1000;
      setTimeout(() => {
        if(continuous) content.style.animation = continuous;
        else content.style.animation = '';
      }, speed + delay);
    } else {
      if(continuous) content.style.animation = continuous;
    }
  });
}

/* ─────────────────────────────────────────────
   EFFECTS
───────────────────────────────────────────── */
function showEffect(type, effectLayer){
  const layer = effectLayer || document.getElementById('ge-effect-layer');
  layer.innerHTML = '';
  let html = '';

  if(type === 'confetti'){
    const colors = ['#f00','#0f0','#00f','#ff0','#f0f','#0ff'];
    for(let i=0;i<50;i++){
      const left = Math.random()*100;
      const color = colors[Math.floor(Math.random()*colors.length)];
      const delay = Math.random()*2;
      const dur = 2+Math.random()*2;
      html += \`<div style="position:absolute;left:\${left}%;top:-10px;width:10px;height:10px;background:\${color};animation:confetti-fall \${dur}s linear \${delay}s forwards;"></div>\`;
    }
  } else if(type === 'fireworks'){
    for(let i=0;i<5;i++){
      const left = 20+Math.random()*60;
      const top = 20+Math.random()*40;
      const hue = Math.random()*360;
      const delay = Math.random();
      html += \`<div style="position:absolute;left:\${left}%;top:\${top}%;width:10px;height:10px;border-radius:50%;background:hsl(\${hue},100%,50%);box-shadow:0 0 10px 2px hsl(\${hue},100%,50%);animation:firework-explode 1s ease-out \${delay}s forwards;"></div>\`;
    }
  } else {
    // floating icons
    const iconMap = {
      hearts:'❤️', balloons:'🎈', sad:'😢',
      'broken-heart':'💔', bubbles:'🫧', disagree:'👎', applause:'👏'
    };
    const icon = iconMap[type] || '✨';
    for(let i=0;i<30;i++){
      const left = Math.random()*90;
      const delay = Math.random()*1.5;
      const dur = 2+Math.random()*2;
      const size = 80+Math.random()*30;
      html += \`<div style="position:absolute;left:\${left}%;bottom:-100px;opacity:0;font-size:\${size}px;animation:float-up 1.5s ease-in \${delay}s forwards;">\${icon}</div>\`;
    }
  }

  layer.innerHTML = html;
  setTimeout(() => { layer.innerHTML = ''; }, 4000);
}

/* ─────────────────────────────────────────────
   WINDOW POPUP
───────────────────────────────────────────── */
function openWindow(elId){
  const overlay = document.getElementById('ge-window-overlay');
  document.querySelectorAll('.ge-window-modal').forEach(m => m.classList.remove('active'));
  const modal = document.getElementById('ge-window-' + elId);
  if(modal){
    modal.classList.add('active');
    // run entrance animations for window elements
    const canvas = modal.querySelector('.ge-window-canvas');
    if(canvas) runEntranceAnimations(canvas);
  }
  overlay.classList.add('active');
}
function closeWindow(){
  document.getElementById('ge-window-overlay').classList.remove('active');
  document.querySelectorAll('.ge-window-modal').forEach(m => m.classList.remove('active'));
}
// expose to global so inline onclick and close buttons can reach them
window.openWindow = openWindow;
window.closeWindow = closeWindow;
document.getElementById('ge-window-overlay').addEventListener('click', function(e){
  if(e.target === this) closeWindow();
});

/* ─────────────────────────────────────────────
   INTERACTION HANDLER (click)
───────────────────────────────────────────── */
function handleInteraction(elDiv){
  const raw = elDiv.dataset.interaction;
  if(!raw) return;
  let inter;
  try{ inter = JSON.parse(raw); } catch(e){ return; }
  if(!inter) return;

  const content = elDiv.querySelector('.ge-content');

  // click animation
  const clickAnim = elDiv.dataset.animClick;
  if(clickAnim && content){
    const contAnim = elDiv.dataset.animContinuous || '';
    const speed = parseFloat(clickAnim.split(' ')[1]) * 1000;
    const delay = parseFloat(clickAnim.split(' ')[3]) * 1000;
    content.style.animation = clickAnim;
    setTimeout(() => { content.style.animation = contAnim || ''; }, speed + delay);
  }

  // window popup (independent of type)
  if(inter.showWindow){ openWindow(elDiv.dataset.id); }

  // if type is 'none' stop here (no other interactions)
  if(!inter.type || inter.type === 'none') return;

  // detect if this element is inside a popup — effects should render there, not on the main stage
  const windowCanvas = elDiv.closest('.ge-window-canvas');
  const effectLayer = windowCanvas
    ? windowCanvas.querySelector('.ge-window-effect-layer')
    : null;

  // effect (only when type === 'effect')
  if(inter.type === 'effect' && inter.effectValue) showEffect(inter.effectValue, effectLayer);

  // trigger animation on another element
  if(inter.type === 'triggerAnim' && inter.triggerElementId){
    const targetDiv = document.querySelector(\`.ge-el[data-id="\${CSS.escape(String(inter.triggerElementId))}"\`);
    if(targetDiv){
      const tc = targetDiv.querySelector('.ge-content');
      if(tc && inter.triggerAnimationConfig){
        const cfg = inter.triggerAnimationConfig;
        if(cfg.effect && cfg.effect !== 'none'){
          let kf = cfg.effect;
          if(cfg.effect === 'slide' && cfg.direction !== 'none') kf = 'slide-' + cfg.direction;
          const aStr = \`\${kf} \${cfg.speed||1}s \${cfg.transitionType||'ease'} \${cfg.delay||0}s \${cfg.animationDirection||'normal'} both\`;
          const contAnim = targetDiv.dataset.animContinuous || '';
          const dur = ((cfg.speed||1) + (cfg.delay||0)) * 1000;
          tc.style.animation = 'none';
          void tc.offsetWidth;
          tc.style.animation = aStr;
          setTimeout(() => { tc.style.animation = contAnim || 'none'; }, dur);
        }
      }
    }
    return;
  }

  const proceed = () => {
    if(inter.targetPageId) { goToPageById(inter.targetPageId); return; }
    if(inter.url) { window.open(inter.url, inter.target || '_blank'); }
  };

  if(inter.audioSrc){
    const a = new Audio(inter.audioSrc);
    a.loop = inter.loop || false;
    a.play().catch(()=>{});
    a.addEventListener('ended', proceed);
  } else {
    proceed();
  }
}

/* ─────────────────────────────────────────────
   DRAG & DROP
───────────────────────────────────────────── */
function getCanvasDimensions(){
  const c = getCanvas();
  return { w: c.clientWidth, h: c.clientHeight };
}

function dispatchDragDropActions(elDiv, actions){
  const content = elDiv.querySelector('.ge-content');
  actions.forEach(action => {
    if(action.type === 'snap-to'){
      // transform already set by caller
      elDiv._snapDx = action.dx;
      elDiv._snapDy = action.dy;
      elDiv.style.transform = \`translate(\${action.dx}px,\${action.dy}px) rotate(\${elDiv._angle||0}deg)\`;
      elDiv.style.transition = 'transform 0.3s ease';
      elDiv.style.cursor = 'default';
    }
    if(action.type === 'snap-back' || action.type === 'return-to-origin'){
      elDiv._snapDx = 0;
      elDiv._snapDy = 0;
      elDiv.style.transform = \`rotate(\${elDiv._angle||0}deg)\`;
      elDiv.style.transition = 'transform 0.3s ease';
    }
    if(action.type === 'audio' && action.audioSrc){
      const a = new Audio(action.audioSrc);
      a.loop = action.loop || false;
      a.play().catch(()=>{});
    }
    if(action.type === 'effect' && action.effectValue){
      showEffect(action.effectValue);
    }
    if(action.type === 'animation' && action.animEffect && action.animEffect !== 'none' && content){
      let kf = action.animEffect;
      if(action.animDirection && action.animDirection !== 'none') kf += '-' + action.animDirection;
      const aStr = \`\${kf} \${action.animSpeed||1}s ease both\`;
      content.style.animation = 'none';
      void content.offsetWidth;
      content.style.animation = aStr;
      setTimeout(()=>{ content.style.animation = elDiv.dataset.animContinuous || ''; }, (action.animSpeed||1)*1000);
    }
    if(action.type === 'go-to-page' && action.targetPageId){
      goToPageById(action.targetPageId);
    }
    if(action.type === 'score' && action.scoreValue){
      addScore(action.scoreValue);
    }
  });
}

function initDragDrop(elDiv){
  const raw = elDiv.dataset.dragdrop;
  if(!raw) return;
  let dd;
  try{ dd = JSON.parse(raw); } catch(e){ return; }
  if(!dd?.dropTargetId) return;

  const elId = elDiv.dataset.id;
  // store original angle for transform restoration
  const styleStr = elDiv.getAttribute('style') || '';
  const rotMatch = styleStr.match(/rotate\(([-\d.]+)deg\)/);
  elDiv._angle = rotMatch ? parseFloat(rotMatch[1]) : 0;
  elDiv._snapDx = 0;
  elDiv._snapDy = 0;

  elDiv.addEventListener('mousedown', (e) => {
    if(droppedSet.has(elId)) return;
    e.preventDefault();
    e.stopPropagation();

    elDiv.style.transition = 'none';
    elDiv.style.zIndex = 9999;
    elDiv.style.cursor = 'grabbing';

    const startMX = e.clientX;
    const startMY = e.clientY;
    const baseDx = elDiv._snapDx || 0;
    const baseDy = elDiv._snapDy || 0;

    // start missed-drop timer
    if(dd.missedDrop?.timeout > 0){
      if(missedTimers.has(elId)) clearTimeout(missedTimers.get(elId));
      const t = setTimeout(() => {
        missedTimers.delete(elId);
        if(droppedSet.has(elId)) return;
        const missedActions = [{ type: 'snap-back' }, ...(dd.missedDrop.actions || [])];
        missedActions.forEach(a => {
          if(a.type === 'score') addScore(a.scoreValue || 0);
          if(a.type === 'go-to-page') goToPageById(a.targetPageId);
        });
        dispatchDragDropActions(elDiv, missedActions);
      }, dd.missedDrop.timeout * 1000);
      missedTimers.set(elId, t);
    }

    const onMove = (ev) => {
      const dx = baseDx + (ev.clientX - startMX);
      const dy = baseDy + (ev.clientY - startMY);
      elDiv.style.transform = \`translate(\${dx}px,\${dy}px) rotate(\${elDiv._angle}deg)\`;
    };

    const onUp = (ev) => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      elDiv.style.cursor = 'grab';
      elDiv.style.zIndex = elDiv.dataset.originalZ || 1;

      const { w, h } = getCanvasDimensions();

      // read coords from page data
      const pd = currentPageData();
      const srcEl = getElementById(pd, elId);
      const tgtEl = getElementById(pd, dd.dropTargetId);
      if(!srcEl || !tgtEl){ return; }

      const dxPct = ((ev.clientX - startMX) / w) * 100;
      const dyPct = ((ev.clientY - startMY) / h) * 100;
      const finalX = srcEl.coords.x + srcEl.coords.width / 2 + dxPct;
      const finalY = srcEl.coords.y + srcEl.coords.height / 2 + dyPct;

      const tc = tgtEl.coords;
      const isCorrect =
        finalX >= tc.x && finalX <= tc.x + tc.width &&
        finalY >= tc.y && finalY <= tc.y + tc.height;

      if(isCorrect){
        if(missedTimers.has(elId)){ clearTimeout(missedTimers.get(elId)); missedTimers.delete(elId); }
        droppedSet.add(elId);
        const snapDx = ((tc.x + tc.width/2 - srcEl.coords.x - srcEl.coords.width/2)/100)*w;
        const snapDy = ((tc.y + tc.height/2 - srcEl.coords.y - srcEl.coords.height/2)/100)*h;
        const correctActions = [
          { type: 'snap-to', dx: snapDx, dy: snapDy },
          ...(dd.correctDrop.actions || [])
        ];
        correctActions.forEach(a => {
          if(a.type === 'score') addScore(a.scoreValue || 0);
          if(a.type === 'go-to-page') goToPageById(a.targetPageId);
        });
        dispatchDragDropActions(elDiv, correctActions);
      } else {
        const wrongActions = [{ type: 'snap-back' }, ...(dd.wrongDrop.actions || [])];
        wrongActions.forEach(a => {
          if(a.type === 'score') addScore(a.scoreValue || 0);
          if(a.type === 'go-to-page') goToPageById(a.targetPageId);
        });
        dispatchDragDropActions(elDiv, wrongActions);
      }
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  });
}

/* ─────────────────────────────────────────────
   HOVER ANIMATIONS
───────────────────────────────────────────── */
function initHover(elDiv){
  const hoverAnim = elDiv.dataset.animHover;
  if(!hoverAnim) return;
  const content = elDiv.querySelector('.ge-content');
  elDiv.addEventListener('mouseenter', () => {
    const speed = parseFloat(hoverAnim.split(' ')[1]) * 1000;
    const delay = parseFloat(hoverAnim.split(' ')[3]) * 1000;
    content.style.animation = hoverAnim;
    setTimeout(() => {
      content.style.animation = elDiv.dataset.animContinuous || '';
    }, speed + delay);
  });
}

/* ─────────────────────────────────────────────
   AUDIO AUTOPLAY ELEMENTS
   Browsers block autoplay before user gesture.
   We register Audio objects here, then play them
   all once the user dismisses the start overlay.
───────────────────────────────────────────── */
const pendingAudios = []; // { audio, pageEl } waiting for unlock

function initAudioElements(pageEl){
  pageEl.querySelectorAll('.ge-el[data-type="audio"]').forEach(elDiv => {
    const src = elDiv.dataset.audioSrc;
    if(!src) return;
    const loop = elDiv.dataset.audioLoop === 'true';
    const vol = parseFloat(elDiv.dataset.audioVolume || '100') / 100;
    const a = new Audio(src);
    a.loop = loop;
    a.volume = vol;
    elDiv._audio = a;
    // Only queue audios belonging to page 0 (first visible page)
    // Others will be started via startPageAudio when navigating
    if(pageEl === document.querySelector('.ge-page')){
      pendingAudios.push(a);
    }
  });
}

function startPageAudio(pageEl){
  pageEl.querySelectorAll('.ge-el[data-type="audio"]').forEach(elDiv => {
    if(elDiv._audio){
      elDiv._audio.currentTime = 0;
      elDiv._audio.play().catch(()=>{});
    }
  });
}

function stopPageAudio(pageEl){
  pageEl.querySelectorAll('.ge-el[data-type="audio"]').forEach(elDiv => {
    if(elDiv._audio){
      elDiv._audio.pause();
      elDiv._audio.currentTime = 0;
    }
  });
}

/* ─────────────────────────────────────────────
   INIT PAGE ELEMENTS
───────────────────────────────────────────── */
function initPageElements(pageEl){
  pageEl.querySelectorAll('.ge-el').forEach(elDiv => {
    const hasDragDrop = !!elDiv.dataset.dragdrop;
    // store original z
    elDiv.dataset.originalZ = elDiv.style.zIndex || 1;

    if(hasDragDrop){
      initDragDrop(elDiv);
    } else {
      elDiv.addEventListener('click', () => handleInteraction(elDiv));
    }

    initHover(elDiv);
  });
  initAudioElements(pageEl);
}

/* ─────────────────────────────────────────────
   BOOT
───────────────────────────────────────────── */
document.querySelectorAll('.ge-page').forEach(pageEl => {
  initPageElements(pageEl);
});

// init window popup element interactions + close buttons
document.querySelectorAll('.ge-window-modal').forEach(modal => {
  const closeBtn = modal.querySelector('.ge-window-close');
  if(closeBtn) closeBtn.addEventListener('click', closeWindow);
  const canvas = modal.querySelector('.ge-window-canvas');
  if(!canvas) return;
  canvas.querySelectorAll('.ge-el').forEach(elDiv => {
    initHover(elDiv);
    elDiv.addEventListener('click', () => handleInteraction(elDiv));
  });
});

// run entrance on first page
const firstPage = document.querySelector('.ge-page');
if(firstPage) runEntranceAnimations(firstPage);

// ── Start overlay: unlock audio on first user gesture ──
const startOverlay = document.getElementById('ge-start-overlay');
if(startOverlay){
  startOverlay.addEventListener('click', () => {
    startOverlay.style.display = 'none';
    // Play all pending background audios for the first page
    pendingAudios.forEach(a => a.play().catch(()=>{}));
  }, { once: true });
}

})();
</script>
</body>
</html>`;
}

export function downloadHtml(allpages: any, filename = 'presentation.html'): void {
    const html = generateHtml(allpages);
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}
