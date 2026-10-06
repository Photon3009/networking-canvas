/* bigscenes2.js — full-scale scenes for the carrier core and the open internet. */
(function(){
'use strict';
var S = window.SK, B = window.BIGSCENES, N = 40000;
function sd(){ return (N += 19); }
var DEFS = '';
function bx(x,y,w,h){ return {x:x,y:y,w:w,h:h}; }
function rect(x,y,w,h,r,o){
  o = o || {};
  return S.shape(S.d(S.rrect(x,y,w,h,r===undefined?6:r), true, 1.2, sd()), bx(x,y,w,h),
    { fill:o.fill, fillOp:o.fillOp, shade:o.shade, shadeAngle:o.ang, gap:o.gap||5,
      shadeOp:o.op===undefined?.3:o.op, dots:o.dots, dotsN:o.dotsN, dotR:o.dotR,
      seed:sd(), w:o.w||2, inkColor:o.ink, inkOp:o.inkOp, dash:o.dash }).svg;
}
function T(x,y,t,cls,a){ return '<text x="'+x+'" y="'+y+'" class="'+(cls||'bg-t')+'" text-anchor="'+(a||'middle')+'">'+t+'</text>'; }
function wob(pts,o){
  o = o || {};
  return '<path d="'+S.ds(pts,false,o.amp===undefined?2:o.amp,sd())+'" fill="none" stroke="'+(o.c||'var(--ink)')+
    '" stroke-width="'+(o.w||2.4)+'" opacity="'+(o.op===undefined?.8:o.op)+'" stroke-linecap="round"'+
    (o.dash?' stroke-dasharray="'+o.dash+'"':'')+(o.cls?' class="'+o.cls+'"':'')+(o.st?' style="'+o.st+'"':'')+'/>';
}
function flow(pts,c,dur,dly,r){
  return '<circle class="mv" r="'+(r||7)+'" cx="0" cy="0" fill="'+c+'" stroke="var(--paper)" stroke-width="2" '+
    'style="offset-path:path(\''+S.ds(pts,false,1.6,sd())+'\');--dur:'+dur+'s;--dly:'+(dly||0)+'s"/>';
}
function city(x,y,n,hot,off){
  off = off || {};
  return '<circle cx="'+x+'" cy="'+y+'" r="7" fill="'+(hot?'var(--c-red)':'var(--ink)')+'"/>'+
    '<circle cx="'+x+'" cy="'+y+'" r="12" fill="none" stroke="'+(hot?'var(--c-red)':'var(--ink)')+'" stroke-width="1.5" opacity=".5"/>'+
    T(x + (off.dx||0), y + (off.dy===undefined?-20:off.dy), n, 'bg-t', off.a);
}
var LBL = { del:{dy:-22}, mum:{dx:-16, a:'end', dy:4}, kol:{dx:18, a:'start', dy:-14},
            che:{dx:18, a:'start', dy:10}, ben:{dx:-18, a:'end', dy:10},
            hyd:{dx:20, a:'start', dy:2}, ahm:{dx:-16, a:'end', dy:-8} };
function stage(title, inner, aria, cap){
  var f = '<figure class="sc zoom" data-title="'+title+'"><span class="zhint">tap to enlarge</span>'+
    '<div class="figscroll"><svg viewBox="0 0 820 470" role="img" style="min-width:620px" aria-label="'+aria+'">'+
    '<defs>'+DEFS+'</defs>'+inner+'</svg></div><figcaption>'+cap+'</figcaption></figure>';
  DEFS = ''; return f;
}
/* India, projected from real lon/lat into a 0-100 x 0-120 box, then drawn by hand */
var IND = [[31,6],[36,10],[41,18],[47,26],[59,40],[69,38],[74,42],[83,38],[95,36],[100,38],[98,46],[91,52],
  [86,60],[84,54],[72,60],[69,62],[66,62],[59,70],[48,82],[42,96],[41,106],[33,116],[28,108],[23,94],[19,84],
  [17,72],[16,62],[7,64],[3,58],[9,54],[2,52],[10,50],[9,38],[17,28],[24,18],[29,12]];
var CITY = { del:[31.7,33.6], mum:[16.6,72], kol:[70.3,57.6], che:[42.4,95.6],
             ben:[33.1,96], hyd:[36.2,78.4], ahm:[15.9,56] };
function P(o, x, y){ return [o.x + x*o.k, o.y + y*o.k]; }
function C(o, n){ return P(o, CITY[n][0], CITY[n][1]); }
function india(o, fillOp){
  var pts = IND.map(function(p){ return P(o, p[0], p[1]); });
  var d = S.ds(pts, true, 1.1, 9111), cl = S.clip(d); DEFS += cl.def;
  var b = bx(o.x, o.y, 100*o.k, 120*o.k);
  return '<path d="'+d+'" fill="var(--c-green)" opacity="'+(fillOp||.15)+'"/>'+
    S.hatch(cl.id, b, 26, 10, 'var(--c-green)', 1, .26, sd(), '6 9')+
    S.stipple(cl.id, b, 80, 'var(--c-green)', 1.6, sd(), .3)+
    '<path d="'+d+'" fill="none" stroke="var(--ink)" stroke-width="2.6" opacity=".7"/>';
}

/* ── the turnstile ──────────────────────────────────────── */
B.bng = (function(){
  var s = T(30, 44, 'One public address, hundreds of households behind it', 'bg-h', 'start');
  var ys = [110, 190, 270, 350];
  ys.forEach(function(y, i){
    s += rect(30, y-28, 150, 56, 7, { fill: i===1?'var(--home-bg)':'var(--paper-3)', shade: i===1?'var(--home)':'var(--ink)',
      op: i===1?.3:.12, ink: i===1?'var(--home)':undefined, w:2 });
    s += T(105, y+5, i===1 ? 'your home' : 'a neighbour', 'bg-s');
    s += wob([[180,y],[260,y],[300,240]], { c:'var(--home)', w:2, op:.5 });
    s += flow([[180,y],[260,y],[300,240]], 'var(--c-green)', 3.4, i*0.3, 5);
  });
  s += rect(300, 130, 200, 220, 10, { fill:'var(--core-bg)', shade:'var(--core)', op:.3, ink:'var(--core)', w:2.8 });
  s += T(400, 170, 'BNG + CGNAT', 'bg-l') + T(400, 194, 'the turnstile', 'bg-s');
  s += T(400, 230, 'checks your plan', 'bg-s') + T(400, 250, 'caps your speed', 'bg-s') + T(400, 270, 'rewrites your address', 'bg-s hot');
  s += T(400, 316, '100.64.x.x', 'bg-t hot');
  s += wob([[500,240],[600,240]], { c:'var(--core)', w:4 }) + flow([[500,240],[620,240]], 'var(--c-green)', 3, 1.2, 7);
  s += rect(620, 180, 170, 120, 9, { fill:'var(--net-bg)', shade:'var(--net)', op:.3, ink:'var(--net)' });
  s += T(705, 226, 'The internet', 'bg-l') + T(705, 250, 'sees one IP', 'bg-s');
  s += T(705, 274, 'for all of you', 'bg-s');
  var back = [[790,360],[620,360],[510,360]];
  s += wob(back, { c:'var(--c-red)', w:3, dash:'8 6' });
  s += '<circle class="mv bounce" r="7" cx="0" cy="0" fill="var(--c-red)" stroke="var(--paper)" stroke-width="2" style="offset-path:path(\'' +
    S.ds(back, false, 1.6, sd()) + '\');--dur:4s;--dly:0.4s"/>';
  s += '<g stroke="var(--c-red)" stroke-width="4" stroke-linecap="round"><line x1="498" y1="350" x2="518" y2="370"/><line x1="518" y1="350" x2="498" y2="370"/></g>';
  s += T(650, 392, 'anything arriving unasked stops here', 'bg-t hot');
  s += T(105, 416, 'you cannot be dialled, only dial out', 'bg-s');
  return stage('The turnstile', s,
    'Several households share one public address through the carrier gateway; outbound traffic passes, unsolicited inbound traffic is stopped at the gateway.',
    '<b>You are sharing a public address with strangers.</b> There are not enough IPv4 addresses in the world for every Indian broadband line, so the gateway translates hundreds of customers onto one. Outbound is fine. Inbound has nowhere to be delivered — which is the whole reason your CCTV app needs a cloud relay.');
})();

/* ── the national backbone ──────────────────────────────── */
B.backbone = (function(){
  var o = { x:96, y:26, k:3.3 };
  var s = india(o);
  var C_ = {}; ['del','mum','kol','che','ben','hyd','ahm'].forEach(function(k){ C_[k] = C(o, k); });
  [['del','ahm'],['del','kol'],['del','mum'],['ahm','mum'],['mum','hyd'],['hyd','kol'],
   ['hyd','ben'],['ben','che'],['mum','ben'],['kol','che'],['che','hyd']].forEach(function(L){
    var a = C_[L[0]], b = C_[L[1]];
    s += wob([a, [(a[0]+b[0])/2 + 6, (a[1]+b[1])/2 - 8], b], { c:'var(--core)', w:2.6, op:.7, amp:1.4 });
  });
  var route = [C_.del, [(C_.del[0]+C_.mum[0])/2 - 14, (C_.del[1]+C_.mum[1])/2], C_.mum];
  s += wob(route, { c:'var(--c-red)', w:4.5, op:.95, amp:1 });
  s += flow(route, 'var(--c-red)', 3.2, 0, 8);
  var nm = { del:'Delhi', mum:'Mumbai', kol:'Kolkata', che:'Chennai', ben:'Bengaluru', hyd:'Hyderabad', ahm:'Ahmedabad' };
  Object.keys(C_).forEach(function(k){ s += city(C_[k][0], C_[k][1], nm[k], k === 'mum' || k === 'del', LBL[k]); });
  s += T(30, 44, 'AS9498 \u2014 one company\u2019s share of the internet', 'bg-h', 'start');
  s += rect(570, 96, 230, 150, 9, { fill:'var(--paper-3)', shade:'var(--ink)', op:.1, w:2 });
  s += T(685, 124, 'what a hop costs', 'bg-l');
  [['Delhi \u2192 Mumbai', '~30 ms'], ['Mumbai \u2192 Chennai', '~35 ms'], ['inside one city', '<8 ms']].forEach(function(r, i){
    s += T(586, 154 + i*26, r[0], 'bg-s', 'start') + T(786, 154 + i*26, r[1], 'bg-s ok', 'end');
  });
  s += rect(570, 286, 230, 148, 9, { fill:'var(--core-bg)', shade:'var(--core)', op:.24, ink:'var(--core)', w:2 });
  s += T(685, 316, 'no router knows the route', 'bg-l');
  s += T(685, 344, 'each one reads the address,', 'bg-s') + T(685, 362, 'matches the longest prefix,', 'bg-s');
  s += T(685, 380, 'picks a port, forgets you', 'bg-s');
  s += T(685, 410, 'OSPF inside \u00b7 BGP at the edge', 'bg-s hot');
  s += T(30, 452, 'schematic \u2014 city positions are real, the routes are illustrative', 'bg-s', 'start');
  return stage('Airtel, drawn as a country', s,
    'A map of India with the major cities joined by backbone links, one route from Delhi to Mumbai highlighted, and a panel of typical latencies.',
    '<b>The core is a small number of very large routers and a great deal of fibre.</b> Nothing along this path holds the whole route \u2014 each router only knows the next hop. That is why the middle of the internet can be so fast, and why every guarantee you enjoy had to be invented at the two ends.');
})();

/* ── the resolver's memory ──────────────────────────────── */
B.resolver = (function(){
  var s = T(30, 44, 'A machine whose entire job is remembering, briefly', 'bg-h', 'start');
  s += rect(40, 90, 330, 330, 10, { fill:'var(--core-bg)', shade:'var(--core)', op:.22, ink:'var(--core)', w:2.6 });
  s += T(205, 122, 'Airtel’s resolver · its cache', 'bg-l');
  var rows = [['youtube.com', '142.250.195.78', '271 s', 'ok'], ['wa.me', '157.240.16.60', '48 s', 'ok'],
              ['airtel.in', '125.19.41.10', '3 s', 'hot'], ['some-blog.dev', '— expired —', '0 s', 'hot']];
  rows.forEach(function(r, i){
    var y = 150 + i*62;
    s += rect(62, y, 286, 48, 5, { fill:'var(--paper)', shade:'var(--core)', op:.14, w:1.6 });
    s += T(76, y+21, r[0], 'bg-t', 'start') + T(76, y+38, r[1], 'bg-s', 'start');
    s += T(334, y+30, r[2], 'bg-t ' + r[3], 'end');
  });
  s += T(205, 442, 'every answer carries a countdown — the TTL', 'bg-s');
  s += rect(430, 120, 160, 90, 8, { fill:'var(--home-bg)', shade:'var(--home)', op:.26, ink:'var(--home)' });
  s += T(510, 160, 'You', 'bg-l') + T(510, 184, 'and a million others', 'bg-s');
  var hit = [[510,210],[470,250],[370,270]];
  s += wob(hit, { c:'var(--c-green)', w:3 }) + flow(hit, 'var(--c-green)', 1.4, 0, 6);
  s += T(430, 300, 'cache hit · under 1 ms', 'bg-t ok', 'start');
  var miss = [[590,165],[680,180],[700,250]];
  s += wob(miss, { c:'var(--c-red)', w:2.6, dash:'7 6' }) + flow(miss, 'var(--c-yellow)', 4, 0.6, 6);
  s += rect(630, 270, 160, 110, 8, { fill:'var(--net-bg)', shade:'var(--net)', op:.26, ink:'var(--net)' });
  s += T(710, 306, 'the wider tree', 'bg-l') + T(710, 330, 'root → .com → ns1', 'bg-s');
  s += T(710, 356, 'only on a miss', 'bg-s hot');
  s += T(710, 410, 'and this is where a blocked', 'bg-s') + T(710, 428, 'site is blocked, in India', 'bg-s hot');
  return stage('What the resolver remembers', s,
    'The resolver cache as a list of names with counting-down time-to-live values; a cache hit answers instantly while an expired entry forces a walk up the DNS tree.',
    '<b>DNS survives on forgetfulness with a timer.</b> Only the first person to ask after a TTL expires pays the full cost; everyone else is answered from this list. The same list is where an ISP-level site block is actually implemented — which is why switching resolver sometimes makes a site reappear.');
})();

/* ── the name tree ──────────────────────────────────────── */
B.dnstree = (function(){
  var s = T(30, 44, 'Nobody holds the whole phone book — by design', 'bg-h', 'start');
  var lv = [['the root', 410, 100, 'var(--c-red)', '. — 13 addresses, 1900+ machines'],
            ['.com', 250, 220, 'var(--c-yellow)', 'and .in, .org, .net …'],
            ['google.com', 250, 340, 'var(--c-green)', 'run by Google itself']];
  s += wob([[410,130],[250,190]], { c:'var(--ink-3)', w:2.4 });
  s += wob([[250,250],[250,310]], { c:'var(--ink-3)', w:2.4 });
  [[410,100,570,220],[570,220,570,340]].forEach(function(l){ s += wob([[l[0],l[1]+30],[l[2],l[3]-30]], { c:'var(--ink-3)', w:1.6, op:.4, dash:'5 6' }); });
  s += rect(490, 190, 160, 60, 7, { fill:'var(--paper-3)', shade:'var(--ink)', op:.1, w:1.8 });
  s += T(570, 226, '.in  .org  .net', 'bg-s');
  s += rect(490, 310, 160, 60, 7, { fill:'var(--paper-3)', shade:'var(--ink)', op:.1, w:1.8 });
  s += T(570, 346, 'millions of others', 'bg-s');
  lv.forEach(function(l){
    s += rect(l[1]-110, l[2]-30, 220, 60, 8, { fill:'var(--paper)', shade:l[3], op:.24, ink:l[3], w:2.4 });
    s += T(l[1], l[2]+2, l[0], 'bg-l') + T(l[1], l[2]+22, l[4], 'bg-s');
  });
  var q = [[80,410],[200,410],[410,130]];
  s += wob(q, { c:'var(--c-yellow)', w:2.4, dash:'6 6' });
  s += flow(q, 'var(--c-yellow)', 3.6, 0, 6);
  s += flow([[410,130],[250,190]], 'var(--c-yellow)', 3.6, 1.2, 6);
  s += flow([[250,250],[250,310]], 'var(--c-green)', 3.6, 2.4, 6);
  s += rect(30, 380, 160, 60, 7, { fill:'var(--core-bg)', shade:'var(--core)', op:.26, ink:'var(--core)' });
  s += T(110, 416, 'your resolver', 'bg-l');
  s += T(410, 432, 'each level answers only "ask them next" — so no single failure can take DNS down', 'bg-t');
  return stage('The name tree', s,
    'The DNS hierarchy: a resolver asks the root, which refers it to the dot-com servers, which refer it to Google’s own authoritative servers.',
    '<b>Read <code>www.youtube.com</code> backwards and that is the order it is resolved in.</b> There is even an invisible dot after .com — the root. Splitting the database this way means no organisation has to know every name on earth, and no one outage can take the whole system with it.');
})();

/* ── the cache next door ────────────────────────────────── */
B.ggc = (function(){
  var o = { x:70, y:26, k:3.0 };
  var s = india(o);
  var mum = C(o, 'mum'), you = C(o, 'del');
  s += wob([[790,58],[700,110],[620,190],[588,272]], { c:'var(--net)', w:3, dash:'10 8', op:.55 });
  s += T(742, 44, 'to the rest of the world', 'bg-s');
  s += rect(560, 290, 240, 134, 9, { fill:'var(--net-bg)', shade:'var(--net)', op:.28, ink:'var(--net)' });
  s += T(680, 326, 'Oregon', 'bg-l') + T(680, 350, 'where it lives when nobody', 'bg-s') + T(680, 368, 'nearby has asked lately', 'bg-s');
  s += T(680, 400, '200\u2013250 ms', 'bg-t hot');
  var far = [you, [430,180], [520,250], [580,300]];
  s += wob(far, { c:'var(--c-red)', w:3, dash:'9 7' }) + flow(far, 'var(--c-red)', 5.6, 0, 7);
  var near = [you, [(you[0]+mum[0])/2 - 16, (you[1]+mum[1])/2], mum];
  s += wob(near, { c:'var(--c-green)', w:4 }) + flow(near, 'var(--c-green)', 1.3, 0, 7);
  s += city(you[0], you[1], 'you', false, {dy:-22});
  s += '<circle cx="'+mum[0]+'" cy="'+mum[1]+'" r="17" fill="var(--c-green)" opacity=".28" class="pulse"/>';
  s += city(mum[0], mum[1], 'Mumbai', true, {dx:-20, a:'end', dy:2});
  s += T(mum[0] - 6, mum[1]+34, 'a Google server,', 'bg-s ok') + T(mum[0] - 6, mum[1]+50, 'racked inside Airtel', 'bg-s ok');
  s += T(mum[0] - 6, mum[1]+70, '5\u201315 ms', 'bg-t ok');
  s += T(30, 44, 'Your video was here before you asked for it', 'bg-h', 'start');
  s += T(410, 456, 'both dots leave at the same moment \u2014 watch how long the red one takes', 'bg-t');
  return stage('The cache next door', s,
    'Two requests leave at once: a short green one to a Google cache inside Airtel in Mumbai, and a long red one across the world to Oregon, arriving far later.',
    '<b>Most of what you watch never leaves India, or even Airtel.</b> Google racks its own machines inside consumer ISPs and pre-loads them with what your city watches. It is also why a trending video starts instantly while an obscure 2009 upload buffers \u2014 same plan, same fibre, different geography.');
})();

/* ── where the networks meet ────────────────────────────── */
B.ixp = (function(){
  var s = rect(0, 300, 820, 170, 0, { fill:'var(--c-blue)', fillOp:.2, shade:'var(--c-blue)', op:.22, gap:11, w:0, ink:'none', inkOp:0 });
  s += wob([[0,304],[200,298],[420,308],[640,296],[820,304]], { c:'var(--ink)', w:2.6, op:.55 });
  s += T(80, 420, 'the Arabian Sea', 'bg-s', 'start');
  [[60,344],[210,372],[380,350],[540,392],[700,356]].forEach(function(p, i){
    s += wob([[p[0]-60,p[1]+40],[p[0],p[1]],[p[0]+60,p[1]-30]], { c:'var(--c-orange)', w:2.6, op:.8 });
    s += flow([[p[0]-60,p[1]+40],[p[0],p[1]],[p[0]+50,p[1]-24]], 'var(--c-orange)', 3.4, i*0.4, 5);
  });
  s += T(410, 452, 'around 17 major subsea systems come ashore near here', 'bg-t');
  s += rect(40, 60, 180, 200, 8, { fill:'var(--paper-3)', shade:'var(--ink)', op:.12, w:2.4 });
  s += T(130, 92, 'Landing station', 'bg-l') + T(130, 116, 'where the sea cable', 'bg-s') + T(130, 134, 'becomes a land cable', 'bg-s');
  s += rect(300, 40, 220, 240, 10, { fill:'var(--net-bg)', shade:'var(--net)', op:.3, ink:'var(--net)', w:3 });
  s += T(410, 76, 'The exchange', 'bg-h') + T(410, 100, 'NIXI · DE-CIX · Extreme-IX', 'bg-s');
  s += T(410, 128, 'one neutral room, one switch,', 'bg-s') + T(410, 146, 'everybody’s fibre', 'bg-s');
  var nets = ['Airtel', 'Jio', 'Google', 'a bank', 'a college'];
  nets.forEach(function(n, i){
    var y = 176 + i*22;
    s += T(410, y, n, 'bg-s ' + (i===0 ? 'ok' : ''));
  });
  s += rect(600, 60, 180, 200, 8, { fill:'var(--core-bg)', shade:'var(--core)', op:.24, ink:'var(--core)', w:2.4 });
  s += T(690, 92, 'Datacentres', 'bg-l') + T(690, 116, 'content moves in next door', 'bg-s');
  s += T(690, 144, 'because the cables', 'bg-s') + T(690, 162, 'are already here', 'bg-s');
  [[220,150,300,150],[520,150,600,150]].forEach(function(l){ s += wob([[l[0],l[1]],[l[2],l[3]]], { c:'var(--net)', w:3.4 }); });
  s += flow([[220,150],[300,150]], 'var(--c-green)', 2.4, 0, 6);
  s += flow([[520,150],[600,150]], 'var(--c-green)', 2.4, 0.8, 6);
  s += T(30, 36, 'Mumbai: India’s internet capital, by geography', 'bg-h', 'start');
  s += T(410, 296, 'peering here costs neither side a rupee', 'bg-t ok');
  return stage('Where the networks meet', s,
    'A Mumbai scene: submarine cables coming ashore at a landing station, a neutral exchange building where networks plug into a shared switch, and datacentres alongside.',
    '<b>Mumbai is the internet capital of India for one reason: the cables come ashore there.</b> Landings attract datacentres, datacentres attract exchanges, exchanges attract content networks, and those attract more cables. Before exchanges existed, an email between two Delhi users could genuinely travel to America and back.');
})();

/* ── the ocean floor ────────────────────────────────────── */
B.subsea = (function(){
  var s = rect(0, 0, 820, 470, 0, { fill:'var(--c-blue)', fillOp:.2, shade:'var(--c-blue)', op:.2, gap:14, w:0, ink:'none', inkOp:0 });
  [[60,90,'India'],[760,120,'Europe'],[700,360,'Singapore'],[300,40,'Gulf']].forEach(function(l){
    var pts = S.blob(l[0], l[1], 90, 62, 16, .35, sd());
    var d = S.d(pts, true, 3, sd()), cl = S.clip(d); DEFS += cl.def;
    s += '<path d="'+d+'" fill="var(--c-green)" opacity=".2"/>';
    s += S.hatch(cl.id, bx(l[0]-90, l[1]-62, 180, 124), 22, 9, 'var(--c-green)', 1, .28, sd(), '5 8');
    s += '<path d="'+d+'" fill="none" stroke="var(--ink)" stroke-width="2.2" opacity=".6"/>';
    s += T(l[0], l[1]+4, l[2], 'bg-l');
  });
  var cables = [
    [[[120,120],[300,110],[480,110],[690,120]], 'var(--c-orange)', 'to Europe · SEA-ME-WE', 5.4],
    [[[130,150],[320,240],[520,330],[660,350]], 'var(--c-red)', 'i2i · Chennai–Singapore · Airtel’s own · 3,200 km', 3.4],
    [[[120,170],[260,300],[380,400],[600,412]], 'var(--c-blue)', 'and onward to the Pacific', 6.2]];
  cables.forEach(function(c, i){
    s += wob(c[0], { c:c[1], w:4, op:.9 });
    s += flow(c[0], c[1], c[3], i*0.5, 7);
  });
  s += T(300, 180, cables[0][2], 'bg-s');
  s += T(330, 286, cables[1][2], 'bg-s hot');
  s += T(300, 424, cables[2][2], 'bg-s');
  s += rect(30, 250, 210, 170, 9, { fill:'var(--paper)', fillOp:.92, shade:'var(--ink)', op:.1, w:2.4 });
  s += T(135, 280, 'not satellites', 'bg-l');
  s += T(135, 306, '~99% of traffic between', 'bg-s') + T(135, 324, 'continents runs on glass', 'bg-s');
  s += T(135, 342, 'lying on the seabed', 'bg-s');
  s += T(135, 372, 'a hose-thick cable,', 'bg-s') + T(135, 390, 'fibres thinner than hair', 'bg-s');
  s += T(135, 412, '200 km per millisecond', 'bg-t hot');
  s += T(30, 40, 'The actual internet, mostly underwater', 'bg-h', 'start');
  s += T(790, 456, 'anchors and trawlers cut these over a hundred times a year', 'bg-s', 'end');
  return stage('The ocean floor', s,
    'Submarine cables leaving India for the Gulf and Europe and for Singapore, drawn across an ocean, with packets crawling along them at different speeds.',
    '<b>Airtel does not just buy capacity on these — it owns some.</b> The i2i cable runs 3,200 km from Chennai to Singapore and belongs to Bharti Airtel outright. When one of these is cut, traffic reroutes within seconds and you never notice; when several go at once, the whole country feels it.');
})();

/* ── the room at the other end ──────────────────────────── */
B.gdc = (function(){
  var s = rect(30, 70, 760, 350, 8, { fill:'var(--paper-3)', shade:'var(--ink)', op:.08, gap:11, w:3.2 });
  s += T(30, 44, '"The cloud" is a room, and the room is disappointingly physical', 'bg-h', 'start');
  s += rect(60, 150, 130, 190, 9, { fill:'var(--net-bg)', shade:'var(--net)', op:.3, ink:'var(--net)', w:2.6 });
  s += T(125, 196, 'Load', 'bg-l') + T(125, 218, 'balancer', 'bg-l');
  s += T(125, 250, 'the IP that DNS', 'bg-s') + T(125, 268, 'gave you belongs', 'bg-s') + T(125, 286, 'to this, not a server', 'bg-s');
  var inn = [[0,245],[30,245],[60,245]];
  s += wob(inn, { c:'var(--net)', w:4 }) + flow(inn, 'var(--c-red)', 3.6, 0, 8);
  for(var r = 0; r < 3; r++){
    var y = 110 + r*106;
    for(var c = 0; c < 5; c++){
      var x = 250 + c*104;
      s += rect(x, y, 88, 84, 4, { fill:'var(--core-bg)', shade:'var(--core)', op:.24, ink:'var(--core)', w:1.8 });
      for(var u = 0; u < 4; u++){
        s += '<rect x="'+(x+10)+'" y="'+(y+10+u*18)+'" width="68" height="12" rx="2" fill="var(--paper)" opacity=".55" stroke="var(--ink)" stroke-width=".8"/>';
        s += '<circle cx="'+(x+18)+'" cy="'+(y+16+u*18)+'" r="2.4" class="blink" style="--dly:'+(((r+c+u)%7)*0.2)+'s" fill="var(--c-green)"/>';
      }
    }
  }
  [[152,'var(--c-green)',0],[258,'var(--c-yellow)',1.2],[364,'var(--c-orange)',2.4]].forEach(function(t, i){
    s += '<g class="fadecyc" style="--dly:'+t[2]+'s">'+wob([[190,245],[220,t[0]],[250,t[0]]], { c:t[1], w:3.4 })+'</g>';
    s += flow([[0,245],[60,245],[190,245],[220,t[0]],[250,t[0]]], t[1], 3.6, t[2], 6);
  });
  s += T(520, 444, 'you never learn which machine answered — and if it dies mid-video, another takes over', 'bg-t');
  return stage('The room at the other end', s,
    'A datacentre floor of racks with blinking servers, fronted by a load balancer that sends each arriving request to whichever machine is healthy.',
    '<b>One address, thousands of machines.</b> Servers have permanent addresses and wait; clients have temporary ones and initiate. That asymmetry is why you can reach Google but Google cannot reach you — the same asymmetry your carrier NAT deepens at your end.');
})();

/* ── three distances ────────────────────────────────────── */
B.origin = (function(){
  var s = T(30, 44, 'Bandwidth is how wide the pipe is. This is how long it is.', 'bg-h', 'start');
  var rows = [['Cached inside Airtel', '8 ms', 'var(--c-green)', 1.0, 'a rack in Mumbai'],
              ['Google’s Indian region', '30 ms', 'var(--c-yellow)', 2.4, 'across the exchange'],
              ['Oregon, over a cable', '220 ms', 'var(--c-red)', 7.2, '~20,000 km of glass']];
  rows.forEach(function(r, i){
    var y = 130 + i*110;
    s += T(30, y-24, r[0], 'bg-l', 'start') + T(30, y+34, r[4], 'bg-s', 'start');
    s += rect(30, y-6, 700, 26, 13, { fill:'var(--paper-3)', shade:'var(--ink)', op:.08, w:1.6 });
    s += wob([[44,y+7],[716,y+7]], { c:r[2], w:2, op:.3, amp:0 });
    s += flow([[44,y+7],[716,y+7]], r[2], r[3], 0, 9);
    s += T(790, y+12, r[1], 'bg-h', 'end');
  });
  s += wob([[30,420],[790,420]], { c:'var(--ink)', w:2, op:.3, amp:0 });
  s += T(30, 448, 'Same starting line. Same picture. Upgrading your plan moves none of these three numbers.', 'bg-t hot', 'start');
  s += T(410, 86, 'three packets, released together', 'bg-s');
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
