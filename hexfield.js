/* hexfield.js — the one picture that explains the word "cellular":
   a honeycomb of coverage laid over real ground, coloured by frequency reuse,
   stitched together by backhaul, with a phone crossing it and handing over as it goes. */
(function(){
'use strict';
var S = window.SK, N = 5000;
function sd(){ return (N += 13); }
var VW = 820, VH = 534;
var SZ = 60, W = Math.sqrt(3)*SZ, H = 1.5*SZ, COLS = 7, ROWS = 5, OX = 52, OY = 56;
var GROUPS = [
  { c:'var(--c-green)',  a:  22, n:'f1' },
  { c:'var(--c-orange)', a: -34, n:'f2' },
  { c:'var(--c-blue)',   a:  78, n:'f3' }
];

function hexPts(cx, cy, s){
  var p = [], i, a;
  for(i = 0; i < 6; i++){ a = Math.PI/180*(60*i - 90); p.push([cx+Math.cos(a)*s, cy+Math.sin(a)*s]); }
  return p;
}
function cell(c, r){
  return { x: OX + c*W + (r&1)*W/2, y: OY + r*H,
           g: (((c - (r - (r&1))/2) + 2*r) % 3 + 3) % 3 };
}
function mast(x, y, col, k){
  k = k || 1;
  var t = 17*k, b = 6*k;
  return '<g class="hx-m"><path d="M'+x+' '+(y-t)+'L'+(x+b)+' '+y+'L'+(x-b)+' '+y+'Z" fill="var(--paper)" '+
    'fill-opacity=".55" stroke="var(--ink)" stroke-width="'+(1.5*k)+'" stroke-linejoin="round"/>'+
    '<line x1="'+(x-3.6*k)+'" y1="'+(y-6*k)+'" x2="'+(x+3.6*k)+'" y2="'+(y-6*k)+'" stroke="var(--ink)" stroke-width="'+(1*k)+'"/>'+
    '<line x1="'+(x-2.2*k)+'" y1="'+(y-11*k)+'" x2="'+(x+2.2*k)+'" y2="'+(y-11*k)+'" stroke="var(--ink)" stroke-width="'+(1*k)+'"/>'+
    '<circle cx="'+x+'" cy="'+(y-t-2.5*k)+'" r="'+(2.6*k)+'" fill="'+col+'"/></g>';
}

var defs = '', land = '', grid = '', back = '', masts = '', over = '';

/* ── the ground it all sits on ──────────────────────────── */
(function(){
  var coast = S.ds([[0,0],[86,54],[62,132],[104,214],[70,300],[112,386],[74,470],[92,VH]], false, 3, sd());
  var sea = coast + 'L0 '+VH+'Z';
  var cs = S.clip(sea); defs += cs.def;
  land += '<path d="'+sea+'" fill="var(--c-blue)" opacity=".26"/>';
  land += S.hatch(cs.id, {x:0, y:0, w:120, h:VH}, 6, 9, 'var(--c-blue)', 1, .32, sd(), '10 7');
  land += '<path d="'+coast+'" fill="none" stroke="var(--ink)" stroke-width="2" opacity=".5"/>';

  var all = S.d([[0,0],[VW,0],[VW,VH],[0,VH]], true, 0, sd());
  var ca = S.clip(all); defs += ca.def;
  land += '<rect width="'+VW+'" height="'+VH+'" fill="var(--c-green)" opacity=".13"/>';
  land += S.tooth(ca.id, {x:100, y:0, w:VW-100, h:VH}, 14, 240, 'var(--c-green)', 1, .3, sd(), 9);
  land += S.stipple(ca.id, {x:110, y:0, w:VW-110, h:VH}, 130, 'var(--c-green)', 1.6, sd(), .32);

  var river = S.ds([[VW,96],[640,150],[520,148],[404,206],[330,282],[196,330],[96,392]], false, 4, sd());
  land += '<path d="'+river+'" fill="none" stroke="var(--c-blue)" stroke-width="7" opacity=".3" stroke-linecap="round"/>';
  land += '<path d="'+river+'" fill="none" stroke="var(--c-blue)" stroke-width="2" opacity=".45" stroke-linecap="round"/>';
})();

/* ── the honeycomb, coloured by which frequencies it uses ─ */
(function(){
  var r, c, k, p, d, cl, G;
  for(r = 0; r < ROWS; r++) for(c = 0; c < COLS; c++){
    k = cell(c, r); G = GROUPS[k.g];
    p = hexPts(k.x, k.y, SZ - 2.5);
    d = S.d(p, true, 1.8, sd());
    cl = S.clip(d); defs += cl.def;
    grid += '<path d="'+d+'" fill="'+G.c+'" opacity=".17"/>';
    grid += S.hatch(cl.id, {x:k.x-SZ, y:k.y-SZ, w:2*SZ, h:2*SZ}, G.a, 8, G.c, .9, .4, sd(), '5 7');
    grid += '<path d="'+d+'" fill="none" stroke="'+G.c+'" stroke-width="1.7" opacity=".62" stroke-linejoin="round"/>';
  }
})();

/* ── backhaul: every mast has to get its traffic home ───── */
(function(){
  var r, c, a, b, d;
  for(r = 0; r < ROWS; r++) for(c = 0; c < COLS; c++){
    a = cell(c, r);
    if(c < COLS-1){
      b = cell(c+1, r);
      d = S.ds([[a.x,a.y],[(a.x+b.x)/2,(a.y+b.y)/2-4],[b.x,b.y]], false, 2, sd());
      back += '<path d="'+d+'" fill="none" stroke="var(--c-yellow)" stroke-width="2" opacity=".72" stroke-linecap="round"/>';
    }
    if(r < ROWS-1 && (c + r) % 2 === 0){
      b = cell(c, r+1);
      d = S.ds([[a.x,a.y],[b.x,b.y]], false, 2, sd());
      back += '<path d="'+d+'" fill="none" stroke="var(--c-yellow)" stroke-width="1.6" opacity=".5" stroke-linecap="round"/>';
    }
  }
  /* the trunk out to the operator's core */
  var last = cell(COLS-1, 2);
  var trunk = S.ds([[last.x,last.y],[last.x+62,last.y+34],[VW-152,VH-92],[VW-112,VH-78]], false, 2.4, sd());
  back += '<path d="'+trunk+'" fill="none" stroke="var(--c-yellow)" stroke-width="4" opacity=".95" stroke-linecap="round"/>';
})();

/* ── masts ──────────────────────────────────────────────── */
(function(){
  var r, c, k;
  for(r = 0; r < ROWS; r++) for(c = 0; c < COLS; c++){
    k = cell(c, r);
    masts += mast(k.x, k.y + 9, GROUPS[k.g].c, 1);
  }
})();

/* ── a phone crossing the field, handing over as it goes ── */
(function(){
  var road = S.ds([[62,442],[188,392],[300,332],[404,262],[520,214],[642,150],[792,104]], false, 3, sd());
  over += '<path d="'+road+'" fill="none" stroke="var(--ink)" stroke-width="7" opacity=".16" stroke-linecap="round"/>';
  over += '<path d="'+road+'" fill="none" stroke="var(--ink)" stroke-width="1.6" opacity=".5" stroke-dasharray="9 9" stroke-linecap="round"/>';

  var stops = [[130,418,cell(0,4)], [340,300,cell(2,3)], [556,192,cell(4,1)], [748,118,cell(6,0)]];
  stops.forEach(function(st, i){
    var t = cell(0,0);
    t = st[2];
    var d = S.ds([[st[0],st[1]],[(st[0]+t.x)/2,(st[1]+t.y)/2],[t.x,t.y+2]], false, 2, sd());
    over += '<path class="hop" d="'+d+'" fill="none" stroke="var(--c-red)" stroke-width="2.6" '+
      'stroke-linecap="round" stroke-dasharray="7 6" style="--dur:9s;--dly:'+(i*2.25)+'s"/>';
  });
  over += '<circle class="mv" r="8.5" cx="0" cy="0" fill="var(--c-red)" stroke="var(--paper)" stroke-width="2.5" '+
    'style="offset-path:path(\''+road+'\');--dur:9s;--dly:0s"/>';
})();

/* ── labels and legend ──────────────────────────────────── */
(function(){
  var by = VH - 98;
  var cb = S.d(S.rrect(VW-112, by, 100, 42, 7), true, 1.2, sd());
  over += S.shape(cb, {x:VW-112, y:by, w:100, h:42}, { fill:'var(--core-bg)', shade:'var(--core)',
    gap:5, shadeOp:.22, seed:sd(), w:2, inkColor:'var(--core)' }).svg;
  over += '<text x="'+(VW-62)+'" y="'+(by+18)+'" text-anchor="middle" class="sc-l">Mobile core</text>';
  over += '<text x="'+(VW-62)+'" y="'+(by+32)+'" text-anchor="middle" class="sc-s">then the internet</text>';

  var lx = 20, ly = VH - 26;
  GROUPS.forEach(function(G, i){
    var p = S.d(hexPts(lx + 26 + i*74, ly, 13), true, 1, sd());
    over += '<path d="'+p+'" fill="'+G.c+'" opacity=".3"/>';
    over += '<path d="'+p+'" fill="none" stroke="'+G.c+'" stroke-width="1.6"/>';
    over += '<text x="'+(lx + 44 + i*74)+'" y="'+(ly+4)+'" class="sc-t" text-anchor="start">'+G.n+'</text>';
  });
  over += '<text x="'+(lx + 246)+'" y="'+(ly+4)+'" class="sc-t" text-anchor="start">'+
    'no two touching cells share a frequency</text>';
  over += '<text x="'+(VW-20)+'" y="40" class="sc-t" text-anchor="end">yellow = backhaul, the wire out of every mast</text>';
})();

var FIG = '<figure class="sc zoom" data-title="Why it is called cellular">'+
  '<span class="zhint">tap to enlarge</span><div class="figscroll">'+
  '<svg viewBox="0 0 '+VW+' '+VH+'" role="img" style="min-width:620px" '+
  'aria-label="A honeycomb of cell coverage over a coastline and river. Each cell is coloured by which '+
  'group of frequencies it uses, so no two touching cells match. A mast stands in every cell, linked to its '+
  'neighbours by backhaul lines that run to the operator’s core. A phone travels a road across the field '+
  'and its link hands over from mast to mast as it goes.">'+
  '<defs>'+defs+'</defs>'+land+grid+back+masts+over+'</svg></div>'+
  '<figcaption><b>This is why it is called &ldquo;cellular&rdquo;.</b> Coverage is not a blanket — it is a '+
  'honeycomb, because hexagons tile a plane with no gaps and keep the distance to the mast most even. '+
  'Neighbouring cells <i>must</i> use different frequencies or they would drown each other out, so the pattern '+
  'repeats a few cells away; this one is drawn with a reuse of three, and real networks use three, seven or '+
  'twelve. Watch the red link jump between masts as the phone drives — that is a handover, and it happens '+
  'dozens of times on your way to work without you ever noticing.</figcaption></figure>';

window.HEXFIELD = FIG;
if(window.SCENES){
  window.HANDOVER = window.SCENES.tower;
  window.SCENES.tower = FIG;
}
})();
