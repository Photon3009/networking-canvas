/* art.js — a hand-drawn illustration for every box on the map.
   Each function draws inside a 100 × 74 box and returns an SVG fragment. */
(function(){
'use strict';
var S = window.SK;
function bx(x,y,w,h){ return {x:x, y:y, w:w, h:h}; }
function sh(path, box, o){ return S.shape(path, box, o).svg; }
function line(a, b, c, w, sd){ return S.ink(S.d([a,b], false, 0.7, sd||31), c||'var(--ink)', w||1.4, (sd||31)+3); }
function dot(x, y, r, c){ return '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+(c||'var(--ink)')+'"/>'; }

var A = {};

/* ── your home ──────────────────────────────────────────── */
A.phone = function(){
  var body = S.d(S.rrect(34,4,33,66,7), true, .8, 21);
  var scr  = S.d(S.rrect(38,12,25,49,3), true, .7, 22);
  var s = sh(body, bx(34,4,33,66), { fill:'var(--c-tan)', shade:'var(--c-brown)', gap:3, shadeOp:.3,
        shade2:'var(--c-cream)', shade2Op:.22, tooth:'var(--ink)', toothN:22, toothOp:.16, seed:21, w:1.9 });
  s += sh(scr, bx(38,12,25,49), { fill:'var(--c-cream)', shade:'var(--c-blue)', gap:3.4, shadeOp:.3, shadeAngle:-32,
        tooth:'var(--c-blue)', toothN:14, toothOp:.28, seed:22, w:1.2 });
  s += S.fill(S.d(S.rrect(42,21,17,13,2), true, .6, 23), 'var(--c-red)', .6);
  s += S.ink(S.d([[47,27],[53,30],[47,33]], true, .5, 24), 'var(--paper)', 1.1, 25);
  s += line([45,65],[56,65], 'var(--ink)', 1.5, 26);
  s += dot(50, 8, 1.4);
  return s;
};
A.wifi = function(){
  var s = '', i, r;
  for(i = 0; i < 4; i++){
    r = 12 + i*11;
    s += S.ink('M'+(50-r)+' 58 A'+r+' '+r+' 0 0 1 '+(50+r)+' 58', i < 2 ? 'var(--c-green)' : 'var(--c-blue)',
      2.2 - i*0.3, 40+i, 1 - i*0.16);
  }
  s += dot(50, 58, 3.4, 'var(--c-red)');
  var w = S.d([[22,64],[78,64]], false, .8, 45);
  s += S.ink(w, 'var(--ink)', 1.6, 46, .5);
  var c = S.clip(S.d(S.rrect(18,18,64,44,4), true, .6, 47));
  s = '<defs>'+c.def+'</defs>' + s + S.tooth(c.id, bx(18,18,64,44), 18, 14, 'var(--c-blue)', .7, .22, 48, 6);
  return s;
};
A.router = function(){
  var body = S.d(S.rrect(16,32,68,30,5), true, .8, 51);
  var s = '';
  s += S.ink(S.d([[30,32],[22,6]], false, .9, 52), 'var(--ink)', 2, 53);
  s += S.ink(S.d([[70,32],[78,6]], false, .9, 54), 'var(--ink)', 2, 55);
  s += dot(22, 5, 2.2); s += dot(78, 5, 2.2);
  s += sh(body, bx(16,32,68,30), { fill:'var(--c-cream)', shade:'var(--c-tan)', gap:2.8, shadeOp:.45,
        shade2:'var(--c-brown)', shade2Op:.2, shade2Angle:-40, tooth:'var(--ink)', toothN:26, toothOp:.18, seed:51, w:1.9 });
  [30,40,50,60].forEach(function(x, i){ s += dot(x, 54, 2, i === 0 ? 'var(--c-green)' : (i === 3 ? 'var(--c-red)' : 'var(--c-yellow)')); });
  s += line([22,42],[78,42], 'var(--ink)', 1, 56);
  return s;
};
A.tv = function(){
  var scr = S.d(S.rrect(10,10,80,44,3), true, .8, 61);
  var s = sh(scr, bx(10,10,80,44), { fill:'var(--c-cream)', shade:'var(--c-blue)', gap:3.2, shadeOp:.3, shadeAngle:-28,
        shade2:'var(--c-green)', shade2Op:.18, tooth:'var(--c-blue)', toothN:20, toothOp:.22, seed:61, w:2 });
  s += S.fill(S.d(S.rrect(20,20,34,18,2), true, .6, 62), 'var(--c-pink)', .5);
  s += S.fill(S.d(S.rrect(58,26,22,14,2), true, .6, 63), 'var(--c-yellow)', .45);
  s += line([50,54],[50,64], 'var(--ink)', 2, 64);
  s += line([34,65],[66,65], 'var(--ink)', 2.4, 65);
  return s;
};
A.laptop = function(){
  var lid = S.d([[24,8],[76,8],[82,48],[18,48]], true, .8, 71);
  var base = S.d([[12,50],[88,50],[94,62],[6,62]], true, .8, 72);
  var s = sh(lid, bx(18,8,64,40), { fill:'var(--c-cream)', shade:'var(--c-blue)', gap:3, shadeOp:.3, shadeAngle:-30,
        tooth:'var(--c-blue)', toothN:16, toothOp:.24, seed:71, w:1.9 });
  s += sh(base, bx(6,50,88,12), { fill:'var(--c-tan)', shade:'var(--c-brown)', gap:2.4, shadeOp:.32, seed:72, w:1.9 });
  s += S.fill(S.d(S.rrect(30,16,28,12,1), true, .5, 73), 'var(--c-green)', .4);
  s += line([40,56],[60,56], 'var(--ink)', 1.2, 74);
  return s;
};

/* ── the last mile ──────────────────────────────────────── */
A.tower = function(){
  var mast = S.d([[50,8],[64,66],[36,66]], true, .9, 81);
  var s = '', i, t, x1, x2, y;
  for(i = 0; i < 4; i++){ y = 46 - i*11; t = (66-y)/58; x1 = 50-14*t; x2 = 50+14*t;
    s += S.ink(S.d([[x1,y],[x2,y-6]], false, .7, 82+i), 'var(--ink)', 1.1, 90+i, .8);
    s += S.ink(S.d([[x1,y-6],[x2,y]], false, .7, 86+i), 'var(--ink)', 1.1, 94+i, .8); }
  s = sh(mast, bx(36,8,28,58), { fill:'var(--c-tan)', fillOp:.5, shade:'var(--c-brown)', gap:3.4, shadeOp:.3, seed:81, w:2 }) + s;
  [1,2].forEach(function(k){
    s += S.ink('M'+(50-8-k*9)+' '+(24-k*4)+' A'+(10+k*9)+' '+(10+k*9)+' 0 0 1 '+(50-8-k*9)+' '+(4+k*4),
      'var(--c-green)', 1.8-k*.3, 100+k, 1-k*.25);
    s += S.ink('M'+(50+8+k*9)+' '+(24-k*4)+' A'+(10+k*9)+' '+(10+k*9)+' 0 0 0 '+(50+8+k*9)+' '+(4+k*4),
      'var(--c-green)', 1.8-k*.3, 104+k, 1-k*.25);
  });
  s += dot(50, 8, 2.6, 'var(--c-red)');
  return s;
};
A.mcore = function(){
  var cl = S.ds(S.blob(50,38,42,26,14,.1,111), true, 1, 112);
  var s = sh(cl, bx(8,12,84,52), { fill:'var(--c-cream)', shade:'var(--c-blue)', gap:3.6, shadeOp:.26,
        shade2:'var(--c-tan)', shade2Op:.24, tooth:'var(--ink)', toothN:22, toothOp:.14, seed:111, w:2 });
  [26,50,74].forEach(function(x, i){
    var r = S.d(S.rrect(x-10,24,20,28,2), true, .6, 113+i);
    s += sh(r, bx(x-10,24,20,28), { fill:'var(--c-tan)', shade:'var(--c-brown)', gap:2.2, shadeOp:.32, seed:113+i, w:1.3 });
    [30,37,44].forEach(function(y){ s += line([x-6,y],[x+6,y], 'var(--ink)', .8, x+y); });
    s += dot(x+6, 49, 1.3, 'var(--c-green)');
  });
  return s;
};
A.splitter = function(){
  var drum = S.d(S.rrect(30,24,26,28,5), true, .8, 121);
  var s = '';
  s += S.ink(S.d([[2,38],[30,38]], false, .8, 122), 'var(--c-orange)', 2.4, 123);
  var i, y;
  for(i = 0; i < 7; i++){
    y = 12 + i*8.4;
    s += S.ink(S.d([[56,38],[72,y],[96,y]], false, .8, 124+i), 'var(--c-blue)', 1.2, 130+i, .75);
  }
  s += sh(drum, bx(30,24,26,28), { fill:'var(--c-green)', fillOp:.7, shade:'var(--ink)', gap:2.6, shadeOp:.22,
        shade2:'var(--c-cream)', shade2Op:.3, seed:121, w:2 });
  s += dot(43, 38, 3, 'var(--c-yellow)');
  return s;
};
A.olt = function(){
  var cab = S.d(S.rrect(26,4,48,66,3), true, .8, 141);
  var s = sh(cab, bx(26,4,48,66), { fill:'var(--c-tan)', shade:'var(--c-brown)', gap:2.6, shadeOp:.3,
        shade2:'var(--c-cream)', shade2Op:.22, shade2Angle:-46, tooth:'var(--ink)', toothN:30, toothOp:.16, seed:141, w:2 });
  var i, y;
  for(i = 0; i < 7; i++){
    y = 11 + i*8.4;
    s += line([31,y],[69,y], 'var(--ink)', 1, 150+i);
    s += dot(35, y-2.4, 1.2, i % 3 ? 'var(--c-green)' : 'var(--c-red)');
    s += dot(39, y-2.4, 1.2, 'var(--c-yellow)');
  }
  s += S.ink(S.d([[74,38],[96,38]], false, .8, 160), 'var(--c-orange)', 2.2, 161);
  s += S.ink(S.d([[4,38],[26,38]], false, .8, 162), 'var(--c-orange)', 2.2, 163);
  return s;
};

window.ART = A;
})();

/* ── the carrier core and the open internet ─────────────── */
(function(){
'use strict';
var S = window.SK, A = window.ART;
function bx(x,y,w,h){ return {x:x, y:y, w:w, h:h}; }
function sh(path, box, o){ return S.shape(path, box, o).svg; }
function line(a, b, c, w, sd){ return S.ink(S.d([a,b], false, 0.7, sd||31), c||'var(--ink)', w||1.4, (sd||31)+3); }
function dot(x, y, r, c){ return '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+(c||'var(--ink)')+'"/>'; }

A.bng = function(){
  var post = function(x, sd){ return S.d(S.rrect(x-6,14,12,54,2), true, .7, sd); };
  var s = '';
  s += sh(post(20, 171), bx(14,14,12,54), { fill:'var(--c-tan)', shade:'var(--c-brown)', gap:2.4, shadeOp:.32, seed:171, w:1.7 });
  s += sh(post(80, 172), bx(74,14,12,54), { fill:'var(--c-tan)', shade:'var(--c-brown)', gap:2.4, shadeOp:.32, seed:172, w:1.7 });
  var bar = S.d(S.rrect(20,30,60,9,3), true, .7, 173);
  s += sh(bar, bx(20,30,60,9), { fill:'var(--c-red)', fillOp:.75, shade:'var(--paper)', gap:3, shadeOp:.35, shadeAngle:62, seed:173, w:1.6 });
  var bar2 = S.d(S.rrect(20,48,60,9,3), true, .7, 174);
  s += sh(bar2, bx(20,48,60,9), { fill:'var(--c-cream)', shade:'var(--c-red)', gap:3, shadeOp:.4, shadeAngle:62, seed:174, w:1.6 });
  s += S.ink(S.d([[50,4],[50,14]], false, .6, 175), 'var(--ink)', 1.4, 176);
  s += dot(50, 4, 2.4, 'var(--c-yellow)');
  s += S.ink(S.d([[4,70],[96,70]], false, .9, 177), 'var(--ink)', 1.3, 178, .45);
  return s;
};
A.backbone = function(){
  var cl = S.ds(S.blob(50,38,44,27,15,.11,181), true, 1.1, 182);
  var s = sh(cl, bx(6,11,88,54), { fill:'var(--c-cream)', shade:'var(--c-blue)', gap:3.4, shadeOp:.3,
        shade2:'var(--c-green)', shade2Op:.2, tooth:'var(--ink)', toothN:26, toothOp:.14, seed:181, w:2.1 });
  var pts = [[26,34],[42,22],[58,40],[74,28],[38,50],[64,54]];
  var link = [[0,1],[1,2],[2,3],[0,4],[4,2],[2,5],[5,3]];
  link.forEach(function(L, i){ s += line(pts[L[0]], pts[L[1]], 'var(--c-blue)', 1.2, 190+i); });
  pts.forEach(function(p, i){ s += dot(p[0], p[1], 3.2, i % 2 ? 'var(--c-red)' : 'var(--c-green)'); });
  return s;
};
A.resolver = function(){
  var lf = S.d([[50,16],[14,22],[16,62],[50,56]], true, .9, 201);
  var rt = S.d([[50,16],[86,22],[84,62],[50,56]], true, .9, 202);
  var s = sh(lf, bx(14,16,36,46), { fill:'var(--c-cream)', shade:'var(--c-tan)', gap:3, shadeOp:.35, seed:201, w:1.9 });
  s += sh(rt, bx(50,16,36,46), { fill:'var(--c-cream)', shade:'var(--c-tan)', gap:3, shadeOp:.35, shadeAngle:-38, seed:202, w:1.9 });
  var i, y;
  for(i = 0; i < 5; i++){
    y = 26 + i*7;
    s += line([21,y+1],[45,y-1], 'var(--c-blue)', .9, 210+i);
    s += line([55,y-1],[79,y+1], 'var(--c-blue)', .9, 220+i);
  }
  s += S.ink(S.d([[50,16],[50,56]], false, .7, 230), 'var(--ink)', 2, 231);
  s += dot(50, 12, 2.6, 'var(--c-red)');
  return s;
};
A.dnstree = function(){
  var s = '', nodes = [[50,12],[24,38],[50,38],[76,38],[14,64],[34,64],[50,64],[66,64],[86,64]];
  [[0,1],[0,2],[0,3],[1,4],[1,5],[2,6],[3,7],[3,8]].forEach(function(L, i){
    s += line(nodes[L[0]], nodes[L[1]], 'var(--c-green)', 1.3, 241+i);
  });
  nodes.forEach(function(n, i){
    var c = i === 0 ? 'var(--c-red)' : (i < 4 ? 'var(--c-yellow)' : 'var(--c-green)');
    var e = S.d(S.ell(n[0], n[1], i === 0 ? 8 : 6, i === 0 ? 8 : 6, 16), true, .7, 250+i);
    s += sh(e, bx(n[0]-8, n[1]-8, 16, 16), { fill:c, fillOp:.85, shade:'var(--paper)', gap:2.4, shadeOp:.3, seed:250+i, w:1.5 });
  });
  return s;
};
A.ggc = function(){
  var box2 = S.d(S.rrect(18,18,64,46,4), true, .8, 261);
  var s = sh(box2, bx(18,18,64,46), { fill:'var(--c-green)', fillOp:.55, shade:'var(--ink)', gap:2.8, shadeOp:.2,
        shade2:'var(--c-cream)', shade2Op:.35, shade2Angle:-44, tooth:'var(--c-cream)', toothN:22, toothOp:.25, seed:261, w:2 });
  [28,40,52].forEach(function(y, i){
    s += line([24,y],[76,y], 'var(--ink)', 1, 270+i);
    s += dot(29, y-3.6, 1.4, 'var(--c-yellow)');
    s += dot(34, y-3.6, 1.4, 'var(--c-green)');
  });
  var tick = S.d([[38,56],[46,62],[64,44]], false, .8, 275);
  s += S.ink(tick, 'var(--c-red)', 3.2, 276);
  s += S.ink(S.d([[8,41],[18,41]], false, .6, 277), 'var(--c-orange)', 2, 278);
  return s;
};
A.ixp = function(){
  var hub = S.d(S.rrect(34,26,32,24,4), true, .8, 281);
  var s = '', i, a, x, y;
  for(i = 0; i < 8; i++){
    a = (i/8)*Math.PI*2 + 0.39;
    x = 50 + Math.cos(a)*42; y = 38 + Math.sin(a)*30;
    s += S.ink(S.d([[50,38],[x,y]], false, .8, 290+i), i % 2 ? 'var(--c-blue)' : 'var(--c-pink)', 1.5, 300+i, .85);
    s += dot(x, y, 3, i % 2 ? 'var(--c-blue)' : 'var(--c-pink)');
  }
  s += sh(hub, bx(34,26,32,24), { fill:'var(--c-yellow)', fillOp:.85, shade:'var(--c-brown)', gap:2.6, shadeOp:.28,
        dots:'var(--c-brown)', dotsN:14, dotR:.9, seed:281, w:2 });
  return s;
};
A.subsea = function(){
  var sea = S.d([[0,18],[100,18],[100,74],[0,74]], true, .8, 311);
  var s = sh(sea, bx(0,18,100,56), { fill:'var(--c-blue)', fillOp:.4, shade:'var(--c-blue)', gap:3.4, shadeOp:.3,
        shade2:'var(--paper)', shade2Op:.22, shade2Angle:8, ink:false, seed:311 });
  var i, y;
  for(i = 0; i < 3; i++){
    y = 14 + i*7;
    s += S.ink('M2 '+y+' q12 -6 24 0 t24 0 t24 0 t24 0', 'var(--c-blue)', 1.5, 320+i, .8 - i*.2);
  }
  var bed = S.d([[0,60],[18,56],[40,62],[64,55],[86,61],[100,57],[100,74],[0,74]], true, 1, 330);
  s += sh(bed, bx(0,55,100,19), { fill:'var(--c-tan)', shade:'var(--c-brown)', gap:2.4, shadeOp:.35,
        dots:'var(--c-brown)', dotsN:26, dotR:1, seed:330, w:1.6 });
  s += S.ink('M0 54 q22 10 40 2 t34 -2 t26 6', 'var(--ink)', 3, 331);
  s += S.ink('M0 54 q22 10 40 2 t34 -2 t26 6', 'var(--c-orange)', 1.3, 332);
  return s;
};
A.gdc = function(){
  var b1 = S.d(S.rrect(10,22,44,48,2), true, .8, 341);
  var b2 = S.d(S.rrect(54,34,36,36,2), true, .8, 342);
  var s = sh(b1, bx(10,22,44,48), { fill:'var(--c-cream)', shade:'var(--c-tan)', gap:2.8, shadeOp:.4,
        shade2:'var(--c-brown)', shade2Op:.18, shade2Angle:-40, seed:341, w:2 });
  s += sh(b2, bx(54,34,36,36), { fill:'var(--c-tan)', shade:'var(--c-brown)', gap:2.6, shadeOp:.3, seed:342, w:2 });
  var r, c;
  for(r = 0; r < 4; r++) for(c = 0; c < 4; c++){
    s += S.fill(S.d(S.rrect(16+c*10, 28+r*11, 6, 7, 1), true, .5, 350+r*4+c),
      (r+c) % 3 ? 'var(--c-yellow)' : 'var(--c-blue)', .75);
  }
  for(r = 0; r < 3; r++) for(c = 0; c < 3; c++){
    s += S.fill(S.d(S.rrect(59+c*10, 40+r*10, 6, 6, 1), true, .5, 370+r*3+c), 'var(--c-cream)', .6);
  }
  s += S.ink(S.d([[32,22],[32,10]], false, .6, 380), 'var(--ink)', 1.4, 381);
  s += S.fill(S.d([[32,10],[46,13],[32,17]], true, .6, 382), 'var(--c-red)', .9);
  return s;
};
A.origin = function(){
  var g = S.d(S.ell(50,38,32,32,26), true, .9, 391);
  var s = sh(g, bx(18,6,64,64), { fill:'var(--c-blue)', fillOp:.35, shade:'var(--c-blue)', gap:3.4, shadeOp:.3,
        shade2:'var(--c-green)', shade2Op:.25, shade2Angle:-40, seed:391, w:2.1 });
  s += S.ink('M18 38 h64', 'var(--ink)', 1, 392, .5);
  s += S.ink('M50 6 a22 32 0 0 0 0 64 a22 32 0 0 0 0 -64', 'var(--ink)', 1, 393, .45);
  var land = S.d(S.blob(38,28,13,9,12,.3,394), true, .8, 395);
  s += sh(land, bx(25,19,26,18), { fill:'var(--c-green)', fillOp:.8, shade:'var(--ink)', gap:2.4, shadeOp:.2, seed:394, w:1.3 });
  var land2 = S.d(S.blob(63,50,11,8,12,.3,396), true, .8, 397);
  s += sh(land2, bx(52,42,22,16), { fill:'var(--c-green)', fillOp:.8, shade:'var(--ink)', gap:2.4, shadeOp:.2, seed:396, w:1.3 });
  var i;
  for(i = 0; i < 5; i++) s += dot(6 + i*2.6, 62 - i*2, 1.2, 'var(--c-orange)');
  return s;
};
})();
