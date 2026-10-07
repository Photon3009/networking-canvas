/* bigscenes2.js — full-scale scenes for the carrier core and the open internet. */
(function(){
'use strict';
var S = window.SK, B = window.BIGSCENES, I = window.ISO, N = 40000;
function sd(){ return (N += 19); }
var DEFS = '';
var DEV = 'var(--dev)', DARK = 'var(--iso-dark)', SCR = 'var(--scr)', ACCENT = 'var(--accent)';
var RED = 'var(--c-red)', GREEN = 'var(--c-green)', YELLOW = 'var(--c-yellow)', BLUE = 'var(--c-blue)';
var ORANGE = 'var(--c-orange)', TAN = 'var(--c-tan)', PINK = 'var(--c-pink)';
var UNIT = 'color-mix(in srgb,var(--iso-dark),#fff 20%)';
var LAND = 'color-mix(in srgb,var(--c-green) 16%,var(--paper))';
function f(n){ return Math.round(n*10)/10; }
function bx(x,y,w,h){ return {x:x,y:y,w:w,h:h}; }

/* a clean tinted card: solid fill, a light halftone, a thin coloured edge */
function panel(x, y, w, h, o){
  o = o || {};
  var r = o.r === undefined ? 10 : o.r, d = S.d(S.rrect(x, y, w, h, r), true, 0, 1), c = S.clip(d);
  DEFS += c.def;
  return '<path d="'+d+'" fill="'+(o.fill || 'var(--paper)')+'"'+(o.fillOp !== undefined ? ' fill-opacity="'+o.fillOp+'"' : '')+'/>'+
    (o.ht === false ? '' : S.hatch(c.id, bx(x, y, w, h), 30, o.gap || 4.2, o.shade || 'var(--ink)', .5, o.op === undefined ? .07 : o.op, sd()))+
    '<path d="'+d+'" fill="none" stroke="'+(o.edge || 'var(--border-2)')+'" stroke-width="'+(o.w || 1.2)+'"'+
    (o.dash ? ' stroke-dasharray="'+o.dash+'"' : '')+'/>';
}
function T(x, y, t, cls, a, extra){
  return '<text x="'+f(x)+'" y="'+f(y)+'" class="'+(cls || 'bg-t')+'" text-anchor="'+(a || 'middle')+'"'+(extra || '')+'>'+t+'</text>';
}
/* a halo so labels stay legible where they sit on artwork */
function halo(c){ return ' style="paint-order:stroke;stroke:'+(c || 'var(--paper)')+';stroke-width:4px;stroke-linejoin:round"'; }
function lines(x, y, arr, cls, a, lh){
  return arr.map(function(t, i){ return T(x, y + i*(lh || 17), t, cls, a); }).join('');
}
function path(pts, o){
  o = o || {};
  return '<path d="'+S.ds(pts, false, 0, 1)+'" fill="none" stroke="'+(o.c || 'var(--ink)')+'" stroke-width="'+(o.w || 2.4)+
    '" opacity="'+(o.op === undefined ? .85 : o.op)+'" stroke-linecap="round" stroke-linejoin="round"'+
    (o.dash ? ' stroke-dasharray="'+o.dash+'"' : '')+(o.cls ? ' class="'+o.cls+'"' : '')+'/>';
}
/* a cable: a dark casing under a coloured core */
function cable(pts, c, w, op){
  return path(pts, { c:'var(--iso-line)', w:(w || 3) + 2, op:op === undefined ? 1 : op }) + path(pts, { c:c, w:w || 3, op:1 });
}
function flow(pts, c, dur, dly, r){
  return '<circle class="mv" r="'+(r || 6)+'" cx="0" cy="0" fill="'+c+'" stroke="var(--paper)" stroke-width="2" '+
    'style="offset-path:path(\''+S.ds(pts, false, 0, 1)+'\');--dur:'+dur+'s;--dly:'+(dly || 0)+'s"/>';
}
function title(t, sub){
  return T(30, 42, t, 'bg-h', 'start') + (sub ? T(30, 62, sub, 'bg-t', 'start') : '');
}
function stage(name, inner, aria, cap){
  var fig = '<figure class="sc zoom" data-title="'+name+'"><span class="zhint">tap to enlarge</span>'+
    '<div class="figscroll"><svg viewBox="0 0 820 470" role="img" style="min-width:620px" aria-label="'+aria+'">'+
    '<defs>'+DEFS+'</defs>'+inner+'</svg></div><figcaption>'+cap+'</figcaption></figure>';
  DEFS = ''; return fig;
}

/* ── geography ────────────────────────────────────────────
   India's outline in real longitude/latitude, projected into a 0-100 × 0-120 box:
   x = (lon − 68.13) × 3.495,  y = (36.93 − lat) × 4.034 */
var IND_LL = [[73.9,34.4],[74.7,35.0],[75.8,35.4],[76.8,35.6],[77.8,35.4],[78.4,34.6],[79.0,34.2],[78.8,33.4],
  [79.4,32.6],[78.8,31.9],[79.0,31.2],[79.9,30.8],[80.9,30.2],[80.3,29.4],[80.1,28.8],[81.0,28.4],[82.0,27.8],
  [83.3,27.4],[84.1,27.4],[85.0,26.9],[86.0,26.6],[87.0,26.4],[88.1,26.5],[88.0,27.2],[88.1,27.9],[88.8,28.1],
  [88.9,27.3],[88.8,27.0],[89.6,26.8],[90.6,26.8],[91.7,26.8],[92.1,26.9],[91.6,27.5],[91.7,27.8],[92.6,27.9],
  [93.8,28.7],[94.6,29.3],[95.4,29.1],[96.3,29.4],[96.6,28.4],[97.3,27.9],[96.9,27.3],[96.0,27.2],[95.2,26.6],
  [95.2,26.0],[94.7,25.4],[94.6,24.7],[94.2,24.0],[93.4,24.0],[93.4,23.0],[93.1,22.2],[92.7,22.0],[92.4,22.8],
  [92.3,23.6],[91.9,23.6],[91.6,23.0],[91.2,23.5],[91.4,24.1],[91.9,24.2],[92.2,24.5],[92.4,24.9],[92.0,25.2],
  [91.0,25.2],[90.0,25.2],[89.85,25.3],[89.8,25.9],[89.1,26.1],[88.6,26.4],[88.45,26.5],[88.2,26.1],[88.1,25.8],
  [88.6,25.2],[88.1,24.9],[88.7,24.3],[88.8,23.6],[88.95,22.8],[89.05,22.1],[89.1,21.7],[88.2,21.6],[87.5,21.6],
  [86.9,21.0],[86.6,20.3],[85.8,19.8],[85.1,19.4],[84.2,18.4],[83.3,17.7],[82.3,16.7],[81.3,16.2],[80.3,15.6],
  [80.1,14.0],[80.3,13.0],[79.9,12.0],[79.8,10.9],[79.8,10.3],[79.2,10.3],[78.9,9.4],[78.1,8.8],[77.5,8.1],
  [76.6,8.9],[76.2,10.0],[75.8,11.3],[75.2,12.4],[74.8,13.0],[74.4,14.2],[73.9,15.3],[73.4,16.6],[73.0,18.0],
  [72.85,18.9],[72.8,20.2],[72.9,21.1],[72.6,22.2],[72.2,21.6],[71.5,20.9],[70.4,20.8],[69.5,21.7],[69.0,22.3],
  [69.8,22.4],[70.4,22.9],[69.6,22.9],[68.9,22.9],[68.5,23.3],[68.2,23.6],[68.7,24.2],[69.6,24.3],[70.6,24.2],
  [71.1,24.6],[70.6,25.7],[70.1,26.5],[69.8,27.0],[70.4,27.8],[71.9,27.9],[72.8,28.9],[73.4,29.9],[74.0,30.4],
  [74.6,31.0],[74.6,31.9],[75.3,32.3],[74.6,32.7],[74.0,33.2],[73.9,34.0]];
var LKA_LL = [[80.1,9.8],[80.8,9.3],[81.3,8.5],[81.8,7.5],[81.9,6.9],[81.6,6.4],[81.1,6.1],[80.6,5.95],[80.1,6.2],
  [79.85,7.0],[79.8,8.0],[80.0,9.0]];
var CITY_LL = { del:[77.21,28.61], mum:[72.88,19.08], kol:[88.36,22.57], che:[80.27,13.08],
                ben:[77.59,12.97], hyd:[78.49,17.39], ahm:[72.57,23.02] };
function box01(lon, lat){ return [(lon - 68.13)*3.495, (36.93 - lat)*4.034]; }
function P(o, ll){ var b = box01(ll[0], ll[1]); return [o.x + b[0]*o.k, o.y + b[1]*o.k]; }
function C(o, n){ return P(o, CITY_LL[n]); }
function poly(pts){ return 'M'+pts.map(function(p){ return f(p[0])+' '+f(p[1]); }).join('L')+'Z'; }
function india(o){
  var d = poly(IND_LL.map(function(p){ return P(o, p); })), cl = S.clip(d), lk = poly(LKA_LL.map(function(p){ return P(o, p); }));
  DEFS += cl.def;
  var b = bx(o.x - 4, o.y, 108*o.k, 120*o.k);
  return '<path d="'+d+'" fill="'+LAND+'"/><path d="'+lk+'" fill="'+LAND+'"/>'+
    S.hatch(cl.id, b, 30, 4.4, GREEN, .5, .16, sd())+
    '<path d="'+lk+'" fill="none" stroke="var(--ink-3)" stroke-width="1.1" stroke-linejoin="round"/>'+
    '<path d="'+d+'" fill="none" stroke="var(--ink-3)" stroke-width="1.3" stroke-linejoin="round"/>';
}
/* a city: a small isometric router standing on the map, or a plain dot */
function city(x, y, n, hot, lb){
  lb = lb || {};
  I.at(x, y);
  var c = hot ? RED : DEV;
  var s = I.disc(0, 0, 0, 10, 'var(--ink)', .1) + I.cyl(0, 0, 0, 5.5, 6, c);
  if(n) s += T(x + (lb.dx || 0), y + (lb.dy === undefined ? -14 : lb.dy), n, 'bg-t', lb.a, halo());
  return s;
}

/* ── the turnstile ──────────────────────────────────────── */
function house(cx, cy, roof){
  I.at(cx, cy);
  var w = 22, d = 18, h = 13, r = 10, x = -w/2, y = -d/2;
  var s = I.shadow(x, y, w, d, 3) + I.box(x, y, 0, w, d, h, DEV);
  s += I.face('y', y+d+.05, -3, 0, 3, 8, DARK);
  s += I.face('x', x+w+.05, -5, 4, 0, 9, SCR);
  s += I.poly([[x-1,y-1,h],[x+w+1,y-1,h],[x+w+1,0,h+r],[x-1,0,h+r]], I.lit(roof, -18));
  s += I.poly([[x+w,y,h],[x+w,y+d,h],[x+w,0,h+r]], I.lit(DEV, -20));
  s += I.poly([[x-1,y+d+1,h],[x+w+1,y+d+1,h],[x+w+1,0,h+r],[x-1,0,h+r]], roof);
  return s;
}
B.bng = (function(){
  var s = I.begin() + title('One public address, hundreds of households behind it');
  var homes = [['a neighbour', '100.64.3.21'], ['your home', '100.64.12.7'], ['a neighbour', '100.64.9.140'], ['a neighbour', '100.64.31.6']];
  var ys = [124, 204, 284, 364];
  ys.forEach(function(y, i){
    var me = i === 1;
    s += panel(30, y-32, 176, 64, { fill: me ? 'var(--home-bg)' : 'var(--paper-2)', edge: me ? 'var(--home)' : undefined, shade: me ? 'var(--home)' : undefined, op: me ? .1 : .05 });
    s += house(62, y+11, me ? GREEN : TAN);
    s += T(92, y-3, homes[i][0], 'bg-l', 'start') + T(92, y+15, homes[i][1], 'bg-t' + (me ? ' ok' : ''), 'start');
    var p = [[206,y],[248,y],[296,214 + i*12]];
    s += path(p, { c:'var(--home)', w:2, op:.45 }) + flow(p, GREEN, 3.4, i*0.3, 5);
  });
  /* the carrier gateway, drawn as a chassis */
  s += panel(296, 92, 220, 312, { fill:'var(--core-bg)', edge:'var(--core)', shade:'var(--core)', op:.1 });
  I.at(406, 222);
  s += I.shadow(-40, -26, 80, 52, 6) + I.box(-40, -26, 0, 80, 52, 74, DEV);
  var u;
  for(u = 0; u < 6; u++){
    var z = 7 + u*10.5;
    s += I.face('y', 26.05, -36, z, 30, z+7.4, UNIT);
    s += I.dot(-31, 26, z+3.7, 1.4, u === 2 ? RED : GREEN) + I.dot(-26, 26, z+3.7, 1.4, YELLOW);
    if(u % 2 === 0) s += I.face('y', 26.1, 2, z+2, 26, z+5.4, ORANGE, { edge:false, op:.85 });
  }
  [-18,-8,2,12].forEach(function(y){ s += I.face('x', 40.05, y, 50, y+6, 68, DARK, { edge:false, op:.55 }); });
  s += I.face('z', 74.05, -32, -20, 32, -14, ACCENT, { edge:false, op:.85 });
  s += T(406, 290, 'BNG + CGNAT', 'bg-l') + T(406, 308, 'the turnstile', 'bg-t');
  s += lines(406, 334, ['checks your plan', 'caps your speed'], 'bg-t');
  s += T(406, 368, 'rewrites 100.64.x.x', 'bg-t hot') + T(406, 385, 'to one public IP', 'bg-t hot');
  var out = [[516,214],[600,214]];
  s += cable(out, 'var(--core)', 3) + flow(out, GREEN, 3, 1.2, 6);
  s += panel(600, 150, 190, 128, { fill:'var(--net-bg)', edge:'var(--net)', shade:'var(--net)', op:.1 });
  s += T(695, 182, 'The internet', 'bg-l') + lines(695, 206, ['sees one address', 'for all of you'], 'bg-t');
  s += T(695, 254, '122.161.48.7', 'bg-t hot');
  var back = [[790,334],[620,334],[528,334]];
  s += path(back, { c:RED, w:2.6, dash:'8 6' });
  s += '<circle class="mv bounce" r="6" cx="0" cy="0" fill="'+RED+'" stroke="var(--paper)" stroke-width="2" style="offset-path:path(\'' +
    S.ds(back, false, 0, 1) + '\');--dur:4s;--dly:0.4s"/>';
  s += '<g stroke="'+RED+'" stroke-width="4" stroke-linecap="round"><line x1="520" y1="324" x2="538" y2="344"/><line x1="538" y1="324" x2="520" y2="344"/></g>';
  s += T(660, 362, 'unsolicited inbound', 'bg-t hot') + T(660, 379, 'stops here', 'bg-t hot');
  s += T(30, 438, 'you can dial out — nobody can dial in', 'bg-t', 'start');
  return stage('The turnstile', s,
    'Several households share one public address through the carrier gateway; outbound traffic passes, unsolicited inbound traffic is stopped at the gateway.',
    '<b>You are sharing a public address with strangers.</b> There are not enough IPv4 addresses in the world for every Indian broadband line, so the gateway translates hundreds of customers onto one. Outbound is fine. Inbound has nowhere to be delivered — which is the whole reason your CCTV app needs a cloud relay.');
})();

/* ── the national backbone ──────────────────────────────── */
B.backbone = (function(){
  var o = { x:44, y:62, k:3.2 };
  var s = I.begin() + title('AS9498 — one company’s share of the internet') + india(o);
  var C_ = {}; Object.keys(CITY_LL).forEach(function(k){ C_[k] = C(o, k); });
  [['del','ahm'],['del','kol'],['del','mum'],['ahm','mum'],['mum','hyd'],['hyd','kol'],
   ['hyd','ben'],['ben','che'],['mum','ben'],['kol','che'],['che','hyd']].forEach(function(L){
    var a = C_[L[0]], b = C_[L[1]];
    s += path([a, [(a[0]+b[0])/2 + 5, (a[1]+b[1])/2 - 6], b], { c:'var(--core)', w:2, op:.55 });
  });
  var route = [C_.del, [(C_.del[0]+C_.mum[0])/2 - 16, (C_.del[1]+C_.mum[1])/2], C_.mum];
  s += path(route, { c:RED, w:4, op:.95 }) + flow(route, RED, 3.2, 0, 6);
  var nm = { del:'Delhi', mum:'Mumbai', kol:'Kolkata', che:'Chennai', ben:'Bengaluru', hyd:'Hyderabad', ahm:'Ahmedabad' };
  var LB = { del:{dx:14, a:'start', dy:-6}, mum:{dx:-12, a:'end', dy:4}, kol:{dx:12, a:'start', dy:-8},
             che:{dx:12, a:'start', dy:4}, ben:{dx:-12, a:'end', dy:8}, hyd:{dx:12, a:'start', dy:-6}, ahm:{dx:-12, a:'end', dy:-4} };
  Object.keys(C_).sort(function(a, b){ return C_[a][1] - C_[b][1]; }).forEach(function(k){
    s += city(C_[k][0], C_[k][1], nm[k], k === 'mum' || k === 'del', LB[k]);
  });
  s += panel(430, 92, 360, 142, { fill:'var(--paper-2)' });
  s += T(452, 122, 'What a hop costs', 'bg-l', 'start');
  [['Delhi → Mumbai', '~30 ms', 70], ['Mumbai → Chennai', '~35 ms', 82], ['inside one city', '<8 ms', 18]].forEach(function(r, i){
    var y = 154 + i*26;
    s += T(452, y, r[0], 'bg-t', 'start') + T(768, y, r[1], 'bg-t ok', 'end');
    s += '<rect x="610" y="'+(y-7)+'" width="100" height="5" rx="2.5" fill="var(--ink)" opacity=".08"/>'+
         '<rect x="610" y="'+(y-7)+'" width="'+r[2]+'" height="5" rx="2.5" fill="'+GREEN+'" opacity=".75"/>';
  });
  s += panel(430, 256, 360, 158, { fill:'var(--core-bg)', edge:'var(--core)', shade:'var(--core)', op:.1 });
  s += T(452, 286, 'No router knows the route', 'bg-l', 'start');
  s += lines(452, 312, ['each one reads the address, matches', 'the longest prefix, picks a port', 'and forgets you'], 'bg-t', 'start');
  s += T(452, 392, 'OSPF inside · BGP at the edge', 'bg-t hot', 'start');
  s += T(30, 456, 'schematic — city positions are real, the routes are illustrative', 'bg-s', 'start');
  return stage('Airtel, drawn as a country', s,
    'A map of India with the major cities joined by backbone links, one route from Delhi to Mumbai highlighted, and a panel of typical latencies.',
    '<b>The core is a small number of very large routers and a great deal of fibre.</b> Nothing along this path holds the whole route — each router only knows the next hop. That is why the middle of the internet can be so fast, and why every guarantee you enjoy had to be invented at the two ends.');
})();

/* ── the resolver's memory ──────────────────────────────── */
B.resolver = (function(){
  var s = I.begin() + title('A machine whose entire job is remembering, briefly');
  s += panel(30, 82, 380, 338, { fill:'var(--core-bg)', edge:'var(--core)', shade:'var(--core)', op:.08 });
  s += T(52, 112, 'Airtel’s resolver — its cache', 'bg-l', 'start');
  s += T(52, 130, 'name · answer', 'bg-s', 'start') + T(388, 130, 'time left', 'bg-s', 'end');
  var rows = [['youtube.com', '142.250.195.78', '271 s', 'ok', .9], ['wa.me', '157.240.16.60', '48 s', 'ok', .16],
              ['airtel.in', '125.19.41.10', '3 s', 'hot', .02], ['some-blog.dev', '— expired —', '0 s', 'hot', 0]];
  rows.forEach(function(r, i){
    var y = 144 + i*66;
    s += panel(48, y, 344, 54, { fill:'var(--paper)', ht:false, r:7 });
    s += T(64, y+23, r[0], 'bg-l', 'start') + T(64, y+41, r[1], 'bg-t' + (r[4] ? '' : ' hot'), 'start');
    s += T(376, y+24, r[2], 'bg-t ' + r[3], 'end');
    s += '<rect x="296" y="'+(y+33)+'" width="80" height="5" rx="2.5" fill="var(--ink)" opacity=".1"/>';
    if(r[4]) s += '<rect x="296" y="'+(y+33)+'" width="'+Math.max(3, 80*r[4])+'" height="5" rx="2.5" fill="var(--c-'+(r[3] === 'ok' ? 'green' : 'red')+')"/>';
  });
  s += T(220, 446, 'every answer carries a countdown — the TTL', 'bg-t');
  /* you, and the hit */
  s += panel(560, 82, 230, 82, { fill:'var(--home-bg)', edge:'var(--home)', shade:'var(--home)', op:.1 });
  s += T(675, 116, 'You', 'bg-l') + T(675, 138, 'and a million others', 'bg-t');
  var hit = [[560,124],[480,124],[410,176]];
  s += path(hit, { c:GREEN, w:3 }) + flow(hit, GREEN, 1.4, 0, 6);
  s += T(484, 112, 'hit · under 1 ms', 'bg-t ok');
  /* the miss */
  var miss = [[410,374],[490,374],[560,316]];
  s += path(miss, { c:RED, w:2.4, dash:'7 6' }) + flow(miss, YELLOW, 4, 0.6, 6);
  s += T(484, 396, 'miss · ~100 ms', 'bg-t hot');
  s += panel(560, 236, 230, 112, { fill:'var(--net-bg)', edge:'var(--net)', shade:'var(--net)', op:.1 });
  s += T(675, 268, 'The wider tree', 'bg-l') + T(675, 292, 'root → .com → ns1', 'bg-t');
  s += T(675, 322, 'asked only on a miss', 'bg-t hot');
  s += T(675, 402, 'this list is also where a', 'bg-t') + T(675, 419, 'blocked site is blocked, in India', 'bg-t hot');
  return stage('What the resolver remembers', s,
    'The resolver cache as a list of names with counting-down time-to-live values; a cache hit answers instantly while an expired entry forces a walk up the DNS tree.',
    '<b>DNS survives on forgetfulness with a timer.</b> Only the first person to ask after a TTL expires pays the full cost; everyone else is answered from this list. The same list is where an ISP-level site block is actually implemented — which is why switching resolver sometimes makes a site reappear.');
})();

/* ── the name tree ──────────────────────────────────────── */
B.dnstree = (function(){
  var s = I.begin() + title('Nobody holds the whole phone book — by design');
  var lv = [['the root', 124, RED, '13 addresses, 1,900+ machines', 'replies: ask .com'],
            ['.com', 244, YELLOW, 'one of ~1,500 top-level zones', 'replies: ask ns1.google.com'],
            ['google.com', 364, GREEN, 'run by Google itself', 'answers: 142.250.195.78']];
  var X0 = 330, W = 250, cx = X0 + W/2;
  /* tree edges */
  s += path([[cx,160],[cx,208]], { c:'var(--ink-3)', w:2, op:.8 }) + path([[cx,280],[cx,328]], { c:'var(--ink-3)', w:2, op:.8 });
  s += path([[X0+W,124],[690,124],[690,214]], { c:'var(--ink-3)', w:1.4, op:.5, dash:'4 5' });
  s += path([[X0+W,244],[690,244],[690,334]], { c:'var(--ink-3)', w:1.4, op:.5, dash:'4 5' });
  s += panel(610, 214, 180, 60, { fill:'var(--paper-2)', ht:false });
  s += T(700, 249, '.in  .org  .net …', 'bg-t');
  s += panel(610, 334, 180, 60, { fill:'var(--paper-2)', ht:false });
  s += T(700, 369, 'millions of others', 'bg-t');
  /* the resolver, asking each level in turn */
  I.at(110, 262);
  s += I.shadow(-26, -20, 52, 40, 5) + I.box(-26, -20, 0, 52, 40, 44, DEV);
  [0,1,2].forEach(function(u){
    var z = 7 + u*12;
    s += I.face('y', 20.05, -22, z, 18, z+8, UNIT) + I.dot(-17, 20, z+4, 1.4, GREEN);
  });
  s += I.face('z', 44.05, -20, -14, 20, -10, 'var(--core)', { edge:false, op:.8 });
  s += T(110, 318, 'your resolver', 'bg-l') + T(110, 336, 'asks each level', 'bg-t') + T(110, 352, 'in turn', 'bg-t');
  lv.forEach(function(l, i){
    var q = [[154, 236], [250, l[1]], [X0, l[1]]];
    s += path(q, { c:l[2], w:2, op:.6, dash:'5 5' });
    s += flow(q, l[2], 3.6, i*1.2, 5);
  });
  lv.forEach(function(l, i){
    s += panel(X0, l[1]-36, W, 72, { fill:'var(--paper)', edge:l[2], shade:l[2], op:.12, w:1.6 });
    s += T(cx, l[1]-12, l[0], 'bg-l') + T(cx, l[1]+6, l[3], 'bg-t');
    s += T(cx, l[1]+24, l[4], 'bg-t ' + (i === 2 ? 'ok' : 'hot'));
  });
  s += T(410, 446, 'each level only says “ask them next” — no single failure can take DNS down', 'bg-t');
  return stage('The name tree', s,
    'The DNS hierarchy: a resolver asks the root, which refers it to the dot-com servers, which refer it to Google’s own authoritative servers.',
    '<b>Read <code>www.youtube.com</code> backwards and that is the order it is resolved in.</b> There is even an invisible dot after .com — the root. Splitting the database this way means no organisation has to know every name on earth, and no one outage can take the whole system with it.');
})();

/* ── the cache next door ────────────────────────────────── */
B.ggc = (function(){
  var o = { x:206, y:58, k:3.0 };
  var s = I.begin() + title('Your video was here before you asked for it') + india(o);
  var mum = C(o, 'mum'), you = C(o, 'del');
  /* the far one: out of the country to Oregon */
  var far = [you, [420,96], [540,104], [600,140]];
  s += path(far, { c:RED, w:2.6, dash:'8 6' });
  s += panel(600, 84, 190, 124, { fill:'var(--net-bg)', edge:'var(--net)', shade:'var(--net)', op:.1 });
  s += T(695, 114, 'Oregon, USA', 'bg-l') + lines(695, 138, ['where it lives when', 'nobody nearby asked'], 'bg-t');
  s += T(695, 190, '200–250 ms', 'bg-t hot');
  var near = [you, [(you[0]+mum[0])/2 - 18, (you[1]+mum[1])/2], mum];
  s += path(near, { c:GREEN, w:3.6, op:.9 });
  s += flow(near, GREEN, 1.3, 0, 6) + flow(far, RED, 5.6, 0, 6);
  s += city(you[0], you[1], 'you', false, { dx:-12, a:'end', dy:-2 });
  /* the cache: a Google rack standing in Mumbai */
  s += '<circle cx="'+f(mum[0])+'" cy="'+f(mum[1])+'" r="22" fill="'+GREEN+'" opacity=".22" class="pulse"/>';
  I.at(mum[0], mum[1]);
  s += I.shadow(-8, -7, 16, 14, 3) + I.box(-8, -7, 0, 16, 14, 26, DARK);
  [0,1,2].forEach(function(u){ s += I.face('y', 7.05, -6, 4+u*7, 6, 8.5+u*7, UNIT) + I.dot(3.5, 7, 6.2+u*7, .9, GREEN); });
  s += I.face('z', 26.05, -6, -5, 6, -2, GREEN, { edge:false });
  s += path([[mum[0]-10, mum[1]+8], [190, 312]], { c:'var(--ink-3)', w:1, op:.7 });
  s += panel(30, 300, 170, 110, { fill:'var(--home-bg)', edge:'var(--home)', shade:'var(--home)', op:.1 });
  s += T(48, 328, 'Mumbai', 'bg-l', 'start') + lines(48, 350, ['a Google server,', 'racked inside Airtel'], 'bg-t', 'start');
  s += T(48, 394, '5–15 ms', 'bg-t ok', 'start');
  /* the two round trips side by side */
  s += panel(600, 240, 190, 140, { fill:'var(--paper-2)' });
  s += T(618, 268, 'Round trip', 'bg-l', 'start');
  s += T(618, 294, 'Mumbai cache', 'bg-t', 'start') + T(772, 294, '10 ms', 'bg-t ok', 'end');
  s += '<rect x="618" y="302" width="154" height="7" rx="3.5" fill="var(--ink)" opacity=".08"/><rect x="618" y="302" width="7" height="7" rx="3.5" fill="'+GREEN+'"/>';
  s += T(618, 336, 'Oregon', 'bg-t', 'start') + T(772, 336, '230 ms', 'bg-t hot', 'end');
  s += '<rect x="618" y="344" width="154" height="7" rx="3.5" fill="'+RED+'"/>';
  s += T(410, 452, 'both dots leave at the same moment — watch how long the red one takes', 'bg-t');
  return stage('The cache next door', s,
    'Two requests leave at once: a short green one to a Google cache inside Airtel in Mumbai, and a long red one across the world to Oregon, arriving far later.',
    '<b>Most of what you watch never leaves India, or even Airtel.</b> Google racks its own machines inside consumer ISPs and pre-loads them with what your city watches. It is also why a trending video starts instantly while an obscure 2009 upload buffers — same plan, same fibre, different geography.');
})();

/* ── where the networks meet ────────────────────────────── */
function building(x, y, w, d, h, rows, c){
  var o = I.box(x, y, 0, w, d, h, c || DEV), r, k;
  for(r = 0; r < rows; r++){
    var z = 7 + r*((h - 10)/rows);
    for(k = 0; k < Math.floor((w-6)/9); k++)
      o += I.face('y', y+d+.05, x+5+k*9, z, x+11+k*9, z+5.6, (r+k) % 3 ? BLUE : YELLOW, { edge:false, op:.85 });
    for(k = 0; k < Math.floor((d-6)/9); k++)
      o += I.face('x', x+w+.05, y+5+k*9, z, y+11+k*9, z+5.6, (r+k) % 4 ? 'color-mix(in srgb,var(--c-blue),#000 25%)' : YELLOW, { edge:false, op:.8 });
  }
  return o;
}
B.ixp = (function(){
  var s = I.begin() + title('Mumbai: India’s internet capital, by geography');
  var G = 296;   /* ground line */
  /* the sea along the bottom, with cables coming ashore */
  var wave = 'M0 '+(G+74);
  for(var x = 0; x <= 820; x += 20) wave += 'Q'+(x+10)+' '+(G+74+(x/20 % 2 ? 3 : -3))+' '+(x+20)+' '+(G+74);
  var sea = wave + 'L820 470L0 470Z', sc = S.clip(sea); DEFS += sc.def;
  s += '<path d="'+sea+'" fill="var(--net-bg)"/>' + S.hatch(sc.id, bx(0, G+60, 820, 120), 30, 5, BLUE, .5, .22, sd());
  s += '<path d="'+wave+'" fill="none" stroke="var(--net)" stroke-width="1.4" opacity=".6"/>';
  [[20,470],[80,470],[150,470],[220,470],[290,470]].forEach(function(p, i){
    var q = [p, [p[0] + (140-p[0])*.4, 410], [136 + (i-2)*5, G+30]];
    s += cable(q, ORANGE, 2.2) + flow(q, ORANGE, 3.4, i*0.4, 4.5);
  });
  s += T(790, 414, 'the Arabian Sea', 'bg-t', 'end', halo('var(--net-bg)'));
  s += T(540, 450, 'around 17 major subsea systems come ashore near here', 'bg-t', 'middle', halo('var(--net-bg)'));
  /* land links between the three */
  [[[190,G+16],[380,G+16]], [[440,G+16],[640,G+16]]].forEach(function(L, i){
    s += cable(L, 'var(--net)', 3) + flow(L, GREEN, 2.4, i*0.8, 5);
  });
  /* landing station */
  I.at(140, G);
  s += I.shadow(-42, -28, 84, 56, 7) + building(-42, -28, 84, 56, 40, 0, DEV);
  s += I.face('y', 28.05, -34, 4, -12, 30, DARK) + I.face('y', 28.05, 2, 20, 34, 28, ORANGE, { edge:false, op:.85 });
  [-12, 2, 16].forEach(function(y){ s += I.face('x', 42.05, y, 22, y+8, 32, 'color-mix(in srgb,var(--c-blue),#000 25%)', { edge:false, op:.8 }); });
  s += I.cyl(-28, -16, 40, 6.5, 6, DARK) + I.cyl(2, -16, 40, 6.5, 6, DARK);
  s += T(140, 112, 'Landing station', 'bg-l') + lines(140, 134, ['where the sea cable', 'becomes a land cable'], 'bg-t');
  /* the exchange: one switch, everybody's fibre */
  I.at(410, G - 4);
  function W(sx, sy){ var a = sx/0.866, b = 2*sy; return [(a+b)/2, (b-a)/2]; }
  var mem = [[-96,-4,'Airtel',GREEN,'end'], [-56,-40,'Jio',BLUE,'end'], [0,-56,'Google',RED,'middle'],
             [56,-40,'a bank',TAN,'start'], [96,-4,'a college',PINK,'start']].map(function(m){
    var w = W(m[0], m[1]); return [w[0], w[1], m[2], m[3], m[4]];
  });
  mem.forEach(function(m){ s += I.line([[0,0,1],[m[0],m[1],0]], m[3], 2, { op:.9 }); });
  mem.forEach(function(m){ s += I.shadow(m[0]-8, m[1]-8, 16, 16, 3) + I.box(m[0]-8, m[1]-8, 0, 16, 16, 16, m[3]); });
  s += I.shadow(-22, -22, 44, 44, 5) + I.box(-22, -22, 0, 44, 44, 24, YELLOW);
  [-14,-8,-2,4,10].forEach(function(x){ s += I.dot(x, 22, 12, 1.4, GREEN); });
  mem.forEach(function(m){
    var p = I.P(m[0], m[1], 16), a = m[4];
    s += T(p[0] + (a === 'end' ? -16 : a === 'start' ? 16 : 0), p[1] + (a === 'middle' ? -14 : 8), m[2], 'bg-t' + (m[2] === 'Airtel' ? ' ok' : ''), a, halo());
  });
  s += T(410, 112, 'The exchange', 'bg-l') + lines(410, 134, ['NIXI · DE-CIX · Extreme-IX', 'one neutral room, one switch'], 'bg-t');
  s += T(410, 168, 'peering here costs neither side a rupee', 'bg-t ok');
  /* datacentres */
  I.at(700, G);
  s += I.shadow(-44, -26, 94, 52, 7) + building(-44, -26, 50, 40, 82, 7, DEV);
  s += building(14, -18, 38, 36, 50, 4, DEV);
  s += I.cyl(-34, -16, 82, 4.5, 4, DARK) + I.cyl(-18, -16, 82, 4.5, 4, DARK);
  s += T(700, 112, 'Datacentres', 'bg-l') + lines(700, 134, ['content moves in next door', 'because the cables are here'], 'bg-t');
  return stage('Where the networks meet', s,
    'A Mumbai scene: submarine cables coming ashore at a landing station, a neutral exchange building where networks plug into a shared switch, and datacentres alongside.',
    '<b>Mumbai is the internet capital of India for one reason: the cables come ashore there.</b> Landings attract datacentres, datacentres attract exchanges, exchanges attract content networks, and those attract more cables. Before exchanges existed, an email between two Delhi users could genuinely travel to America and back.');
})();

/* ── the ocean floor ────────────────────────────────────── */
/* Africa, Arabia and Asia as one coastline (lon, lat), west to east; then islands */
var WORLD_LL = [[22,-12],[22,32.6],[25.1,31.7],[27.3,31.3],[29.9,31.2],[31.0,31.6],[32.3,31.3],[34.2,31.3],[34.9,32.5],
  [35.5,33.8],[35.9,35.4],[36.2,36.7],[35.6,36.6],[34.6,36.8],[33.5,36.2],[32.5,36.1],[31.5,36.7],[30.6,36.85],[29.7,36.2],
  [28.4,36.8],[27.4,37.1],[26.9,38.0],[26.3,38.5],[26.3,42],[126,42],[126,37.6],[122.5,37.3],[121.0,36.6],[120.2,36.0],
  [119.4,35.1],[120.3,34.2],[120.9,32.6],[121.9,31.0],[121.6,30.0],[122.0,29.7],[121.4,28.4],[120.6,27.5],[119.8,26.0],
  [118.8,24.8],[117.5,23.7],[116.5,22.9],[114.8,22.6],[113.6,22.2],[112.0,21.7],[110.4,21.3],[110.2,20.3],[109.7,21.5],
  [108.5,21.6],[107.5,21.4],[106.6,20.4],[105.8,19.0],[106.6,17.6],[107.8,16.3],[108.8,15.3],[109.3,13.5],[109.2,11.6],
  [108.0,10.8],[106.8,10.4],[105.0,8.6],[104.8,9.6],[104.5,10.4],[103.5,10.6],[102.6,12.0],[101.0,12.7],[100.5,13.5],
  [99.9,13.0],[99.2,10.5],[99.6,9.0],[100.3,8.2],[100.6,7.0],[101.5,6.8],[102.3,6.1],[103.4,4.8],[103.4,3.0],[104.2,1.4],
  [103.5,1.3],[102.0,2.4],[101.0,3.5],[100.4,5.2],[100.2,6.4],[99.6,7.2],[98.3,8.2],[98.5,10.0],[98.6,12.0],[98.1,13.5],
  [97.7,16.0],[97.4,16.6],[96.4,16.6],[95.4,15.8],[94.4,16.0],[94.2,17.4],[94.0,19.0],[93.0,19.9],[92.3,20.8],[91.8,22.3],
  [91.0,22.7],[90.5,22.0],[89.6,21.9],[89.1,21.7],[88.2,21.6],[87.5,21.6],[86.9,21.0],[86.6,20.3],[85.8,19.8],[85.1,19.4],
  [84.2,18.4],[83.3,17.7],[82.3,16.7],[81.3,16.2],[80.3,15.6],[80.1,14.0],[80.3,13.0],[79.9,12.0],[79.8,10.9],[79.8,10.3],
  [79.2,10.3],[78.9,9.4],[78.1,8.8],[77.5,8.1],[76.6,8.9],[76.2,10.0],[75.8,11.3],[75.2,12.4],[74.8,13.0],[74.4,14.2],
  [73.9,15.3],[73.4,16.6],[73.0,18.0],[72.85,18.9],[72.8,20.2],[72.9,21.1],[72.6,22.2],[72.2,21.6],[71.5,20.9],[70.4,20.8],
  [69.5,21.7],[69.0,22.3],[69.8,22.4],[70.4,22.9],[69.6,22.9],[68.9,22.9],[68.5,23.3],[68.2,23.6],[67.4,23.9],[67.0,24.8],
  [66.6,25.4],[65.0,25.3],[63.5,25.3],[61.6,25.2],[59.5,25.4],[58.5,25.6],[57.3,25.8],[56.6,27.0],[56.0,27.1],[54.8,26.5],
  [53.5,26.8],[52.0,27.7],[51.0,28.6],[50.3,29.6],[49.0,30.0],[48.0,29.6],[47.9,29.3],[48.5,28.3],[49.5,27.1],[50.2,26.4],
  [50.4,25.6],[50.8,24.8],[51.2,26.1],[51.6,25.3],[51.5,24.5],[52.5,24.2],[54.0,24.1],[54.8,24.8],[55.6,25.5],[56.1,26.2],
  [56.4,26.3],[56.3,25.0],[56.8,24.3],[57.8,23.8],[58.6,23.6],[59.4,22.7],[59.8,22.3],[58.9,20.7],[58.3,20.4],[57.8,19.5],
  [56.8,18.6],[55.6,17.8],[55.0,17.0],[53.6,16.7],[52.2,15.7],[50.0,15.0],[48.7,14.0],[47.5,13.6],[45.6,13.0],[44.5,12.7],
  [43.5,12.7],[43.2,13.3],[42.9,14.8],[42.6,15.6],[42.3,16.8],[41.4,18.4],[40.2,20.0],[39.2,21.4],[38.9,22.5],[38.0,24.2],
  [37.0,25.6],[36.0,27.3],[35.1,28.1],[34.9,29.5],[34.4,28.0],[34.25,27.75],[33.6,28.3],[32.9,29.2],[32.6,29.9],[32.7,29.2],
  [33.3,28.2],[33.9,27.2],[34.7,25.6],[35.6,23.9],[36.3,22.6],[37.2,21.0],[37.4,19.0],[38.4,18.0],[39.0,16.5],[39.7,15.3],
  [41.2,14.0],[42.6,12.6],[43.1,12.2],[43.3,11.5],[44.5,10.4],[45.8,10.6],[47.5,11.1],[49.0,11.3],[50.5,11.8],[51.25,11.8],
  [51.1,10.5],[50.5,9.0],[49.6,7.5],[48.5,5.6],[47.5,4.5],[46.0,2.5],[44.5,1.4],[42.8,-0.4],[41.6,-1.8],[40.3,-2.6],
  [39.7,-4.0],[39.2,-5.2],[38.9,-6.5],[39.4,-7.8],[39.6,-9.5],[40.4,-10.8],[40.5,-12]];
var ISLES_LL = [LKA_LL,
  [[95.3,5.6],[96.5,5.2],[97.5,5.2],[98.7,3.8],[100.0,2.4],[101.0,2.0],[102.5,1.0],[103.8,-0.8],[104.4,-1.8],[105.0,-2.6],
   [106.0,-3.2],[105.8,-5.8],[104.6,-5.9],[103.5,-4.8],[102.3,-3.9],[101.0,-2.5],[100.3,-0.8],[99.2,0.3],[98.7,1.6],[97.5,2.8],[96.4,3.8],[95.5,4.6]],
  [[105.2,-6.8],[106.0,-5.9],[108.0,-6.3],[110.5,-6.8],[112.6,-6.9],[114.4,-7.6],[114.4,-8.7],[112.5,-8.4],[110.0,-8.1],[108.0,-7.8],[106.5,-7.4]],
  [[109.0,1.5],[109.6,2.0],[111.0,1.6],[113.0,3.2],[115.4,5.0],[116.8,7.0],[117.7,6.0],[119.2,5.2],[118.0,4.3],[117.8,1.0],
   [117.5,0.0],[116.5,-1.5],[116.5,-3.3],[115.0,-4.0],[113.0,-3.2],[111.6,-3.0],[110.2,-2.9],[110.0,-1.3],[109.2,-0.2]],
  [[108.6,19.2],[109.6,20.0],[110.6,20.1],[111.0,19.6],[110.4,18.5],[109.5,18.2],[108.7,18.5]],
  [[120.1,23.0],[120.7,22.0],[121.0,22.6],[121.9,24.9],[121.5,25.3],[120.7,24.5]],
  [[120.0,18.5],[122.2,18.5],[122.3,17.0],[121.5,15.8],[122.0,14.0],[124.0,12.8],[123.0,13.8],[120.6,14.2],[120.0,16.2]],
  [[122.0,7.0],[124.0,8.2],[125.5,9.6],[126.5,8.0],[126.0,6.3],[125.0,5.8],[124.0,6.5]],
  [[117.2,8.4],[119.6,10.6],[119.3,11.3],[117.0,8.6]],
  [[32.3,34.9],[33.0,34.6],[34.1,34.9],[34.6,35.6],[33.5,35.4],[32.4,35.2]],
  [[23.5,35.3],[24.5,35.4],[26.3,35.2],[26.2,34.9],[24.7,34.95],[23.6,35.2]]];
B.subsea = (function(){
  var MX = 20, MY = 76, MW = 780, MH = 372, K = 7.8, LON0 = 24, LAT0 = 38.6;
  function M(ll){ return [MX + (ll[0] - LON0)*K, MY + (LAT0 - ll[1])*K]; }
  function mpoly(arr){ return poly(arr.map(M)); }
  var s = title('The actual internet, mostly underwater', 'Indian Ocean, drawn to scale — three of the cables that carry India');
  var frame = S.d(S.rrect(MX, MY, MW, MH, 12), true, 0, 1), fc = S.clip(frame); DEFS += fc.def;
  var land = mpoly(WORLD_LL) + ISLES_LL.map(mpoly).join(''), lc = S.clip(land); DEFS += lc.def;
  var ind = mpoly(IND_LL);
  s += '<g clip-path="url(#'+fc.id+')">';
  s += '<rect x="'+MX+'" y="'+MY+'" width="'+MW+'" height="'+MH+'" fill="var(--net-bg)"/>';
  s += S.hatch(fc.id, bx(MX, MY, MW, MH), 30, 5.4, BLUE, .5, .2, sd());
  s += '<path d="'+land+'" fill="'+LAND+'" fill-rule="nonzero"/>' + S.hatch(lc.id, bx(MX, MY, MW, MH), 30, 4.4, GREEN, .5, .12, sd());
  s += '<path d="'+ind+'" fill="'+GREEN+'" opacity=".22"/>';
  s += '<path d="'+land+'" fill="none" stroke="var(--ink-3)" stroke-width="1" stroke-linejoin="round" opacity=".9"/>';
  /* the cables, in real coordinates */
  var smw = [[72.8,19.0],[66,17.6],[60,16.2],[54,13.6],[48,12.4],[43.6,12.5],[41.2,15.4],[38.8,19.6],[36.4,23.6],[34.4,27.0],
             [32.8,29.6],[32.4,31.0],[29.5,32.8],[24.5,34.4],[18,35.2]].map(M);
  var i2i = [[80.3,13.1],[84,11.6],[89,9.2],[94,7.0],[97.6,5.8],[99.8,3.8],[102.0,2.0],[103.7,1.25]].map(M);
  var pac = [[103.9,1.3],[105.6,3.4],[108.4,6.8],[112.0,10.6],[116.0,14.6],[119.0,18.6],[121.0,21.0],[124,22.6],[130,24]].map(M);
  [[smw, ORANGE, 6.4], [i2i, RED, 3.4], [pac, BLUE, 5.2]].forEach(function(c, i){
    s += cable(c[0], c[1], 3) + flow(c[0], c[1], c[2], i*0.5, 6);
  });
  s += '</g>';
  s += '<path d="'+frame+'" fill="none" stroke="var(--border-2)" stroke-width="1.2"/>';
  var H = halo('var(--net-bg)'), HL = halo(LAND);
  [['Mumbai', [72.88,19.08], -10, 4, 'end'], ['Chennai', [80.27,13.08], -10, 4, 'end'], ['Singapore', [103.82,1.35], 12, 16, 'start']].forEach(function(c){
    var p = M(c[1]);
    s += '<circle cx="'+f(p[0])+'" cy="'+f(p[1])+'" r="4.5" fill="var(--ink)" stroke="var(--paper)" stroke-width="1.6"/>';
    s += T(p[0] + c[2], p[1] + c[3], c[0], 'bg-t', c[4], c[4] === 'start' ? H : HL);
  });
  s += T(M([78,23.5])[0], M([78,23.5])[1], 'India', 'bg-l', 'middle', HL);
  s += T(M([45,22])[0], M([45,22])[1], 'Arabia', 'bg-l', 'middle', HL);
  s += T(M([33,6])[0], M([33,6])[1], 'Africa', 'bg-l', 'middle', HL);
  s += T(M([25,33.4])[0] + 4, M([25,33.4])[1] + 22, '← Marseille', 'bg-t', 'start', H);
  s += T(M([62,10.2])[0], M([62,10.2])[1], 'SEA-ME-WE', 'bg-t', 'middle', H) + T(M([62,10.2])[0], M([62,10.2])[1] + 16, 'to Europe', 'bg-t', 'middle', H);
  var ip = M([88.6,5.4]);
  s += T(ip[0], ip[1], 'i2i · Airtel’s own', 'bg-t hot', 'middle', H) + T(ip[0], ip[1] + 16, '3,200 km', 'bg-t hot', 'middle', H);
  var pp = M([114.2,10.4]);
  s += T(pp[0], pp[1], 'onward to', 'bg-t', 'middle', H) + T(pp[0], pp[1] + 16, 'the Pacific', 'bg-t', 'middle', H);
  s += panel(204, 328, 224, 108, { fill:'var(--paper)', fillOp:.94, op:.04 });
  s += T(220, 352, 'Not satellites', 'bg-l', 'start');
  s += lines(220, 372, ['~99% of traffic between', 'continents runs on glass', 'lying on the seabed'], 'bg-t', 'start', 15);
  s += T(220, 423, '200 km per millisecond', 'bg-t hot', 'start');
  s += T(790, 466, 'anchors and trawlers cut these over a hundred times a year', 'bg-s', 'end');
  return stage('The ocean floor', s,
    'Submarine cables leaving India for the Gulf and Europe and for Singapore, drawn across an ocean, with packets crawling along them at different speeds.',
    '<b>Airtel does not just buy capacity on these — it owns some.</b> The i2i cable runs 3,200 km from Chennai to Singapore and belongs to Bharti Airtel outright. When one of these is cut, traffic reroutes within seconds and you never notice; when several go at once, the whole country feels it.');
})();

/* ── the room at the other end ──────────────────────────── */
B.gdc = (function(){
  var s = I.begin() + title('“The cloud” is a room, and the room is disappointingly physical');
  var OX = 520, OY = 186, RW = 26, RD = 28, RH = 84, GX = 30, GY = 66;
  /* the load balancer, out front */
  I.at(150, 290);
  s += I.shadow(-24, -30, 48, 60, 6) + I.box(-24, -30, 0, 48, 60, 46, DEV);
  [0,1,2].forEach(function(u){
    var z = 8 + u*11;
    s += I.face('y', 30.05, -20, z, 20, z+7, UNIT) + I.dot(-15, 30, z+3.5, 1.4, GREEN) + I.dot(-10, 30, z+3.5, 1.4, GREEN);
  });
  s += I.face('z', 46.05, -18, -24, 18, -18, 'var(--net)', { edge:false, op:.9 });
  var lbTop = I.P(0, 0, 46), lbIn = I.P(-24, 10, 22);
  var inn = [[0, lbIn[1]], [lbIn[0], lbIn[1]]];
  s += cable(inn, 'var(--net)', 3) + flow(inn, RED, 3.6, 0, 7);
  s += T(150, 338, 'Load balancer', 'bg-l') + lines(150, 358, ['DNS gave you its IP,', 'not a server’s'], 'bg-t');
  /* the floor */
  I.at(OX, OY);
  s += I.face('z', 0, -18, -18, 4*GX+RW+18, 2*GY+RD+40, 'var(--paper-2)', { edge:true });
  var g;
  for(g = 0; g <= 4*GX+RW+36; g += 32) s += I.line([[g-18,-18,0],[g-18,2*GY+RD+40,0]], 'var(--ink)', .6, { op:.08 });
  for(g = 0; g <= 2*GY+RD+58; g += 32) s += I.line([[-18,g-18,0],[4*GX+RW+18,g-18,0]], 'var(--ink)', .6, { op:.08 });
  /* overhead cable trays above each row */
  var r, c, u;
  var picks = [[0,3,GREEN,0], [1,1,YELLOW,1.2], [2,4,ORANGE,2.4]];
  for(r = 0; r < 3; r++){
    for(c = 0; c < 5; c++){
      var x = c*GX, y = r*GY, dead = (r === 1 && c === 3);
      s += I.shadow(x, y, RW, RD, 3) + I.box(x, y, 0, RW, RD, RH, DARK);
      for(u = 0; u < 7; u++){
        var z = 6 + u*11;
        s += I.face('y', y+RD+.05, x+3, z, x+RW-3, z+8, UNIT);
        var p = I.P(x+6, y+RD, z+4);
        s += '<circle cx="'+f(p[0])+'" cy="'+f(p[1])+'" r="1.5" fill="'+(dead && u === 3 ? RED : GREEN)+'"'+
          (dead && u === 3 ? '' : ' class="blink" style="--dly:'+(((r+c+u)%7)*0.2)+'s"')+'/>';
      }
    }
  }
  for(r = 0; r < 3; r++) s += I.line([[-30, r*GY+14, RH+16],[4*GX+RW, r*GY+14, RH+16]], 'var(--ink-3)', 1, { op:.5, dash:'3 4' });
  picks.forEach(function(k){
    var y = k[0]*GY + 14, x = k[1]*GX + RW/2;
    var pts = [lbTop, I.P(-30, y, RH+16), I.P(x, y, RH+16), I.P(x, y, RH+1)];
    s += '<g class="fadecyc" style="--dly:'+k[3]+'s">'+path(pts, { c:k[2], w:3, op:.95 })+'</g>';
    s += flow(pts, k[2], 3.6, k[3], 5);
  });
  var dp = I.P(3*GX + RW/2, GY + RD, 6 + 3*11 + 4);
  s += path([[dp[0]+6, dp[1]+4], [668, 372]], { c:RED, w:1, op:.6 });
  s += T(674, 376, 'a dead server', 'bg-t hot', 'start') + T(674, 393, 'is simply skipped', 'bg-t hot', 'start');
  s += T(668, 110, 'thousands of identical', 'bg-t', 'start') + T(668, 127, 'machines, any one of', 'bg-t', 'start') + T(668, 144, 'which can answer you', 'bg-t', 'start');
  s += T(410, 430, 'you never learn which machine answered —', 'bg-t') + T(410, 447, 'and if it dies mid-video, another takes over', 'bg-t');
  return stage('The room at the other end', s,
    'A datacentre floor of racks with blinking servers, fronted by a load balancer that sends each arriving request to whichever machine is healthy.',
    '<b>One address, thousands of machines.</b> Servers have permanent addresses and wait; clients have temporary ones and initiate. That asymmetry is why you can reach Google but Google cannot reach you — the same asymmetry your carrier NAT deepens at your end.');
})();

/* ── three distances ────────────────────────────────────── */
B.origin = (function(){
  var s = title('Bandwidth is how wide the pipe is. This is how long it is.', 'three packets, released together, over the same drawn distance');
  var rows = [['Cached inside Airtel', '8 ms', GREEN, 1.0, 'a rack in Mumbai'],
              ['Google’s Indian region', '30 ms', YELLOW, 2.4, 'across the exchange'],
              ['Oregon, over a cable', '220 ms', RED, 7.2, '~20,000 km of glass']];
  s += path([[44,96],[44,400]], { c:'var(--ink-3)', w:1.2, op:.6, dash:'3 4' }) + path([[700,96],[700,400]], { c:'var(--ink-3)', w:1.2, op:.6, dash:'3 4' });
  s += T(44, 414, 'start', 'bg-s') + T(700, 414, 'arrives', 'bg-s');
  rows.forEach(function(r, i){
    var y = 140 + i*100;
    s += T(30, y-18, r[0], 'bg-l', 'start') + T(700, y-18, r[4], 'bg-t', 'end');
    s += panel(30, y-6, 684, 28, { r:14, fill:'var(--paper-2)', op:.05 });
    s += path([[44,y+8],[700,y+8]], { c:r[2], w:2, op:.35 });
    s += flow([[44,y+8],[700,y+8]], r[2], r[3], 0, 8);
    s += T(790, y+15, r[1], 'bg-h', 'end');
  });
  s += T(30, 448, 'Upgrading your plan moves none of these three numbers.', 'bg-t hot', 'start');
  return stage('Three distances', s,
    'Three packets released at the same moment travel the same drawn distance at wildly different speeds, labelled 8, 30 and 220 milliseconds.',
    '<b>Watch them separate.</b> End-to-end throughput is the minimum of every link on the path, but latency is set by distance and the speed of light in glass. A bigger plan finishes a download sooner; it does nothing whatsoever to a video call with America.');
})();
})();

/* ── merge: the big scene first, the tight mechanism diagram under it ── */
(function(){
  var B = window.BIGSCENES, SC = window.SCENES;
  if(!B || !SC) return;
  Object.keys(B).forEach(function(k){
    SC[k] = B[k] + (SC[k] || '');
  });
})();
