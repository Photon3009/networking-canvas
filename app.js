(function(){
'use strict';
var $ = function(s){ return document.querySelector(s); };
var NODES = window.NODES, EDGES = window.EDGES, JOURNEY = window.JOURNEY;
var LAYERS = window.LAYERS, TOPICS = window.TOPICS, WORLD = window.WORLD;
var byId = {}; NODES.forEach(function(n){ byId[n.id] = n; });
var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var SVGNS = 'http://www.w3.org/2000/svg';

/* ── build the map ──────────────────────────────────────── */
var NW = 212, NH = 164, HW = NW/2, HH = NH/2;
var nodesLayer = $('#nodes'), edgesSvg = $('#edges'), world = $('#world');
var edgeEls = {};

world.style.width = WORLD.w+'px';
world.style.height = WORLD.h+'px';
edgesSvg.setAttribute('width', WORLD.w);
edgesSvg.setAttribute('height', WORLD.h);
edgesSvg.setAttribute('viewBox','0 0 '+WORLD.w+' '+WORLD.h);

function border(a, b){
  var dx = b.x-a.x, dy = b.y-a.y;
  var tx = dx === 0 ? Infinity : (HW+5)/Math.abs(dx);
  var ty = dy === 0 ? Infinity : (HH+5)/Math.abs(dy);
  var t = Math.min(tx, ty);
  return { x: a.x + dx*t, y: a.y + dy*t };
}
function mkpath(cls, d){
  var el = document.createElementNS(SVGNS,'path');
  el.setAttribute('class', cls); el.setAttribute('d', d);
  return el;
}
function buildEdges(){
  var labels = [];
  EDGES.forEach(function(e, n){
    var a = byId[e[0]], b = byId[e[1]];
    if(!a || !b) return;
    var p1 = border(a,b), p2 = border(b,a);
    var dx = p2.x-p1.x, dy = p2.y-p1.y, d;
    if(Math.abs(dx) >= Math.abs(dy)){
      var cx = Math.max(28, Math.min(120, Math.abs(dx)*0.45)) * (dx < 0 ? -1 : 1);
      d = 'M'+p1.x+','+p1.y+' C'+(p1.x+cx)+','+p1.y+' '+(p2.x-cx)+','+p2.y+' '+p2.x+','+p2.y;
    } else {
      var cy = Math.max(28, Math.min(120, Math.abs(dy)*0.45)) * (dy < 0 ? -1 : 1);
      d = 'M'+p1.x+','+p1.y+' C'+p1.x+','+(p1.y+cy)+' '+p2.x+','+(p2.y-cy)+' '+p2.x+','+p2.y;
    }
    var geom = mkpath('egeom', d);
    geom.setAttribute('fill','none'); geom.setAttribute('stroke','none');
    edgesSvg.appendChild(geom);

    var seed = 400 + n*37;
    var g = document.createElementNS(SVGNS,'g');
    g.setAttribute('class','eg z-'+e[3]+(e[4] ? ' alt' : ''));
    g.appendChild(mkpath('a', d));
    /* a small filled arrowhead, three-quarters along, so direction reads */
    var L = geom.getTotalLength();
    if(L > 60){
      var tip = geom.getPointAtLength(L*0.76), back = geom.getPointAtLength(L*0.76-9);
      var ax = tip.x-back.x, ay = tip.y-back.y, am = Math.hypot(ax,ay) || 1;
      ax /= am; ay /= am;
      var w1 = [tip.x - ax*9 - ay*5, tip.y - ay*9 + ax*5];
      var w2 = [tip.x - ax*9 + ay*5, tip.y - ay*9 - ax*5];
      g.appendChild(mkpath('tip', 'M'+w1+'L'+tip.x+','+tip.y+'L'+w2+'Z'));
    }
    edgesSvg.appendChild(g);
    edgeEls[e[0]+'|'+e[1]] = { g:g, geom:geom };
    labels.push({ geom: geom, text: e[2] });
  });
  var lay = document.createElementNS(SVGNS,'svg');
  lay.setAttribute('id','elabels');
  lay.setAttribute('width', WORLD.w); lay.setAttribute('height', WORLD.h);
  lay.setAttribute('viewBox','0 0 '+WORLD.w+' '+WORLD.h);
  lay.setAttribute('aria-hidden','true');
  world.appendChild(lay);
  labels.forEach(function(L){
    var len = L.geom.getTotalLength(); if(!len) return;
    var p = L.geom.getPointAtLength(len*0.5);
    var t = document.createElementNS(SVGNS,'text');
    t.setAttribute('class','elabel');
    t.setAttribute('x', p.x); t.setAttribute('y', p.y - 10);
    t.setAttribute('text-anchor','middle');
    t.textContent = L.text;
    lay.appendChild(t);
  });
  var pk = document.createElementNS(SVGNS,'circle');
  pk.setAttribute('id','packet'); pk.setAttribute('r','8');
  pk.setAttribute('cx','-200'); pk.setAttribute('cy','-200');
  pk.style.opacity = '0';
  edgesSvg.appendChild(pk);
}

var ZONE_TITLES = [
  { x:300,  y:36, zone:'home',   t:'Your home' },
  { x:1020, y:36, zone:'access', t:'Airtel\u2019s last mile' },
  { x:1560, y:36, zone:'core',   t:'Airtel\u2019s network \u00b7 AS9498' },
  { x:2040, y:36, zone:'net',    t:'The open internet' }
];
function buildZoneTitles(){
  ZONE_TITLES.forEach(function(z){
    var t = document.createElementNS(SVGNS,'text');
    t.setAttribute('class','ztitle');
    t.setAttribute('x', z.x); t.setAttribute('y', z.y);
    t.setAttribute('text-anchor','middle');
    t.setAttribute('fill','var(--'+z.zone+')');
    t.textContent = z.t;
    edgesSvg.insertBefore(t, edgesSvg.firstChild);
  });
}
function buildNodes(){
  NODES.forEach(function(n, i){
    var el = document.createElement('button');
    el.className = 'node z-'+n.zone+' kind-'+n.kind;
    el.style.left = n.x+'px'; el.style.top = n.y+'px';
    el.dataset.id = n.id;
    el.setAttribute('aria-current','false');
    var draw = (window.ART && window.ART[n.id]) ? window.ART[n.id]() : '';
    el.innerHTML = '<span class="n-well"><svg class="n-art" viewBox="3 0 154 108" aria-hidden="true">'+draw+'</svg></span>'+
      '<span class="n-cap"><span class="n-title">'+n.title+'</span>'+
      '<span class="n-sub">'+n.sub+'</span></span>';
    el.addEventListener('click', function(){
      if(justDragged) return;
      if(world.classList.contains('focusing')) el.classList.add('lit');
      openDetail(n, 'node'); focusNode(n.id);
    });
    nodesLayer.appendChild(el);
    n._el = el;
  });
}
buildEdges(); buildZoneTitles(); buildNodes();

/* ── pan and zoom ───────────────────────────────────────── */
var view = $('#mapview');
var tx = 0, ty = 0, sc = 1;
var MIN = 0.26, MAX = 1.7;

function apply(){
  world.style.transform = 'translate('+tx+'px,'+ty+'px) scale('+sc+')';
  view.classList.toggle('low-zoom', sc < 0.72);
}
function glide(fn){
  if(REDUCED){ fn(); apply(); return; }
  world.classList.add('glide'); fn(); apply();
  setTimeout(function(){ world.classList.remove('glide'); }, 600);
}
function vp(){ return { w: view.clientWidth, h: view.clientHeight }; }
function centerOn(wx, wy, scale, bias){
  var v = vp();
  if(scale) sc = Math.max(MIN, Math.min(MAX, scale));
  tx = v.w/2 - wx*sc;
  ty = (v.h/2 - wy*sc) - (bias || 0);
}
var BOX = (function(){
  var xs = NODES.map(function(n){ return n.x; }), ys = NODES.map(function(n){ return n.y; });
  return { x0:Math.min.apply(null,xs)-HW, x1:Math.max.apply(null,xs)+HW,
           y0:Math.min.apply(null,ys)-HH-52, y1:Math.max.apply(null,ys)+HH };
})();
function fit(){
  var v = vp(), padX = 48, padTop = 30, padBottom = v.w > 900 ? 120 : 96;
  var w = BOX.x1-BOX.x0, h = BOX.y1-BOX.y0;
  var s = Math.min((v.w-padX*2)/w, (v.h-padTop-padBottom)/h);
  s = Math.max(MIN, Math.min(1, s));
  glide(function(){
    sc = s;
    tx = v.w/2 - ((BOX.x0+BOX.x1)/2)*s;
    ty = padTop + (v.h-padTop-padBottom - h*s)/2 - BOX.y0*s;
  });
}
function zoomBy(k){
  var v = vp(), cx = v.w/2, cy = v.h/2;
  var ns = Math.max(MIN, Math.min(MAX, sc*k));
  glide(function(){ tx = cx-(cx-tx)*(ns/sc); ty = cy-(cy-ty)*(ns/sc); sc = ns; });
}
$('#zin').onclick = function(){ zoomBy(1.3); };
$('#zout').onclick = function(){ zoomBy(1/1.3); };
$('#zfit').onclick = fit;

var drag = null, justDragged = false;
var DRAG_SLOP = 4;   /* below this, it is a click, not a pan */

view.addEventListener('pointerdown', function(e){
  if(e.target.closest && e.target.closest('.mapchrome')) return;
  /* no preventDefault and no pointer capture here: both stop the browser
     from ever firing the click that opens a node. Capture is taken later,
     only once the pointer has actually travelled. */
  drag = { x:e.clientX, y:e.clientY, tx:tx, ty:ty, id:e.pointerId, moved:false, captured:false };
  view.classList.add('grabbing');
});
view.addEventListener('pointermove', function(e){
  if(!drag || e.pointerId !== drag.id) return;
  var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
  if(!drag.moved){
    if(Math.abs(dx) + Math.abs(dy) < DRAG_SLOP) return;
    drag.moved = true;
    try { view.setPointerCapture(drag.id); drag.captured = true; } catch(err){}
  }
  tx = drag.tx + dx; ty = drag.ty + dy;
  apply();
});
function endDrag(e){
  if(!drag || (e && e.pointerId !== drag.id)) return;
  if(drag.captured){ try { view.releasePointerCapture(drag.id); } catch(err){} }
  justDragged = drag.moved;
  if(drag.moved) setTimeout(function(){ justDragged = false; }, 0);
  drag = null;
  view.classList.remove('grabbing');
}
view.addEventListener('pointerup', endDrag);
view.addEventListener('pointercancel', endDrag);

view.addEventListener('wheel', function(e){
  e.preventDefault();
  var r = view.getBoundingClientRect();
  var px = e.clientX-r.left, py = e.clientY-r.top;
  var k = e.deltaY > 0 ? 0.88 : 1.12;
  var ns = Math.max(MIN, Math.min(MAX, sc*k));
  tx = px-(px-tx)*(ns/sc); ty = py-(py-ty)*(ns/sc); sc = ns;
  apply();
}, { passive:false });

/* pinch */
var pinch = null;
view.addEventListener('touchstart', function(e){
  if(e.touches.length === 2){
    var d = Math.hypot(e.touches[0].clientX-e.touches[1].clientX, e.touches[0].clientY-e.touches[1].clientY);
    pinch = { d:d, s:sc };
  }
}, { passive:true });
view.addEventListener('touchmove', function(e){
  if(pinch && e.touches.length === 2){
    e.preventDefault();
    var d = Math.hypot(e.touches[0].clientX-e.touches[1].clientX, e.touches[0].clientY-e.touches[1].clientY);
    var v = vp(), cx = v.w/2, cy = v.h/2;
    var ns = Math.max(MIN, Math.min(MAX, pinch.s * d/pinch.d));
    tx = cx-(cx-tx)*(ns/sc); ty = cy-(cy-ty)*(ns/sc); sc = ns;
    apply();
  }
}, { passive:false });
view.addEventListener('touchend', function(){ pinch = null; }, { passive:true });

function focusNode(id){
  var n = byId[id]; if(!n) return;
  var v = vp();
  var offset = v.w > 860 ? 200 : 0;
  glide(function(){
    if(sc < 0.8) sc = 0.95;
    tx = v.w/2 - n.x*sc - offset;
    ty = v.h/2 - n.y*sc - (v.w > 860 ? 0 : 120);
  });
}
function zoneCentre(zone){
  var ns = NODES.filter(function(n){ return n.zone === zone; });
  if(!ns.length) return;
  var xs = ns.map(function(n){ return n.x; }), ys = ns.map(function(n){ return n.y; });
  var cx = (Math.min.apply(null,xs)+Math.max.apply(null,xs))/2;
  var cy = (Math.min.apply(null,ys)+Math.max.apply(null,ys))/2;
  glide(function(){ centerOn(cx, cy, 0.8, 30); });
}
Array.prototype.forEach.call(document.querySelectorAll('.legend button'), function(b){
  b.onclick = function(){ zoneCentre(b.dataset.zone); };
});

/* ── the inspector drawer ───────────────────────────────── */
var drawer = $('#drawer'), scrim = $('#scrim'), current = null;
function esc(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;'); }

function detailHTML(d, kind){
  var h = '';
  if(d.lead) h += '<p class="lead">'+d.lead+'</p>';
  if(kind === 'node' && window.SCENES && window.SCENES[d.id]) h += window.SCENES[d.id];
  if(d.analogy) h += '<div class="analogy"><div class="alabel">'+d.analogy.label+'</div><p>'+d.analogy.text+'</p></div>';
  if(d.yours) h += '<div class="yours"><div class="alabel">On your Airtel line</div><p>'+d.yours+'</p></div>';
  if(d.figure && window.FIGURES && window.FIGURES[d.figure]) h += window.FIGURES[d.figure];
  (d.sections||[]).forEach(function(s){ h += '<h4>'+s.h+'</h4>'+s.html; });
  if(d.facts && d.facts.length){
    h += '<h4>At a glance</h4><table class="facts"><tbody>';
    d.facts.forEach(function(f){ h += '<tr><td>'+f[0]+'</td><td>'+esc(f[1])+'</td></tr>'; });
    h += '</tbody></table>';
  }
  return h;
}
function openDetail(d, kind){
  current = d;
  var zone = d.zone || 'core';
  var chips = '<span class="chip z-'+zone+'">'+ (d.chapter||'') +'</span>';
  if(kind === 'node') chips += '<span class="chip">on the map</span>';
  if(kind === 'layer') chips += '<span class="chip">layer '+d.n+' · '+d.unit+'</span>';
  $('#dchips').innerHTML = chips;
  $('#dtitle').textContent = d.title || d.name;
  $('#dsub').textContent = d.sub || d.protos || d.one || '';
  var body = $('#dbody');
  body.innerHTML = detailHTML(d, kind);
  body.style.setProperty('--zc','var(--'+zone+')');
  body.style.setProperty('--zbg','var(--'+zone+'-bg)');
  body.scrollTop = 0;
  drawer.hidden = false;
  requestAnimationFrame(function(){ drawer.classList.add('open'); });
  var overList = $('#mapview').hidden;
  if(window.innerWidth <= 860 || overList){
    scrim.hidden = false; requestAnimationFrame(function(){ scrim.style.opacity = overList ? .32 : 1; });
  }
  NODES.forEach(function(n){ n._el.setAttribute('aria-current', String(n === d)); });
  if(window.__ncAfterOpen) window.__ncAfterOpen(d, kind);
}
function closeDetail(){
  drawer.classList.remove('open');
  scrim.style.opacity = 0;
  setTimeout(function(){ drawer.hidden = true; scrim.hidden = true; }, 300);
  NODES.forEach(function(n){ n._el.setAttribute('aria-current','false'); });
  current = null;
  if(window.__ncAfterClose) window.__ncAfterClose();
}
$('#dclose').onclick = closeDetail;
scrim.onclick = closeDetail;
document.addEventListener('keydown', function(e){
  if(e.key === 'Escape'){ if(!drawer.hidden) closeDetail(); else if(idx >= 0){ reset(); fit(); } }
  if(document.activeElement && document.activeElement.tagName === 'INPUT') return;
  if(!$('#mapview').hidden){
    if(e.key === 'ArrowRight'){ e.preventDefault(); step(idx+1); }
    if(e.key === 'ArrowLeft'){ e.preventDefault(); step(idx-1); }
  }
});

/* ── the journey player ─────────────────────────────────── */
var idx = -1, playing = false, timer = null, anim = null;
var packet = $('#packet');
var pTitle = $('#ptitle'), pText = $('#ptext'), pStep = $('#pstep'), pFill = $('#pbarfill');

function clearLit(){
  world.classList.remove('focusing');
  NODES.forEach(function(n){ n._el.classList.remove('lit'); });
  Object.keys(edgeEls).forEach(function(k){ edgeEls[k].g.classList.remove('lit'); });
}
function findEdge(a, b){
  if(edgeEls[a+'|'+b]) return { e: edgeEls[a+'|'+b], rev:false };
  if(edgeEls[b+'|'+a]) return { e: edgeEls[b+'|'+a], rev:true };
  return null;
}
function movePacket(a, b, done){
  var A = byId[a], B = byId[b];
  if(!A || !B){ if(done) done(); return; }
  var e = findEdge(a,b);
  if(e) e.e.g.classList.add('lit');
  packet.style.opacity = 1;
  var dur = REDUCED ? 1 : 900, t0 = null;
  if(anim) cancelAnimationFrame(anim);
  var len = e ? e.e.geom.getTotalLength() : 0;
  function frame(ts){
    if(t0 === null) t0 = ts;
    var k = Math.min(1, (ts-t0)/dur);
    var ease = k < .5 ? 2*k*k : 1-Math.pow(-2*k+2,2)/2;
    var x, y;
    if(e && len){
      var p = e.e.geom.getPointAtLength((e.rev ? 1-ease : ease) * len);
      x = p.x; y = p.y;
    } else {
      x = A.x + (B.x-A.x)*ease; y = A.y + (B.y-A.y)*ease;
    }
    packet.setAttribute('cx', x); packet.setAttribute('cy', y);
    if(k < 1) anim = requestAnimationFrame(frame);
    else { packet.style.opacity = 0; if(done) done(); }
  }
  anim = requestAnimationFrame(frame);
}
function step(i){
  if(i < 0 || i >= JOURNEY.length) return;
  idx = i;
  var s = JOURNEY[i];
  clearLit();
  world.classList.add('focusing');
  var lit = (s.at || []).concat(s.move || []);
  lit.forEach(function(id){ if(byId[id]) byId[id]._el.classList.add('lit'); });
  pStep.textContent = 'Step '+(i+1)+' of '+JOURNEY.length;
  pTitle.innerHTML = s.title;
  pText.innerHTML = s.text;
  pFill.style.width = ((i+1)/JOURNEY.length*100)+'%';
  $('#prevbtn').disabled = i === 0;
  $('#nextbtn').disabled = i === JOURNEY.length-1;
  $('#resetbtn').hidden = false;

  var pts = lit.map(function(id){ return byId[id]; }).filter(Boolean);
  if(pts.length){
    var cx = pts.reduce(function(a,n){ return a+n.x; },0)/pts.length;
    var cy = pts.reduce(function(a,n){ return a+n.y; },0)/pts.length;
    var v = vp();
    glide(function(){ centerOn(cx, cy, Math.max(sc, 0.72), v.h > 620 ? 70 : 40); });
  }
  if(s.move) setTimeout(function(){ movePacket(s.move[0], s.move[1]); }, REDUCED ? 0 : 260);
  if(playing){
    clearTimeout(timer);
    if(i < JOURNEY.length-1) timer = setTimeout(function(){ step(i+1); }, 6200);
    else timer = setTimeout(stop, 6200);
  }
}
function play(){
  playing = true;
  $('#playlabel').textContent = 'Pause';
  $('#playbtn').querySelector('svg').innerHTML = '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
  step(idx < 0 || idx >= JOURNEY.length-1 ? 0 : idx+1);
}
function stop(){
  playing = false; clearTimeout(timer);
  $('#playlabel').textContent = idx >= JOURNEY.length-1 ? 'Play again'
    : (idx >= 0 ? 'Resume' : 'Send a packet');
  $('#playbtn').querySelector('svg').innerHTML = '<path d="M7 4l13 8-13 8z"/>';
}
function reset(){
  stop(); idx = -1; clearLit(); packet.style.opacity = 0;
  pStep.textContent = 'The journey · '+JOURNEY.length+' steps';
  pTitle.textContent = 'You tap a YouTube video on Airtel Wi-Fi';
  pText.textContent = 'Watch what actually happens between your thumb and Google’s servers — every box it touches, in order.';
  pFill.style.width = '0%';
  $('#playlabel').textContent = 'Send a packet';
  $('#prevbtn').disabled = true; $('#nextbtn').disabled = false;
  $('#resetbtn').hidden = true;
}
$('#playbtn').onclick = function(){ playing ? stop() : play(); };
$('#nextbtn').onclick = function(){ stop(); step(idx+1); };
$('#prevbtn').onclick = function(){ stop(); step(idx-1); };
$('#resetbtn').onclick = function(){ reset(); fit(); };
pStep.textContent = 'The journey · '+JOURNEY.length+' steps';

/* ── tabs ───────────────────────────────────────────────── */
var views = { home:$('#homeview'), map:$('#mapview'), layers:$('#layersview'), topics:$('#topicsview') };
var fitted = false;
function show(name){
  if(!views[name]) name = 'home';
  Object.keys(views).forEach(function(k){ views[k].hidden = k !== name; });
  Array.prototype.forEach.call(document.querySelectorAll('.nav button'), function(b){
    b.setAttribute('aria-selected', String(b.dataset.view === name));
  });
  if(name === 'map') requestAnimationFrame(function(){
    if(!fitted){ fitted = true; fit(); } else apply();
  });
}
Array.prototype.forEach.call(document.querySelectorAll('.nav button, .brand, [data-go]'), function(b){
  b.onclick = function(){ show(b.dataset.view || b.dataset.go); };
});
$('#herosend').onclick = function(){
  show('map');
  setTimeout(function(){ reset(); play(); }, 420);
};

/* ── theme ──────────────────────────────────────────────── */
function isDark(){
  var r = document.documentElement.getAttribute('data-theme');
  return r === 'dark' || (!r && window.matchMedia('(prefers-color-scheme: dark)').matches);
}
function setGrain(){
  var url = SK.grain(160, isDark());
  if(url) document.documentElement.style.setProperty('--grain-img', 'url('+url+')');
}
$('#themebtn').onclick = function(){
  var root = document.documentElement;
  var dark = root.getAttribute('data-theme') === 'dark' ||
    (!root.getAttribute('data-theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
  root.setAttribute('data-theme', dark ? 'light' : 'dark');
  try { localStorage.setItem('nc-theme', dark ? 'light' : 'dark'); } catch(err){}
  setGrain();
};
try { var t = localStorage.getItem('nc-theme'); if(t) document.documentElement.setAttribute('data-theme', t); } catch(err){}

setGrain();
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', setGrain);
window.__nc = { openDetail: openDetail, closeDetail: closeDetail, focusNode: focusNode, show: show, byId: byId, fit: fit, reset: reset };
window.addEventListener('resize', function(){ apply(); });
})();
