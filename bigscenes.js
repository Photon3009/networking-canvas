/* bigscenes.js — full-scale scenes: the physical world your packets move through. */
(function(){
'use strict';
var S = window.SK, N = 20000;
function sd(){ return (N += 17); }
var DEFS = '';

function bx(x,y,w,h){ return {x:x,y:y,w:w,h:h}; }
function tex(d, box, o){
  o = o || {};
  var r = S.shape(d, box, { fill:o.fill, fillOp:o.fillOp, shade:o.shade, shadeAngle:o.ang, gap:o.gap||5,
    shadeOp:o.op===undefined?.3:o.op, shade2:o.shade2, shade2Op:o.op2, tooth:o.tooth, toothN:o.toothN,
    toothOp:o.toothOp, dots:o.dots, dotsN:o.dotsN, dotR:o.dotR, seed:sd(), w:o.w||2,
    inkColor:o.ink, inkOp:o.inkOp, dash:o.dash });
  return r.svg;
}
function rect(x,y,w,h,r,o){ return tex(S.d(S.rrect(x,y,w,h,r===undefined?6:r), true, 1.2, sd()), bx(x,y,w,h), o); }
function T(x,y,t,cls,anchor){ return '<text x="'+x+'" y="'+y+'" class="'+(cls||'bg-t')+'" text-anchor="'+(anchor||'middle')+'">'+t+'</text>'; }
function wob(pts, o){
  o = o || {};
  return '<path d="'+S.ds(pts, false, o.amp===undefined?2:o.amp, sd())+'" fill="none" stroke="'+(o.c||'var(--ink)')+
    '" stroke-width="'+(o.w||2.4)+'" opacity="'+(o.op===undefined?.8:o.op)+'" stroke-linecap="round"'+
    (o.dash?' stroke-dasharray="'+o.dash+'"':'')+(o.cls?' class="'+o.cls+'"':'')+(o.st?' style="'+o.st+'"':'')+'/>';
}
function flow(pts, color, dur, dly, r, cls){
  var d = S.ds(pts, false, 1.6, sd());
  return '<circle class="mv '+(cls||'')+'" r="'+(r||7)+'" cx="0" cy="0" fill="'+color+'" stroke="var(--paper)" '+
    'stroke-width="2" style="offset-path:path(\''+d+'\');--dur:'+dur+'s;--dly:'+(dly||0)+'s"/>';
}
function stage(title, inner, aria, cap){
  var f = '<figure class="sc zoom" data-title="'+title+'"><span class="zhint">tap to enlarge</span>'+
    '<div class="figscroll"><svg viewBox="0 0 820 470" role="img" style="min-width:620px" aria-label="'+aria+'">'+
    '<defs>'+DEFS+'</defs>'+inner+'</svg></div><figcaption>'+cap+'</figcaption></figure>';
  DEFS = '';
  return f;
}
var B = {};

/* ── inside the tap ─────────────────────────────────────── */
B.phone = (function(){
  var s = rect(40, 30, 250, 410, 26, { fill:'var(--c-tan)', shade:'var(--c-brown)', op:.28, gap:6, w:3 });
  var bands = [['The app', 'GET /watch?v=abc', 'net', 60], ['+ TCP header', 'port 51343 \u2192 443', 'core', 148],
               ['+ IP header', '192.168.1.7 \u2192 142.250.\u2026', 'access', 236], ['+ Wi-Fi header', 'to the router\u2019s MAC', 'home', 324]];
  bands.forEach(function(b, i){
    s += rect(62, b[3], 206, 70, 8, { fill:'var(--'+b[2]+'-bg)', shade:'var(--'+b[2]+')', op:.3, gap:5,
      ink:'var(--'+b[2]+')', w:2 });
    s += T(165, b[3]+28, b[0], 'bg-l') + T(165, b[3]+47, b[1], 'bg-s');
    s += '<rect x="'+(72+i*46)+'" y="'+(b[3]+54)+'" width="'+(40)+'" height="9" rx="3" fill="var(--'+b[2]+')" opacity=".75"/>';
  });
  s += flow([[165,72],[165,410]], 'var(--c-red)', 4.4, 0, 8);
  s += T(165, 460, 'each layer adds its own envelope, never opening the one above', 'bg-s');
  var wave = [[300,360],[360,352],[430,344],[520,336],[620,330],[720,326]];
  s += wob(wave, { c:'var(--c-green)', w:3, dash:'10 8' });
  s += flow(wave, 'var(--c-green)', 2.6, 0.4, 7);
  [1,2,3].forEach(function(k){
    s += '<path class="pulse" style="--dly:'+(k*0.4)+'s" d="M'+(310+k*4)+' '+(360-k*26)+' A '+(k*30)+' '+(k*30)+
      ' 0 0 1 '+(310+k*4)+' '+(360+k*26)+'" fill="none" stroke="var(--c-green)" stroke-width="'+(3-k*0.5)+'" opacity="'+(0.9-k*0.2)+'"/>';
  });
  s += rect(600, 180, 190, 120, 10, { fill:'var(--home-bg)', shade:'var(--home)', op:.28, ink:'var(--home)' });
  s += T(695, 226, 'The router', 'bg-l') + T(695, 248, '192.168.1.1', 'bg-s');
  s += wob([[700,300],[698,330],[720,336]], { c:'var(--home)', w:2, op:.6 });
  s += T(520, 300, 'now it is radio', 'bg-t ok');
  s += T(420, 60, 'One tap, four envelopes, then air', 'bg-h', 'start');
  s += T(420, 84, 'nothing here is metaphor \u2014 these headers are real bytes,', 'bg-t', 'start');
  s += T(420, 102, 'about 60 of them riding with every single packet', 'bg-t', 'start');
  return stage('Inside one tap', s,
    'A phone cut open: the request gains a TCP, then IP, then Wi-Fi header as it descends, then leaves as radio toward the router.',
    '<b>Encapsulation, where it actually happens.</b> Your request starts as one sentence and picks up an envelope at every layer on the way down your own phone \u2014 before a single bit has left the building. The router will strip the outermost one and write a new one for the next hop.');
})();

/* ── your flat, in radio ────────────────────────────────── */
B.wifi = (function(){
  var s = rect(30, 40, 760, 380, 4, { fill:'var(--paper-3)', shade:'var(--ink)', op:.08, gap:9, w:3, dash:'6 9' });
  [[30,190,420,190],[420,40,420,250],[420,250,790,250],[180,250,180,420],[600,250,600,420]].forEach(function(w){
    s += wob([[w[0],w[1]],[w[2],w[3]]], { c:'var(--ink)', w:5, op:.5, amp:1.4 });
  });
  var rooms = [['Living room',225,120],['Bedroom',610,150],['Kitchen',105,330],['Study',390,330],['Balcony',700,330]];
  rooms.forEach(function(r){ s += T(r[1], r[2], r[0], 'bg-s'); });
  var rx = 250, ry = 190;
  [[250,'var(--c-orange)','2.4 GHz \u00b7 reaches the whole flat'],[140,'var(--c-green)','5 GHz \u00b7 fast, but stops at the walls']].forEach(function(c, i){
    var pts = S.blob(rx, ry, c[0], c[0]*0.62, 22, .1, sd());
    var d = S.d(pts, true, 3, sd()), cl = S.clip(d); DEFS += cl.def;
    var flat = S.clip(S.d(S.rrect(30, 40, 760, 380, 4), true, 1, 777)); DEFS += flat.def;
    s += '<g clip-path="url(#'+flat.id+')">';
    s += '<path class="breathe" d="'+d+'" fill="'+c[1]+'" opacity=".16"/>';
    s += S.hatch(cl.id, bx(rx-c[0], ry-c[0], c[0]*2, c[0]*2), i ? 40 : -30, 11, c[1], 1, .3, sd(), '6 8');
    s += '<path d="'+d+'" fill="none" stroke="'+c[1]+'" stroke-width="2.4" opacity=".7" stroke-dasharray="9 7"/>';
    s += '</g>';
  });
  s += rect(rx-34, ry-22, 68, 44, 7, { fill:'var(--home-bg)', shade:'var(--home)', op:.3, ink:'var(--home)' });
  s += T(rx, ry+5, 'router', 'bg-s');
  var dev = [[330,110,'phone','5 GHz \u00b7 full speed','ok','var(--c-green)'],
             [615,180,'TV','2.4 GHz only \u00b7 slow','hot','var(--c-orange)'],
             [95,360,'laptop','two walls \u00b7 weak','hot','var(--c-red)'],
             [700,370,'speaker','out of range','hot','var(--c-red)']];
  dev.forEach(function(v, i){
    s += rect(v[0]-30, v[1]-16, 60, 32, 5, { fill:'var(--paper)', shade:v[5], op:.26, ink:v[5], w:1.8 });
    s += T(v[0], v[1]+4, v[2], 'bg-s');
    s += T(v[0], v[1]+31, v[3], 'bg-s ' + v[4], i === 3 ? 'end' : 'middle');
    s += wob([[rx,ry],[v[0],v[1]]], { c:v[5], w:1.8, op:.45, dash:'5 7' });
  });
  s += T(786, 452, 'the speaker keeps dropping \u2014 not the plan\u2019s fault', 'bg-s hot', 'end');
  s += T(30, 30, 'The same router, four very different experiences', 'bg-h', 'start');
  return stage('Your flat, in radio', s,
    'A floor plan of a flat showing the router and two coverage areas: a large 2.4 GHz zone reaching every room and a small fast 5 GHz zone, with devices marked by the quality they get.',
    '<b>Wi-Fi problems are geometry problems.</b> Higher frequency always means more speed and less reach, so 5 GHz dies at the second wall while 2.4 GHz crawls everywhere. Before blaming Airtel, move the router somewhere high, central and out in the open \u2014 it changes this picture more than any plan upgrade.');
})();

/* ── four machines in one plastic case ──────────────────── */
B.router = (function(){
  var s = rect(70, 70, 680, 300, 16, { fill:'var(--paper-3)', shade:'var(--ink)', op:.1, gap:8, w:3.5 });
  var parts = [['ONT','light \u2192 electricity','access',110],['Router + NAT','rewrites every packet','core',280],
               ['Switch','learns which port','home',450],['Wi-Fi AP','the radio','home',620]];
  parts.forEach(function(p, i){
    s += rect(p[3]-58, 130, 116, 180, 9, { fill:'var(--'+p[2]+'-bg)', shade:'var(--'+p[2]+')', op:.3,
      ink:'var(--'+p[2]+')', w:2.2 });
    s += T(p[3], 175, String(i+1), 'bg-h');
    s += T(p[3], 208, p[0], 'bg-l') + T(p[3], 232, p[1], 'bg-s');
  });
  var line = [[10,220],[52,220],[110,220]];
  s += wob(line, { c:'var(--c-orange)', w:4 });
  s += T(28, 200, 'fibre in', 'bg-s');
  var route = [[10,220],[110,220],[280,220],[450,220],[620,220],[760,220]];
  s += flow(route, 'var(--c-red)', 5, 0, 8);
  s += wob([[678,220],[760,220]], { c:'var(--home)', w:3 });
  [1,2,3].forEach(function(k){
    s += '<path class="pulse" style="--dly:'+(k*0.35)+'s" d="M'+(700+k*10)+' '+(220-k*22)+' A '+(k*26)+' '+(k*26)+
      ' 0 0 1 '+(700+k*10)+' '+(220+k*22)+'" fill="none" stroke="var(--home)" stroke-width="'+(2.8-k*0.4)+'" opacity="'+(0.85-k*0.2)+'"/>';
  });
  [0,1,2,3].forEach(function(i){
    s += rect(430+i*30, 320, 22, 30, 3, { fill:'var(--c-yellow)', fillOp:.7, ink:'var(--ink)', w:1.6 });
  });
  s += T(475, 368, 'the four yellow LAN ports', 'bg-s');
  s += T(70, 50, 'It is not one device. It is four, sharing a case.', 'bg-h', 'start');
  s += T(750, 420, 'and if your plan has a landline, a fifth: a VoIP box', 'bg-s', 'end');
  return stage('Four machines, one case', s,
    'The home router opened up, showing four separate machines in a row: the optical terminal, the router doing NAT, the switch, and the Wi-Fi access point, with a packet travelling through all of them.',
    '<b>Almost every home-networking confusion comes from treating this as one thing.</b> When Wi-Fi is bad, only box 4 is at fault. When the red internet light is on, it is box 1. When port forwarding fails, it is box 2 \u2014 and, on Airtel, a second NAT further upstream that you do not own.');
})();

/* ── how a switch learns ────────────────────────────────── */
B.tv = (function(){
  var s = rect(300, 150, 220, 150, 10, { fill:'var(--home-bg)', shade:'var(--home)', op:.28, ink:'var(--home)', w:2.6 });
  s += T(410, 192, 'The switch', 'bg-l') + T(410, 214, 'inside your router', 'bg-s');
  var ports = [[120,90,'Phone'],[120,360,'Laptop'],[700,90,'Smart TV'],[700,360,'Console']];
  ports.forEach(function(p, i){
    s += rect(p[0]-62, p[1]-30, 124, 60, 7, { fill:'var(--paper)', shade:'var(--home)', op:.2, ink:'var(--home)', w:2 });
    s += T(p[0], p[1]+5, p[2], 'bg-l');
    s += wob([[p[0] < 400 ? p[0]+62 : p[0]-62, p[1]],[410, 225]], { c:'var(--ink-3)', w:2, op:.4 });
  });
  var flood = [[120,90],[410,225]];
  s += flow(flood, 'var(--c-red)', 6, 0, 7);
  [[700,90],[120,360],[700,360]].forEach(function(p, i){
    s += '<g class="fadecyc" style="--dly:'+(1.4 + i*0.12)+'s">'+
      wob([[410,225],[p[0] < 400 ? p[0]+62 : p[0]-62, p[1]]], { c:'var(--c-red)', w:2.6, dash:'6 6' })+'</g>';
  });
  s += '<g class="fadecyc" style="--dly:3.2s">'+wob([[410,225],[638,90]], { c:'var(--c-green)', w:3.4 })+'</g>';
  s += rect(300, 330, 220, 108, 8, { fill:'var(--paper-3)', shade:'var(--ink)', op:.1, w:2 });
  s += T(410, 354, 'what it has learned', 'bg-s');
  s += '<g class="fadecyc" style="--dly:3.2s">'+T(410, 380, '3c:5a:b4:\u2026 \u2192 port 3', 'bg-t ok')+'</g>';
  s += '<g class="fadecyc" style="--dly:3.4s">'+T(410, 404, 'a4:11:9f:\u2026 \u2192 port 1', 'bg-t ok')+'</g>';
  s += T(410, 428, 'built by watching, not by configuration', 'bg-s');
  s += T(30, 44, 'Step 1 \u00b7 unknown address? shout down every corridor', 'bg-t hot', 'start');
  s += T(30, 66, 'Step 2 \u00b7 hear the reply, write it down, never shout again', 'bg-t ok', 'start');
  return stage('How a switch learns', s,
    'A switch floods an unknown frame to every port, hears the reply, records which port that address is on, and afterwards sends straight there.',
    '<b>The most self-sufficient device in networking.</b> Plug it in, configure nothing, and within seconds it knows the topology of everything attached \u2014 purely by noticing who answered from where. A frame between your phone and your TV never leaves this box.');
})();


/* ── copper against air ─────────────────────────────────── */
B.laptop = (function(){
  var s = T(30, 44, 'Same router, same plan — one wire, one room of air', 'bg-h', 'start');
  s += wob([[410,70],[410,440]], { c:'var(--ink-3)', w:2, op:.45, dash:'7 8', amp:0 });
  s += rect(50, 100, 300, 300, 10, { fill:'var(--home-bg)', shade:'var(--home)', op:.16, gap:8, ink:'var(--home)' });
  s += T(200, 132, 'Cat-6 cable', 'bg-l') + T(200, 154, 'a private corridor', 'bg-s ok');
  [0,1,2,3].forEach(function(k){
    var y = 210 + k*18;
    s += wob([[80,y],[140,y-6],[200,y+6],[260,y-6],[320,y]], { c:['var(--c-orange)','var(--c-green)','var(--c-blue)','var(--c-brown)'][k], w:3, op:.75, amp:1 });
  });
  s += flow([[80,300],[320,300]], 'var(--c-green)', 2, 0, 7);
  s += flow([[320,326],[80,326]], 'var(--c-green)', 2, 0, 7);
  s += T(200, 366, 'send and receive at the same instant', 'bg-t ok');
  s += rect(470, 100, 300, 300, 10, { fill:'var(--access-bg)', shade:'var(--access)', op:.16, gap:8, ink:'var(--access)' });
  s += T(620, 132, 'Wi-Fi', 'bg-l') + T(620, 154, 'one crowded room', 'bg-s hot');
  [1,2,3,4].forEach(function(k){
    s += '<path class="pulse" style="--dly:'+(k*0.3)+'s" d="M'+(520)+' '+(280-k*20)+' A '+(k*24)+' '+(k*24)+
      ' 0 0 1 '+(520)+' '+(280+k*20)+'" fill="none" stroke="var(--c-orange)" stroke-width="'+(3-k*0.4)+'" opacity="'+(0.8-k*0.15)+'"/>';
  });
  s += flow([[540,300],[740,300]], 'var(--c-orange)', 3.6, 0, 7);
  s += flow([[540,300],[740,300]], 'var(--c-orange)', 3.6, 1.8, 7);
  s += T(620, 340, 'your neighbour’s router is in this room too', 'bg-s');
  s += T(620, 366, 'everything queues — the router included', 'bg-t hot');
  s += T(410, 434, 'this is why a speed test on cable is the only honest one', 'bg-s');
  return stage('Copper against air', s,
    'Side by side: a cable carrying traffic in both directions at once, and Wi-Fi where every station including the router must take turns.',
    '<b>Before you complain about your line, test it on a cable.</b> If the wire gives your full plan speed and Wi-Fi does not, the fibre is fine and your radio environment is the bottleneck. That single test settles most "Airtel is slow" arguments.');
})();

/* ── the mobile core is a building ──────────────────────── */
B.mcore = (function(){
  var s = rect(230, 60, 560, 360, 12, { fill:'var(--paper-3)', shade:'var(--ink)', op:.08, gap:9, w:3.2 });
  s += T(510, 92, 'The operator’s core — often hundreds of km from you', 'bg-s');
  s += rect(260, 110, 240, 140, 9, { fill:'var(--core-bg)', shade:'var(--core)', op:.3, ink:'var(--core)' });
  s += T(380, 146, 'Control plane', 'bg-l') + T(380, 168, 'AMF · SMF', 'bg-s');
  s += T(380, 196, 'who are you, what did', 'bg-s') + T(380, 212, 'you pay for, log it', 'bg-s');
  s += rect(260, 280, 240, 110, 9, { fill:'var(--access-bg)', shade:'var(--access)', op:.3, ink:'var(--access)' });
  s += T(380, 316, 'User plane', 'bg-l') + T(380, 338, 'UPF — your actual packets', 'bg-s');
  s += T(380, 366, 'never touches the hall above', 'bg-s hot');
  s += rect(40, 250, 150, 110, 9, { fill:'var(--access-bg)', shade:'var(--access)', op:.24, ink:'var(--access)' });
  s += T(115, 296, 'The tower', 'bg-l') + T(115, 318, 'just a radio', 'bg-s');
  var ctl = [[190,280],[230,200],[260,180]];
  s += wob(ctl, { c:'var(--core)', w:2.4, dash:'7 6' }) + flow(ctl, 'var(--c-yellow)', 4.4, 0, 6);
  var usr = [[190,330],[240,335],[260,335]];
  s += wob(usr, { c:'var(--access)', w:3 }) + flow(usr, 'var(--c-red)', 3, 0, 7);
  var out = [[500,335],[600,335],[700,335]];
  s += wob(out, { c:'var(--net)', w:3 }) + flow(out, 'var(--c-red)', 3, 1, 7);
  s += rect(700, 300, 90, 70, 8, { fill:'var(--net-bg)', shade:'var(--net)', op:.3, ink:'var(--net)' });
  s += T(745, 342, 'internet', 'bg-s');
  s += T(200, 170, 'signalling', 'bg-s') + T(205, 372, 'your data', 'bg-s hot');
  s += T(30, 44, 'Head office, and the corridor your data actually uses', 'bg-h', 'start');
  s += T(790, 440, 'your SIM holds the secret that proves you to the hall above', 'bg-s', 'end');
  return stage('The core, split in two', s,
    'A mobile core building with two separate halls: a control plane handling identity and billing, and a user plane that carries the data straight through to the internet.',
    '<b>Two planes, and only one of them ever sees your bytes.</b> Separating them is the whole point of the 5G core — the data hall can be pushed out to the edge of the network for low latency while identity and billing stay central.');
})();

/* ── your street, in fibre ──────────────────────────────── */
B.splitter = (function(){
  var s = rect(0, 300, 820, 170, 0, { fill:'var(--c-green)', fillOp:.12, shade:'var(--c-green)', op:.2, gap:10, ink:'none', inkOp:0, w:0 });
  s += rect(0, 336, 820, 74, 0, { fill:'var(--paper-3)', shade:'var(--ink)', op:.1, gap:7, w:0, ink:'none', inkOp:0 });
  s += wob([[0,373],[820,373]], { c:'var(--paper)', w:3, dash:'26 22', op:.9, amp:1 });
  var homes = [[26,118],[122,86],[218,126],[314,96]];
  homes.forEach(function(h, i){
    var mine = i === 2;
    s += rect(h[0], h[1], 84, 336-h[1], 4, { fill: mine ? 'var(--home-bg)' : 'var(--paper-3)',
      shade: mine ? 'var(--home)' : 'var(--ink)', op: mine ? .3 : .12, gap:7, w:2.4,
      ink: mine ? 'var(--home)' : undefined });
    for(var r = 0; r < 3; r++) for(var c = 0; c < 2; c++){
      var wy = h[1]+30+r*54;
      if(wy + 30 > 330) continue;
      s += '<rect x="'+(h[0]+14+c*32)+'" y="'+wy+'" width="22" height="28" rx="2" fill="var(--c-yellow)" opacity="'+(mine?.8:.4)+'"/>';
    }
    if(mine) s += T(h[0]+42, h[1]-14, 'your flat', 'bg-t ok');
  });
  s += rect(612, 150, 190, 186, 6, { fill:'var(--access-bg)', shade:'var(--access)', op:.28, ink:'var(--access)', w:2.8 });
  s += T(707, 186, 'The exchange', 'bg-l') + T(707, 210, '2\u20138 km away', 'bg-s');
  s += T(707, 242, 'OLT racks live here', 'bg-s');
  var px = 486;
  s += wob([[px,336],[px,236]], { c:'var(--ink)', w:5, op:.75, amp:1 });
  s += rect(px-30, 188, 60, 50, 5, { fill:'var(--c-green)', fillOp:.78, shade:'var(--ink)', op:.2, ink:'var(--ink)', w:2.4 });
  s += T(px, 218, '1 : 32', 'bg-l');
  s += T(px, 172, 'the splitter', 'bg-t') + T(px, 156, 'no power, no brain', 'bg-s');
  var trunk = [[612,352],[560,354],[510,352],[px,350]];
  s += wob(trunk, { c:'var(--c-orange)', w:5 });
  s += flow(trunk.slice().reverse(), 'var(--c-orange)', 3.2, 0, 7);
  s += T(556, 386, 'one fibre, from the exchange', 'bg-s');
  homes.forEach(function(h, i){
    var tx = h[0] + 42, ty = h[1] + 18;
    var d = [[px-26, 206], [(px + tx)/2, 150 + i*10], [tx, ty]];
    s += wob(d, { c:'var(--c-orange)', w:2, op:.7 });
    s += flow(d, 'var(--c-orange)', 3.2, 0.5 + i*0.55, 5);
    s += '<circle cx="'+tx+'" cy="'+ty+'" r="4" fill="var(--c-orange)"/>';
  });
  s += T(410, 440, 'one fibre from the exchange, split 32 ways on your street \u2014 and your neighbours are, physically, on your wire', 'bg-t');
  s += T(30, 44, 'The bit of the internet you walk past every day', 'bg-h', 'start');
  return stage('Your street, in fibre', s,
    'A street with houses, a pole carrying a passive optical splitter, one trunk fibre running to the exchange, and drop fibres fanning out to each home in turn.',
    '<b>This is GPON, and it is mostly not electronic.</b> One expensive fibre runs from the exchange to your locality; a sealed box with no power supply splits its light 32 ways. That is why fibre broadband got cheap enough to sell to every flat \u2014 and why a cut between the splitter and the exchange takes out exactly your 32 neighbours at once.');
})();

/* ── inside the exchange ────────────────────────────────── */
B.olt = (function(){
  var s = rect(30, 60, 760, 380, 8, { fill:'var(--paper-3)', shade:'var(--ink)', op:.08, gap:10, w:3.2 });
  s += T(30, 44, 'A room in a building in your city, with your name in it', 'bg-h', 'start');
  [0,1,2].forEach(function(r){
    var x = 80 + r*150;
    s += rect(x, 110, 110, 280, 5, { fill:'var(--access-bg)', shade:'var(--access)', op:.26, ink:'var(--access)', w:2.4 });
    for(var i = 0; i < 8; i++){
      var y = 126 + i*32;
      s += '<rect x="'+(x+10)+'" y="'+y+'" width="90" height="22" rx="2" fill="var(--paper)" opacity=".5" stroke="var(--ink)" stroke-width="1"/>';
      s += '<circle cx="'+(x+20)+'" cy="'+(y+11)+'" r="3" class="blink" style="--dly:'+((i+r)*0.18)+'s" fill="'+((i+r)%3 ? 'var(--c-green)' : 'var(--c-red)')+'"/>';
      s += '<circle cx="'+(x+30)+'" cy="'+(y+11)+'" r="3" fill="var(--c-yellow)" opacity=".8"/>';
    }
    s += T(x+55, 406, 'OLT shelf ' + (r+1), 'bg-s');
  });
  for(var k = 0; k < 6; k++){
    var y = 150 + k*44;
    s += wob([[0,y+30],[50,y+10],[80,y]], { c:'var(--c-orange)', w:2.4, op:.7 });
    s += flow([[0,y+30],[50,y+10],[80,y]], 'var(--c-orange)', 2.8, k*0.22, 5);
  }
  s += T(24, 96, 'from 32 streets', 'bg-s', 'start');
  s += rect(560, 150, 200, 200, 8, { fill:'var(--core-bg)', shade:'var(--core)', op:.28, ink:'var(--core)' });
  s += T(660, 196, 'Uplink', 'bg-l') + T(660, 220, '10G / 100G', 'bg-s');
  s += T(660, 252, 'to Airtel’s backbone', 'bg-s');
  var up = [[490,250],[540,250],[560,250]];
  s += wob(up, { c:'var(--core)', w:4 }) + flow(up, 'var(--c-red)', 2.4, 1.2, 7);
  s += T(660, 310, 'ranging: it measures the exact', 'bg-s') + T(660, 326, 'distance to every home', 'bg-s');
  s += T(790, 436, 'when support says "an outage in your area", they usually mean this room', 'bg-s', 'end');
  return stage('Inside the exchange', s,
    'Rows of OLT shelves with blinking line cards, fibres arriving from surrounding streets and a single fast uplink leaving for the operator backbone.',
    '<b>The first Airtel machine with a power cable.</b> Light arrives from your street and becomes ordinary packets here, then hundreds of subscribers are aggregated onto one uplink. Your 4 km of fibre cost about 20 microseconds — irrelevant next to what comes later.');
})();

window.BIGSCENES = B;
})();
