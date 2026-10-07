/* art.js — an isometric illustration for every box on the map.
   Each function draws into a 160 × 112 box with the ISO kit and returns an SVG fragment. */
(function(){
'use strict';
var I = window.ISO;
var DEV = 'var(--dev)', DARK = 'var(--iso-dark)', SCR = 'var(--scr)';
var RED = 'var(--c-red)', ORANGE = 'var(--c-orange)', TAN = 'var(--c-tan)', GREEN = 'var(--c-green)';
var YELLOW = 'var(--c-yellow)', BLUE = 'var(--c-blue)', PINK = 'var(--c-pink)', ACCENT = 'var(--accent)';
var WHITE = 'color-mix(in srgb,var(--dev),#fff 60%)';
var UID = 0;

/* a little packet: the accent cube that recurs across the set */
function packet(x, y, z, s){ s = s || 7; return I.box(x, y, z, s, s, s, ACCENT, { ht:false }); }

var A = {};

/* ── your home ──────────────────────────────────────────── */
A.phone = function(){
  I.at(84, 70);
  var s = I.begin() + I.shadow(-15, -28, 30, 56, 6);
  s += I.box(-15, -28, 3, 30, 56, 4, DARK, { top:DARK });
  s += I.face('z', 7, -13, -25, 13, 25, SCR);
  s += I.face('z', 7.05, -10, -21, 10, -5, RED);                         /* the video you tapped */
  s += I.poly([[-3,-16,7.1],[4,-13,7.1],[-3,-10,7.1]], WHITE, { edge:false });
  [[-1,2,10],[3,6,7],[7,10,9],[11,14,5]].forEach(function(r){
    s += I.face('z', 7.05, -10, r[0], -10+r[2]*1.6, r[1], WHITE, { edge:false, op:.35 });
  });
  s += I.face('z', 7.05, -4, 19.5, 4, 21, WHITE, { edge:false, op:.6 });
  s += I.line([[0,-13,8],[0,-13,26]], ACCENT, 1, { dash:'2 2.4' });
  s += packet(-3.5, -16.5, 27);
  return s;
};

A.wifi = function(){
  I.at(80, 76);
  var s = I.begin(), k;
  for(k = 4; k >= 1; k--) s += I.ring(0, 0, 0, k*11, k < 3 ? GREEN : BLUE, 1.3, 1.05 - k*.2, k > 2 ? '3 3' : '');
  s += I.disc(0, 0, 0, 13, 'var(--ink)', .06);
  s += I.cyl(0, 0, 0, 9, 7, DEV);
  s += I.dot(0, 0, 7, 1.6, GREEN);
  var c = I.P(0, 0, 16);
  [9, 16, 23].forEach(function(r, i){
    s += '<path d="M'+I.f(c[0]-r)+' '+I.f(c[1])+'A'+r+' '+r+' 0 0 1 '+I.f(c[0]+r)+' '+I.f(c[1])+'" fill="none" stroke="'+
      (i < 2 ? GREEN : BLUE)+'" stroke-width="'+(2.4 - i*.4)+'" stroke-linecap="round" opacity="'+(1 - i*.22)+'"/>';
  });
  /* three devices sharing the same air, standing on the rings */
  s += I.box(-30, 14, 0, 6, 6, 9, DEV) + I.box(26, 16, 0, 6, 6, 6, DEV) + I.box(10, -40, 0, 6, 6, 7, DEV);
  return s;
};

A.router = function(){
  I.at(78, 72);
  var s = I.begin() + I.shadow(-26, -16, 52, 32);
  s += I.cyl(-21, -12, 11, 1.7, 26, DARK) + I.cyl(19, -13, 11, 1.7, 26, DARK);
  s += I.box(-26, -16, 0, 52, 32, 12, DEV);
  s += I.face('z', 12.05, -20, -10, 20, -7, ACCENT, { edge:false, op:.8 });
  [[-20,GREEN],[-14,YELLOW],[-8,YELLOW],[-2,GREEN],[4,RED]].forEach(function(l){ s += I.dot(l[0], 16, 7, 1.5, l[1]); });
  [-11, -5, 1, 7].forEach(function(y){ s += I.face('x', 26.05, y, 3, y+4, 8, DARK); });
  s += I.cable([[26,11,4],[38,11,1],[54,11,0]], ORANGE, 2.2);
  return s;
};

A.tv = function(){
  I.at(80, 84);
  var s = I.begin() + I.shadow(-16, -9, 32, 18);
  s += I.box(-16, -9, 0, 32, 18, 2.5, DARK);
  s += I.box(-2.5, -2.5, 2.5, 5, 5, 10, DARK);
  s += I.box(-36, -2, 12, 72, 4, 44, DARK);
  s += I.face('y', 2.05, -33, 15, 33, 53, SCR);
  s += I.face('y', 2.1, -29, 32, -4, 49, PINK);
  s += I.face('y', 2.1, 0, 32, 29, 49, YELLOW, { edge:false, op:.9 });
  [[-29,BLUE],[-14,GREEN],[1,TAN],[16,PINK]].forEach(function(t){ s += I.face('y', 2.1, t[0], 19, t[0]+12, 28, t[1], { edge:false, op:.85 }); });
  return s;
};

A.laptop = function(){
  I.at(80, 70);
  var s = I.begin() + I.shadow(-26, -20, 52, 38);
  s += I.box(-26, -20, 3, 52, 2.5, 34, DEV);
  s += I.face('y', -17.45, -23, 6, 23, 34, SCR);
  s += I.face('y', -17.4, -20, 20, 2, 31, GREEN, { edge:false, op:.85 });
  s += I.face('y', -17.4, 5, 20, 20, 31, BLUE, { edge:false, op:.85 });
  [9, 13].forEach(function(z, i){ s += I.face('y', -17.4, -20, z, i ? 8 : 16, z+1.6, WHITE, { edge:false, op:.4 }); });
  s += I.box(-26, -17.5, 0, 52, 34, 3, DEV);
  var r, c;
  for(r = 0; r < 4; r++) for(c = 0; c < 10; c++)
    s += I.face('z', 3.05, -21+c*4.3, -13+r*4.2, -18+c*4.3, -10+r*4.2, DARK, { edge:false, op:.55 });
  s += I.face('z', 3.05, -8, 5, 8, 12, DARK, { edge:false, op:.18 });
  s += I.cable([[26,6,1.5],[36,6,.5],[40,12,0],[40,28,0]], ORANGE, 2);
  s += I.box(37, 26, 0, 6, 5, 3, ORANGE);
  return s;
};

/* ── the last mile ──────────────────────────────────────── */
A.tower = function(){
  I.at(80, 92);
  var s = I.begin() + I.shadow(-13, -13, 26, 26, 4);
  s += I.box(-13, -13, 0, 26, 26, 3, DEV);
  var H = 66, b = 8, t = 2, legs = [[-1,-1],[1,-1],[1,1],[-1,1]], z;
  function leg(k, zz){ var m = b + (t-b)*(zz-3)/(H-3); return [legs[k][0]*m, legs[k][1]*m, zz]; }
  s += I.line([leg(0,3), leg(0,H)], 'var(--ink-3)', 1.2);
  for(z = 3; z < H-8; z += 11){                                   /* bracing on the two faces we see */
    s += I.line([leg(1,z), leg(2,z+11), leg(3,z), leg(2,z), leg(1,z+11)], 'var(--ink-2)', .7, { op:.8 });
  }
  [1,2,3].forEach(function(k){ s += I.line([leg(k,3), leg(k,H)], 'var(--ink)', 1.5); });
  s += I.box(2.4, -3.5, 48, 2.6, 7, 13, DEV) + I.box(-3.5, 2.4, 48, 7, 2.6, 13, DEV);
  var top = I.P(0, 0, H+3);
  [1,2].forEach(function(k){
    var r = 8 + k*7;
    s += '<path d="M'+I.f(top[0]-r*.55)+' '+I.f(top[1]-r*.85)+'A'+r+' '+r+' 0 0 0 '+I.f(top[0]-r*.55)+' '+I.f(top[1]+r*.85)+
      '" fill="none" stroke="'+GREEN+'" stroke-width="'+(2.2-k*.5)+'" stroke-linecap="round" opacity="'+(1.15-k*.3)+'"/>';
    s += '<path d="M'+I.f(top[0]+r*.55)+' '+I.f(top[1]-r*.85)+'A'+r+' '+r+' 0 0 1 '+I.f(top[0]+r*.55)+' '+I.f(top[1]+r*.85)+
      '" fill="none" stroke="'+GREEN+'" stroke-width="'+(2.2-k*.5)+'" stroke-linecap="round" opacity="'+(1.15-k*.3)+'"/>';
  });
  s += I.dot(0, 0, H+3, 2.6, RED);
  return s;
};

A.mcore = function(){
  I.at(76, 82);
  var s = I.begin() + I.shadow(-22, -16, 44, 32);
  [[0,BLUE],[11,GREEN],[22,TAN]].forEach(function(u){
    s += I.box(-22, -16, u[0], 44, 32, 10, DARK);
    s += I.face('y', 16.05, -18, u[0]+4, 4, u[0]+6.4, u[1]);
    [8, 12, 16].forEach(function(x){ s += I.dot(x, 16, u[0]+5.2, 1.1, GREEN); });
  });
  s += I.cyl(34, -2, 0, 8, 20, BLUE);
  s += I.ring(34, -2, 7, 8, 'var(--iso-line)', .8) + I.ring(34, -2, 14, 8, 'var(--iso-line)', .8);
  s += I.line([[26,-2,10],[22,-2,12]], 'var(--ink-2)', 1.2);
  return s;
};

A.splitter = function(){
  I.at(76, 58);
  var s = I.begin(), i;
  for(i = 0; i < 8; i++){
    var y = -30 + i*8.6;
    s += I.line([[8,0,2],[22,y*.45,0],[52,y,0]], BLUE, 1.3, { op:.9 });
    s += I.dot(52, y, 0, 1.7, BLUE);
  }
  s += I.cable([[-56,0,0],[-24,0,0],[-9,0,3]], ORANGE, 3);
  s += I.shadow(-9, -9, 18, 18, 4);
  s += I.box(-9, -9, 0, 18, 18, 9, GREEN);
  s += I.dot(0, 0, 9, 2.2, YELLOW);
  return s;
};

A.olt = function(){
  I.at(72, 90);
  var s = I.begin() + I.shadow(-17, -14, 34, 28);
  s += I.box(-17, -14, 0, 34, 28, 50, DEV);
  s += I.face('y', 14.05, -14, 3, 14, 47, DARK);
  var i;
  for(i = 0; i < 7; i++){
    var z = 6 + i*6;
    s += I.face('y', 14.1, -12, z, 12, z+4.4, 'color-mix(in srgb,var(--iso-dark),#fff 18%)');
    s += I.dot(-9, 14, z+2.2, 1, i % 3 ? GREEN : RED) + I.dot(-6, 14, z+2.2, 1, YELLOW);
    if(i % 2 === 0) s += I.line([[4,14,z+2.2],[10,14,z+2.2]], ORANGE, .9);
  }
  s += I.cable([[17,4,30],[24,4,8],[30,4,0],[44,4,0]], ORANGE, 2.2);
  s += I.cable([[17,-6,26],[22,-6,6],[28,-6,0],[46,-6,0]], ORANGE, 1.6);
  return s;
};

/* ── Airtel's network ───────────────────────────────────── */
A.bng = function(){
  I.at(70, 78);
  var s = I.begin();
  s += I.face('z', 0, -8, 12, 52, 14, 'var(--ink-3)', { edge:false, op:.35 });          /* stop line */
  s += I.shadow(-30, -7, 14, 14, 4);
  s += I.box(-30, -7, 0, 14, 14, 26, DEV);
  s += I.face('y', 7.05, -27, 18, -19, 21, RED);
  s += I.dot(-23, 0, 26, 2.4, YELLOW);
  var i;
  for(i = 0; i < 7; i++) s += I.box(-16 + i*9, -1.6, 20, 9, 3.2, 3.2, i % 2 ? WHITE : RED, { ht:false });
  s += packet(-4, 22, 0) + packet(10, 24, 0) + I.box(24, 23, 0, 7, 7, 7, ACCENT, { ht:false, op:.4 });
  return s;
};

A.backbone = function(){
  I.at(80, 70);
  var s = I.begin() + I.shadow(-38, -27, 76, 54, 5);
  s += I.box(-38, -27, 0, 76, 54, 4, DEV);
  var pts = [[-26,-15],[-6,-20],[18,-14],[28,8],[4,10],[-20,14]];
  [[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[1,4],[0,4],[2,4]].forEach(function(L){
    s += I.line([[pts[L[0]][0],pts[L[0]][1],4.2],[pts[L[1]][0],pts[L[1]][1],4.2]], BLUE, 1.5, { op:.85 });
  });
  pts.slice().sort(function(a, b){ return (a[0]+a[1]) - (b[0]+b[1]); }).forEach(function(p, i){
    s += I.cyl(p[0], p[1], 4, 4.2, 7, (p[0]+p[1]) % 3 ? RED : GREEN);
  });
  return s;
};

A.resolver = function(){
  I.at(76, 80);
  var s = I.begin() + I.shadow(-24, -16, 48, 32);
  function book(x, y, z, w, d, h, c){
    var o = I.box(x, y, z, w, d, h, c);
    o += I.face('y', y+d+.05, x+1.5, z+1.2, x+w-3, z+h-1.2, 'var(--dev)');
    o += I.face('x', x+w+.05, y+1.5, z+1.2, y+d-3, z+h-1.2, 'color-mix(in srgb,var(--dev),#000 10%)');
    return o;
  }
  s += book(-24, -16, 0, 48, 32, 8, BLUE) + book(-21, -14, 8, 42, 28, 7, RED) + book(-23, -13, 15, 44, 27, 7, GREEN);
  var c = I.P(14, -6, 36);
  s += '<line x1="'+I.f(c[0]+7)+'" y1="'+I.f(c[1]+7)+'" x2="'+I.f(c[0]+17)+'" y2="'+I.f(c[1]+17)+
    '" stroke="var(--iso-dark)" stroke-width="4" stroke-linecap="round"/>';
  s += '<circle cx="'+I.f(c[0])+'" cy="'+I.f(c[1])+'" r="10" fill="color-mix(in srgb,var(--c-blue),#fff 70%)" fill-opacity=".75" '+
    'stroke="var(--iso-dark)" stroke-width="2.6"/>';
  return s;
};

A.dnstree = function(){
  I.at(80, 84);
  var s = I.begin() + I.shadow(-24, -24, 48, 48, 4);
  s += I.box(-24, -24, 0, 48, 48, 3, DEV);
  var root = [0,0,44], tld = [-16,0,16].map(function(k){ return [k,-k,22]; });
  var leaf = [-24,-12,0,12,24].map(function(k){ return [k,-k,3]; });
  var par = [0,0,1,2,2];
  function top(n, h){ return [n[0], n[1], n[2]+h]; }
  tld.forEach(function(n){ s += I.line([root, top(n, 7)], 'var(--ink-2)', 1.1); });
  leaf.forEach(function(n, i){ s += I.line([tld[par[i]], top(n, 6)], 'var(--ink-2)', 1.1); });
  leaf.forEach(function(n){ s += I.box(n[0]-3, n[1]-3, n[2], 6, 6, 6, GREEN); });
  tld.forEach(function(n){ s += I.box(n[0]-3.5, n[1]-3.5, n[2], 7, 7, 7, YELLOW); });
  s += I.box(-4.5, -4.5, root[2], 9, 9, 9, RED);
  return s;
};

/* ── the open internet ──────────────────────────────────── */
A.ggc = function(){
  I.at(80, 80);
  var s = I.begin() + I.shadow(-24, -17, 48, 34);
  s += I.box(-24, -17, 0, 48, 34, 24, DARK);
  s += I.face('z', 24.05, -20, -13, 20, -10, GREEN, { edge:false });
  var r, c;
  for(r = 0; r < 2; r++) for(c = 0; c < 4; c++){
    var x = -20 + c*10.5, z = 4 + r*9.5;
    s += I.face('y', 17.05, x, z, x+8.5, z+7, 'color-mix(in srgb,var(--iso-dark),#fff 22%)');
    s += I.dot(x+6.8, 17, z+1.8, .9, GREEN);
  }
  var b = I.P(0, 0, 46);
  s += '<circle cx="'+I.f(b[0])+'" cy="'+I.f(b[1])+'" r="10" fill="'+GREEN+'" stroke="var(--iso-line)" stroke-width=".8"/>'+
    '<path d="M'+I.f(b[0]-4.4)+' '+I.f(b[1]+.4)+'l3 3 6-6.4" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>';
  s += I.line([[0,0,27],[0,0,34]], GREEN, 1, { dash:'2 2' });
  return s;
};

A.ixp = function(){
  I.at(80, 72);
  var s = I.begin(), i, m = [];
  var cols = [BLUE, PINK, GREEN, RED, TAN, BLUE, PINK, GREEN];
  for(i = 0; i < 8; i++){
    var a = i/8*Math.PI*2 + .2;
    m.push({ x:Math.cos(a)*40, y:Math.sin(a)*40, c:cols[i] });
  }
  m.sort(function(p, q){ return (p.x+p.y) - (q.x+q.y); });
  m.forEach(function(p){ s += I.line([[0,0,1],[p.x,p.y,0]], p.c, 1.6, { op:.85 }); });
  var back = m.filter(function(p){ return p.x+p.y < 0; }), front = m.filter(function(p){ return p.x+p.y >= 0; });
  back.forEach(function(p){ s += I.box(p.x-4.5, p.y-4.5, 0, 9, 9, 8, p.c); });
  s += I.shadow(-11, -11, 22, 22, 4) + I.box(-11, -11, 0, 22, 22, 12, YELLOW);
  [-6,-1,4].forEach(function(x){ s += I.dot(x, 11, 6, 1.1, GREEN); });
  front.forEach(function(p){ s += I.box(p.x-4.5, p.y-4.5, 0, 9, 9, 8, p.c); });
  return s;
};

A.subsea = function(){
  I.at(80, 76);
  var s = I.begin() + I.shadow(-32, -20, 64, 40, 5);
  var W = 'color-mix(in srgb,var(--c-blue),#fff 30%)', bed = 11, H = 32;
  /* a cut-away block of ocean: seabed below, water above, a cable lying on the bed */
  s += I.face('y', 20, -32, 0, 32, bed, TAN, { edge:true });
  s += I.face('y', 20, -32, bed, 32, H, W, { edge:true });
  s += I.face('x', 32, -20, 0, 20, bed, I.lit(TAN, -20), { edge:true });
  s += I.face('x', 32, -20, bed, 20, H, I.lit(W, -18), { edge:true });
  s += I.halftone([[32,-20,0],[32,20,0],[32,20,bed],[32,-20,bed]], .22);
  s += I.face('z', H, -32, -20, 32, 20, I.lit(W, 30), { edge:true });
  [-10, 0, 10].forEach(function(y, i){
    var pts = [], x;
    for(x = -30; x <= 30; x += 3) pts.push([x, y + Math.sin(x/5 + i)*1.6, H+.1]);
    s += I.line(pts, '#fff', .9, { op:.7 });
  });
  var e = I.P(2, 20, bed+2.4);
  s += '<ellipse cx="'+I.f(e[0])+'" cy="'+I.f(e[1])+'" rx="3.6" ry="3.6" fill="var(--iso-dark)"/>'+
    '<circle cx="'+I.f(e[0])+'" cy="'+I.f(e[1])+'" r="1.6" fill="'+ORANGE+'"/>';
  s += I.cable([[2,22,bed],[2,30,4],[2,44,0]], ORANGE, 2.6);
  [[-22,20,4],[-12,20,7],[20,20,5]].forEach(function(p){ s += I.dot(p[0], p[1], p[2], .9, I.lit(TAN, -40)); });
  return s;
};

A.gdc = function(){
  I.at(78, 84);
  var s = I.begin() + I.shadow(-30, -18, 64, 34, 5);
  function windows(x0, y0, w, d, h, rows){
    var o = '', r, c;
    for(r = 0; r < rows; r++){
      var z = 5 + r*7.5;
      for(c = 0; c < Math.floor((w-4)/7); c++)
        o += I.face('y', y0+d+.05, x0+3+c*7, z, x0+7.5+c*7, z+4.2, (r+c) % 3 ? BLUE : YELLOW, { edge:false, op:.85 });
      for(c = 0; c < Math.floor((d-4)/7); c++)
        o += I.face('x', x0+w+.05, y0+3+c*7, z, y0+7.5+c*7, z+4.2, (r+c) % 4 ? 'color-mix(in srgb,var(--c-blue),#000 25%)' : YELLOW, { edge:false, op:.8 });
    }
    return o;
  }
  s += I.box(-30, -18, 0, 34, 28, 38, DEV) + windows(-30, -18, 34, 28, 38, 4);
  s += I.cyl(-22, -10, 38, 3.4, 2.6, DARK) + I.cyl(-12, -10, 38, 3.4, 2.6, DARK);
  s += I.line([[-4,4,38],[-4,4,54]], 'var(--ink)', 1.1);
  var fl = I.P(-4, 4, 54);
  s += '<path d="M'+I.f(fl[0])+' '+I.f(fl[1])+'l11 3 -11 3z" fill="'+RED+'"/>';
  s += I.box(8, -10, 0, 26, 26, 24, DEV) + windows(8, -10, 26, 26, 24, 2);
  return s;
};

A.origin = function(){
  I.at(80, 92);
  var s = I.begin(), id = 'aog'+(++UID);
  s += I.disc(0, 0, 0, 16, 'var(--ink)', .08);
  s += I.cyl(0, 0, 0, 9, 3, DARK);
  s += I.line([[0,0,3],[0,0,14]], 'var(--iso-dark)', 2.4);
  var c = I.P(0, 0, 44), R = 27;
  s += '<defs><radialGradient id="'+id+'" cx=".35" cy=".3" r=".8">'+
    '<stop offset="0" stop-color="color-mix(in srgb,var(--c-blue),#fff 45%)"/><stop offset=".6" stop-color="var(--c-blue)"/>'+
    '<stop offset="1" stop-color="color-mix(in srgb,var(--c-blue),#000 35%)"/></radialGradient>'+
    '<clipPath id="'+id+'c"><circle cx="'+I.f(c[0])+'" cy="'+I.f(c[1])+'" r="'+R+'"/></clipPath></defs>';
  s += '<circle cx="'+I.f(c[0])+'" cy="'+I.f(c[1])+'" r="'+R+'" fill="url(#'+id+')" stroke="var(--iso-line)" stroke-width=".8"/>';
  s += '<g clip-path="url(#'+id+'c)" fill="var(--c-green)" opacity=".92" transform="translate('+I.f(c[0])+' '+I.f(c[1])+')">'+
    '<path d="M-22 -14c6-6 14-8 19-4s2 9 7 10 4 9-2 12-11 0-14 6-9 4-12-2-4-16 2-22z"/>'+
    '<path d="M8 -22c6 0 13 4 15 10s-4 6-8 4-9-2-10-7 0-7 3-7z"/>'+
    '<path d="M10 8c5-2 11 0 12 5s-4 10-9 10-7-5-6-9 1-5 3-6z"/></g>';
  s += '<ellipse cx="'+I.f(c[0])+'" cy="'+I.f(c[1])+'" rx="'+R+'" ry="8" fill="none" stroke="#fff" stroke-width=".7" opacity=".45"/>';
  s += '<ellipse cx="'+I.f(c[0])+'" cy="'+I.f(c[1]+2)+'" rx="'+(R+12)+'" ry="11" fill="none" stroke="'+ACCENT+
    '" stroke-width="1.2" stroke-dasharray="3 3" transform="rotate(-14 '+I.f(c[0])+' '+I.f(c[1])+')"/>';
  s += '<circle cx="'+I.f(c[0]+R+8)+'" cy="'+I.f(c[1]-6)+'" r="3.2" fill="'+ACCENT+'"/>';
  return s;
};

/* ── for the reading pages ──────────────────────────────── */
/* the five layers as slabs, bottom (physical) to top (application); hi pulls one out */
var LZ = ['access','home','access','core','net'];
A.stack = function(hi){
  I.at(hi ? 74 : 80, 84);
  var s = I.begin() + I.shadow(-26, -20, 52, 40, 5), i;
  for(i = 0; i < 5; i++){
    var on = !hi || hi === i+1, dx = hi === i+1 ? 14 : 0;
    s += I.box(-26 + dx, -20, i*9, 52, 40, 6.5, on ? 'var(--'+LZ[i]+')' : DEV, { op: on ? 1 : .9 });
  }
  if(!hi) s += packet(-4, -4, 45.5, 8);
  return s;
};
/* swap the bottom slab: copper out, fibre in, nothing above notices */
A.swap = function(){
  I.at(54, 76);
  var s = I.begin() + I.shadow(-26, -20, 52, 40, 5), i;
  s += I.box(30, -20, 0, 52, 40, 6.5, TAN, { op:.45 });
  s += I.line([[56,0,10],[56,0,16],[34,0,18]], 'var(--ink-3)', 1, { dash:'2 2' });
  for(i = 0; i < 5; i++) s += I.box(-26, -20, i*9 + (i ? 4 : 0), 52, 40, 6.5, i ? 'var(--'+LZ[i]+')' : BLUE);
  return s;
};
A.lock = function(){
  I.at(80, 86);
  var s = I.begin() + I.shadow(-18, -9, 36, 18, 5);
  var a = I.P(-10, 0, 26), b = I.P(10, 0, 26);
  s += '<path d="M'+I.f(a[0])+' '+I.f(a[1])+'V'+I.f(a[1]-14)+'a'+I.f((b[0]-a[0])/2)+' '+I.f((b[0]-a[0])/2)+' 0 0 1 '+I.f(b[0]-a[0])+' 0V'+I.f(b[1])+
    '" fill="none" stroke="var(--iso-dark)" stroke-width="5" stroke-linecap="round"/>';
  s += I.box(-18, -9, 0, 36, 18, 30, YELLOW);
  s += I.dot(0, 9, 17, 3, 'var(--iso-dark)') + I.face('y', 9.05, -1, 8, 1, 15, 'var(--iso-dark)');
  return s;
};

window.ART = A;
})();
