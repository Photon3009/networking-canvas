/* bigscenes.js — full-scale scenes: the physical world your packets move through.
   Crisp shapes, tinted panels and the ISO kit (iso.js) for anything physical, so the
   objects here match the map icons in art.js. Every colour comes from a CSS variable. */
(function(){
'use strict';
var S = window.SK, I = window.ISO, A = window.ART, N = 20000, UID = 0;
function sd(){ return (N += 17); }
var DEFS = '', PAT = {};

var DEV = 'var(--dev)', DARK = 'var(--iso-dark)', SCR = 'var(--scr)';
var RED = 'var(--c-red)', ORANGE = 'var(--c-orange)', GREEN = 'var(--c-green)', YELLOW = 'var(--c-yellow)';
var BLUE = 'var(--c-blue)', BROWN = 'var(--c-brown)';
var HALO = 'paint-order:stroke;stroke:var(--paper);stroke-width:4px;stroke-linejoin:round';

/* ── small kit ──────────────────────────────────────────── */
function f(n){ return Math.round(n*10)/10; }
/* a halftone dot tile in one colour, shared by every shape in the scene that asks for it */
function dots(c, g){
  g = g || 4;
  var k = c+'|'+g;
  if(!PAT[k]){
    PAT[k] = 'bsd'+(++UID);
    DEFS += '<pattern id="'+PAT[k]+'" width="'+g+'" height="'+g+'" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">'+
      '<circle cx="'+g/2+'" cy="'+g/2+'" r="'+f(g*.2)+'" fill="'+c+'"/></pattern>';
  }
  return 'url(#'+PAT[k]+')';
}
/* a tinted, rounded panel: fill, optional halftone, hairline edge */
function panel(x, y, w, h, o){
  o = o || {};
  var a = ' x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="'+(o.r === undefined ? 12 : o.r)+'"';
  var s = '<rect'+a+' fill="'+(o.fill || 'var(--paper-2)')+'"'+(o.fop !== undefined ? ' fill-opacity="'+o.fop+'"' : '')+'/>';
  if(o.ht) s += '<rect'+a+' fill="'+dots(o.htc || o.stroke || 'var(--ink)', o.g)+'" opacity="'+o.ht+'"/>';
  if(o.stroke !== false) s += '<rect'+a+' fill="none" stroke="'+(o.stroke || 'var(--border-2)')+'" stroke-width="'+(o.sw || 1.4)+'"'+
    (o.dash ? ' stroke-dasharray="'+o.dash+'"' : '')+(o.sop !== undefined ? ' stroke-opacity="'+o.sop+'"' : '')+'/>';
  return s;
}
function T(x, y, t, cls, anchor, st){
  return '<text x="'+f(x)+'" y="'+f(y)+'" class="'+(cls || 'bg-t')+'" text-anchor="'+(anchor || 'middle')+'"'+
    (st ? ' style="'+st+'"' : '')+'>'+t+'</text>';
}
/* text with a paper-coloured halo, for labels that sit over artwork */
function TH(x, y, t, cls, anchor, st){ return T(x, y, t, cls, anchor, HALO+(st ? ';'+st : '')); }
function title(h, sub){
  return T(36, 46, h, 'bg-h', 'start') + (sub ? T(36, 68, sub, 'bg-t', 'start') : '');
}
function poly(pts){ return 'M'+pts.map(function(p){ return f(p[0])+' '+f(p[1]); }).join('L'); }
function ln(pts, o){
  o = o || {};
  return '<path d="'+(o.smooth ? S.ds(pts, false, 0, 1) : poly(pts))+'" fill="none" stroke="'+(o.c || 'var(--ink)')+
    '" stroke-width="'+(o.w || 2)+'" stroke-linecap="'+(o.cap || 'round')+'" stroke-linejoin="round"'+
    (o.op !== undefined ? ' opacity="'+o.op+'"' : '')+(o.dash ? ' stroke-dasharray="'+o.dash+'"' : '')+'/>';
}
/* a cable: dark casing under a coloured core, as in the map icons */
function wire(pts, c, w, smooth){
  return ln(pts, { c:'var(--iso-line)', w:(w || 3)+2, smooth:smooth }) + ln(pts, { c:c, w:w || 3, smooth:smooth });
}
function flow(pts, color, dur, dly, r, cls){
  var d = S.ds(pts, false, 0, sd());
  return '<circle class="mv '+(cls || '')+'" r="'+(r || 7)+'" cx="0" cy="0" fill="'+color+'" stroke="var(--paper)" '+
    'stroke-width="2" style="offset-path:path(\''+d+'\');--dur:'+dur+'s;--dly:'+(dly || 0)+'s"/>';
}
/* radio arcs fanning out from (cx, cy) toward angle ang (degrees, 0 = right) */
function arcs(cx, cy, ang, c, n, r0, dr, spread, w){
  var s = '', k;
  for(k = 0; k < n; k++){
    var r = r0 + dr*k, a0 = (ang - spread)*Math.PI/180, a1 = (ang + spread)*Math.PI/180;
    s += '<g class="pulse" style="--dly:'+f(k*0.35)+'s"><path d="M'+f(cx+Math.cos(a0)*r)+' '+f(cy+Math.sin(a0)*r)+
      'A'+r+' '+r+' 0 0 1 '+f(cx+Math.cos(a1)*r)+' '+f(cy+Math.sin(a1)*r)+'" fill="none" stroke="'+c+
      '" stroke-width="'+f((w || 3) - k*0.5)+'" stroke-linecap="round" opacity="'+f(0.95 - k*0.2)+'"/></g>';
  }
  return s;
}
/* one of the map's isometric icons (drawn into a 160 × 112 box), centred on (cx, cy) at scale k */
function icon(name, cx, cy, k, op){
  return '<g transform="translate('+f(cx-80*k)+' '+f(cy-56*k)+') scale('+k+')"'+(op !== undefined ? ' opacity="'+op+'"' : '')+'>'+
    A[name]()+'</g>';
}
/* a two-line tag on a paper chip: name above, status below */
function tag(x, y, name, status, cls){
  var w = Math.max(name.length*7.4, status.length*6.7) + 22;
  return panel(f(x-w/2), y, f(w), 40, { fill:'var(--paper)', stroke:'var(--border-2)', sw:1, r:8 }) +
    T(x, y+16, name, 'bg-l', 'middle', 'font-size:12.5px') + T(x, y+32, status, 'bg-t '+(cls || ''));
}
function stage(title, inner, aria, cap){
  var fg = '<figure class="sc zoom" data-title="'+title+'"><span class="zhint">tap to enlarge</span>'+
    '<div class="figscroll"><svg viewBox="0 0 820 470" role="img" style="min-width:560px" aria-label="'+aria+'">'+
    '<defs>'+DEFS+'</defs>'+inner+'</svg></div><figcaption>'+cap+'</figcaption></figure>';
  DEFS = ''; PAT = {};
  return fg;
}
var B = {};

/* ── inside the tap ─────────────────────────────────────── */
B.phone = (function(){
  var s = title('One tap, four envelopes, then air',
    'nothing here is metaphor \u2014 these headers are real bytes, about 60 of them on every packet');
  /* the phone, face on, with a little depth to its edge */
  s += '<rect x="51" y="99" width="250" height="356" rx="34" fill="'+I.lit(DARK, -30)+'"/>';
  s += '<rect x="44" y="92" width="250" height="356" rx="34" fill="'+DARK+'"/>';
  s += '<rect x="44.7" y="92.7" width="248.6" height="354.6" rx="33.3" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="1.4"/>';
  s += '<rect x="56" y="104" width="226" height="332" rx="24" fill="'+SCR+'"/>';
  s += '<rect x="145" y="112" width="48" height="8" rx="4" fill="'+DARK+'"/>';
  var bands = [['The app', 'GET /watch?v=abc', 'net'], ['+ TCP header', 'port 51343 \u2192 443', 'core'],
               ['+ IP header', '192.168.1.7 \u2192 142.250.\u2026', 'access'], ['+ Wi-Fi header', 'to the router\u2019s MAC', 'home']];
  bands.forEach(function(b, i){
    var y = 130 + i*76;
    s += panel(66, y, 206, 66, { fill:'var(--'+b[2]+'-bg)', stroke:'var(--'+b[2]+')', sw:1.2, r:10 });
    s += T(80, y+21, b[0], 'bg-l', 'start') + T(80, y+37, b[1], 'bg-t', 'start');
    /* the packet so far: the newest envelope is the leftmost block */
    var x = 258 - 60;
    s += '<rect x="'+x+'" y="'+(y+46)+'" width="60" height="10" rx="3" fill="var(--net)"/>';
    for(var k = 1; k <= i; k++){
      x -= 30;
      s += '<rect x="'+x+'" y="'+(y+46)+'" width="27" height="10" rx="3" fill="var(--'+bands[k][2]+')"/>';
    }
  });
  /* down the stack */
  s += ln([[318,138],[318,392]], { c:'var(--ink-3)', w:1.4, dash:'3 5' });
  s += '<path d="M312 386l6 9 6-9" fill="none" stroke="var(--ink-3)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>';
  s += flow([[318,138],[318,392]], RED, 4.4, 0, 7);
  /* the explanation, beside the phone */
  s += T(360, 140, 'Down the stack, inside the phone', 'bg-l', 'start');
  s += T(360, 162, 'each layer seals what it was handed', 'bg-t', 'start');
  s += T(360, 180, 'in its own envelope, never opening', 'bg-t', 'start');
  s += T(360, 198, 'the one above it', 'bg-t', 'start');
  /* out as radio, to the router */
  s += arcs(306, 414, 0, GREEN, 3, 14, 14, 38, 3);
  var wave = [[352,414],[470,392],[590,346]];
  s += ln(wave, { c:GREEN, w:2.6, dash:'9 7', smooth:true });
  s += flow(wave, GREEN, 2.6, 0.4, 7);
  s += TH(452, 380, 'now it is radio', 'bg-t ok', 'middle');
  s += icon('router', 684, 300, 2, undefined);
  s += T(684, 404, 'The router', 'bg-l') + T(684, 422, '192.168.1.1', 'bg-t');
  s += T(684, 440, 'reads only the outer envelope', 'bg-t');
  return stage('Inside one tap', s,
    'A phone cut open: the request gains a TCP, then IP, then Wi-Fi header as it descends, then leaves as radio toward the router.',
    '<b>Encapsulation, where it actually happens.</b> Your request starts as one sentence and picks up an envelope at every layer on the way down your own phone \u2014 before a single bit has left the building. The router will strip the outermost one and write a new one for the next hop.');
})();

/* ── your flat, in radio ────────────────────────────────── */
B.wifi = (function(){
  var s = title('The same router, four very different experiences');
  s += '<rect x="520" y="36" width="12" height="12" rx="3" fill="'+ORANGE+'"/>' + T(540, 46, '2.4 GHz \u00b7 reaches far, but slow', 'bg-t', 'start');
  s += '<rect x="520" y="56" width="12" height="12" rx="3" fill="'+GREEN+'"/>' + T(540, 66, '5 GHz \u00b7 fast, but stops at walls', 'bg-t', 'start');
  var X0 = 36, Y0 = 84, X1 = 784, Y1 = 432, WY = 244;
  s += panel(X0, Y0, X1-X0, Y1-Y0, { fill:'var(--paper-2)', stroke:false, r:4, ht:.12, htc:'var(--ink-3)', g:6 });
  /* coverage: 2.4 GHz spills through the flat; 5 GHz is stopped by the living-room walls */
  var rx = 236, ry = 168, id = 'bsc'+(++UID);
  DEFS += '<clipPath id="'+id+'a"><rect x="'+X0+'" y="'+Y0+'" width="'+(X1-X0)+'" height="'+(Y1-Y0)+'"/></clipPath>'+
          '<clipPath id="'+id+'b"><rect x="'+X0+'" y="'+Y0+'" width="'+(430-X0)+'" height="'+(WY-Y0)+'"/></clipPath>';
  s += '<g clip-path="url(#'+id+'a)"><g class="breathe"><ellipse cx="'+rx+'" cy="'+ry+'" rx="440" ry="250" fill="'+ORANGE+'" opacity=".16"/></g>'+
       '<ellipse cx="'+rx+'" cy="'+ry+'" rx="440" ry="250" fill="'+dots(ORANGE, 5)+'" opacity=".35"/>'+
       '<ellipse cx="'+rx+'" cy="'+ry+'" rx="440" ry="250" fill="none" stroke="'+ORANGE+'" stroke-width="2" stroke-dasharray="8 6" opacity=".7"/></g>';
  s += '<g clip-path="url(#'+id+'b)"><g class="breathe"><ellipse cx="'+rx+'" cy="'+ry+'" rx="210" ry="140" fill="'+GREEN+'" opacity=".2"/></g>'+
       '<ellipse cx="'+rx+'" cy="'+ry+'" rx="210" ry="140" fill="'+dots(GREEN, 5)+'" opacity=".25"/></g>';
  /* walls, with doorways */
  [[[X0,WY],[140,WY]], [[176,WY],[300,WY]], [[340,WY],[640,WY]], [[676,WY],[X1,WY]],
   [[430,Y0],[430,150]], [[430,186],[430,WY]], [[200,WY],[200,Y1]], [[600,WY],[600,330]], [[600,366],[600,Y1]]].forEach(function(w){
    s += ln(w, { c:'var(--ink)', w:5, op:.6, cap:'butt' });
  });
  s += '<rect x="'+X0+'" y="'+Y0+'" width="'+(X1-X0)+'" height="'+(Y1-Y0)+'" rx="4" fill="none" stroke="var(--ink)" stroke-width="5" opacity=".75"/>';
  [['Living room',52,108],['Bedroom',446,108],['Kitchen',52,268],['Study',216,268],['Balcony',616,268]].forEach(function(r){
    s += TH(r[1], r[2], r[0], 'bg-t', 'start', 'fill:var(--ink-3)');
  });
  var dev = [[352,136,'phone','Phone','5 GHz \u00b7 full speed','ok',GREEN],
             [662,140,'tv','TV','2.4 GHz only \u00b7 slow','hot',ORANGE],
             [116,322,'laptop','Laptop','two walls \u00b7 weak','hot',RED],
             [694,322,null,'Speaker','out of range','hot',RED]];
  dev.forEach(function(v){ s += ln([[rx,ry],[v[0],v[1]]], { c:v[6], w:1.8, op:.6, dash:'5 6' }); });
  s += icon('router', rx, ry-6, 0.9);
  s += TH(rx, ry+40, 'router', 'bg-t', 'middle', 'fill:var(--ink);font-weight:500');
  dev.forEach(function(v){
    if(v[2]) s += icon(v[2], v[0], v[1], 0.62);
    else {
      I.at(0, 0);
      s += '<g transform="translate('+v[0]+' '+(v[1]+10)+')">'+I.begin()+I.shadow(-8,-8,16,16,4)+I.cyl(0,0,0,9,24,DARK)+
        I.ring(0,0,24,5,'var(--ink-3)',.8)+I.dot(0,0,8,2,RED)+'</g>';
    }
    s += tag(v[0], v[1]+32, v[3], v[4], v[5]);
  });
  s += T(784, 456, 'the speaker keeps dropping \u2014 not the plan\u2019s fault', 'bg-t hot', 'end');
  return stage('Your flat, in radio', s,
    'A floor plan of a flat showing the router and two coverage areas: a large 2.4 GHz zone reaching every room and a small fast 5 GHz zone, with devices marked by the quality they get.',
    '<b>Wi-Fi problems are geometry problems.</b> Higher frequency always means more speed and less reach, so 5 GHz dies at the second wall while 2.4 GHz crawls everywhere. Before blaming Airtel, move the router somewhere high, central and out in the open \u2014 it changes this picture more than any plan upgrade.');
})();

/* ── four machines in one plastic case ──────────────────── */
B.router = (function(){
  var s = title('It is not one device. It is four, sharing a case.', 'the box on your shelf, with its lid lifted off');
  var OX = 420, OY = 214;
  function P(x, y, z){ I.at(OX, OY); return I.P(x, y, z); }
  I.at(OX, OY);
  var parts = [['ONT','light \u2192 electricity','access'], ['Router + NAT','rewrites each packet','core'],
               ['Switch','learns which port','home'], ['Wi-Fi AP','the radio','net']];
  var H = [26, 34, 22, 24], XC = [-132, -44, 44, 132];
  var g = I.begin() + I.shadow(-190, -42, 380, 84, 10);
  g += I.box(-190, -42, 0, 380, 84, 4, DEV);
  g += I.box(-190, -42, 4, 380, 4, 12, DEV) + I.box(-190, -38, 4, 4, 76, 12, DEV);   /* far walls */
  g += I.face('z', 4.05, -186, -38, 186, 38, I.lit(DEV, -8));
  parts.forEach(function(p, i){
    var x = XC[i]-37, c = 'var(--'+p[2]+')', top = 4 + H[i];
    g += I.box(x, -27, 4, 74, 54, H[i], c);
    if(i === 0){
      g += I.face('y', 27.05, x+8, 10, x+20, 20, DARK);
      g += I.dot(x+58, 0, top, 2.2, GREEN);
    }
    if(i === 1){
      g += I.face('z', top+.05, x+12, -16, x+34, 6, DARK, { edge:false });
      [0,1,2,3].forEach(function(k){ g += I.line([[x+44, -18+k*7, top+.1],[x+64, -18+k*7, top+.1]], I.lit(c, -35), 1.2); });
    }
    if(i === 2){
      [0,1,2,3].forEach(function(k){ g += I.face('y', 27.05, x+8+k*16, 10, x+20+k*16, 19, YELLOW); });
    }
    if(i === 3){
      g += I.cyl(x+14, -18, top, 2.4, 44, DARK) + I.cyl(x+60, -18, top, 2.4, 44, DARK);
    }
  });
  g += I.box(186, -38, 4, 4, 76, 10, DEV) + I.box(-190, 38, 4, 380, 4, 10, DEV);      /* near walls */
  s += g;
  /* number badges on each machine */
  parts.forEach(function(p, i){
    var b = P(XC[i] - (i === 3 ? 0 : 0), 6, 4 + H[i]);
    s += '<circle cx="'+f(b[0])+'" cy="'+f(b[1])+'" r="12" fill="var(--paper)" stroke="var(--'+p[2]+')" stroke-width="2"/>'+
      T(b[0], b[1]+5, String(i+1), 'bg-l', 'middle', 'fill:var(--'+p[2]+')');
  });
  /* fibre in, from the lower left */
  var f0 = P(-132, 300, 0), f1 = P(-132, 60, 2), f2 = P(-132, 42, 14), f3 = P(-132, 27, 15);
  s += wire([f0, f1, f2, f3], ORANGE, 3.4);
  s += TH(f0[0]+4, f0[1]+22, 'fibre in', 'bg-t', 'start', 'fill:var(--access);font-weight:500');
  /* LAN ports callout */
  var lp = P(44, 27, 10);
  s += ln([[lp[0]-6, lp[1]+6],[lp[0]-60, lp[1]+70],[lp[0]-80, lp[1]+70]], { c:'var(--ink-3)', w:1.2 });
  s += TH(lp[0]-86, lp[1]+74, 'the four yellow LAN ports', 'bg-t', 'end');
  /* the radio leaves from the antennas */
  var at = P(132, -18, 4+H[3]+44);
  s += arcs(at[0]+10, at[1]-4, -40, 'var(--net)', 3, 18, 16, 40, 3);
  /* the packet's route through all four */
  var route = [f0, f1, P(-132, 0, 4+H[0]+3), P(-44, 0, 4+H[1]+3), P(44, 0, 4+H[2]+3), P(132, 0, 4+H[3]+3), [at[0]+40, at[1]-34]];
  s += flow(route, RED, 6, 0, 7);
  /* the legend row */
  parts.forEach(function(p, i){
    var x = 36 + i*189, y = 362, c = 'var(--'+p[2]+')';
    s += panel(x, y, 181, 62, { fill:'var(--'+p[2]+'-bg)', stroke:c, sw:1.2, sop:.7, r:10 });
    s += '<circle cx="'+(x+22)+'" cy="'+(y+31)+'" r="11" fill="'+c+'"/>'+T(x+22, y+36, String(i+1), 'bg-l', 'middle', 'fill:var(--paper)');
    s += T(x+42, y+27, p[0], 'bg-l', 'start') + T(x+42, y+45, p[1], 'bg-t', 'start');
  });
  s += T(36, 452, 'and if your plan has a landline, a fifth: a VoIP box', 'bg-t', 'start');
  return stage('Four machines, one case', s,
    'The home router opened up, showing four separate machines in a row: the optical terminal, the router doing NAT, the switch, and the Wi-Fi access point, with a packet travelling through all of them.',
    '<b>Almost every home-networking confusion comes from treating this as one thing.</b> When Wi-Fi is bad, only box 4 is at fault. When the red internet light is on, it is box 1. When port forwarding fails, it is box 2 \u2014 and, on Airtel, a second NAT further upstream that you do not own.');
})();

/* ── how a switch learns ────────────────────────────────── */
B.tv = (function(){
  var s = title('How a switch learns');
  s += T(36, 70, 'Step 1 \u00b7 unknown address? shout down every corridor', 'bg-t hot', 'start');
  s += T(36, 88, 'Step 2 \u00b7 hear the reply, write it down, never shout again', 'bg-t ok', 'start');
  var SW = [410, 214];
  var devs = [[140,172,'phone','Phone','port 1'],[140,340,'laptop','Laptop','port 2'],
              [680,172,'tv','Smart TV','port 3'],[680,340,null,'Console','port 4']];
  function edge(d, k){
    var dx = d[0]-SW[0], dy = d[1]-SW[1], L = Math.hypot(dx, dy);
    return [d[0] - dx/L*k, d[1] - dy/L*k];
  }
  function hub(d){
    var dx = d[0]-SW[0], dy = d[1]-SW[1], L = Math.hypot(dx, dy);
    return [SW[0] + dx/L*70, SW[1] + dy/L*34];
  }
  devs.forEach(function(d){ s += ln([hub(d), edge(d, 62)], { c:'var(--ink-3)', w:2, op:.55 }); });
  /* the flood, then the learned path */
  [devs[2], devs[1], devs[3]].forEach(function(d, i){
    s += '<g class="fadecyc" style="--dly:'+f(1.4 + i*0.12)+'s">'+ln([hub(d), edge(d, 62)], { c:RED, w:2.6, dash:'6 6' })+'</g>';
  });
  s += '<g class="fadecyc" style="--dly:3.2s">'+ln([hub(devs[2]), edge(devs[2], 62)], { c:GREEN, w:3.6 })+'</g>';
  s += flow([edge(devs[0], 62), hub(devs[0])], RED, 6, 0, 7);
  /* the switch itself */
  I.at(SW[0], SW[1]);
  var g = I.begin() + I.shadow(-60, -26, 120, 52, 8) + I.box(-60, -26, 0, 120, 52, 20, 'var(--home)');
  g += I.face('z', 20.05, -50, -18, -10, -12, I.lit('var(--home)', -30), { edge:false });
  [0,1,2,3].forEach(function(k){
    g += I.face('y', 26.05, -48+k*22, 5, -34+k*22, 14, DARK);
    g += I.dot(-41+k*22, 26, 16.5, 1.6, k === 2 ? YELLOW : GREEN);
  });
  s += g;
  s += TH(SW[0], SW[1]+58, 'The switch', 'bg-l') + TH(SW[0], SW[1]+76, 'inside your router', 'bg-t');
  /* the four devices */
  devs.forEach(function(d){
    if(d[2]) s += icon(d[2], d[0], d[1], 0.8);
    else {
      I.at(d[0], d[1]+12);
      s += I.begin() + I.shadow(-26, -18, 52, 36, 5) + I.box(-26, -18, 0, 52, 36, 10, DARK) +
        I.face('z', 10.05, -20, -12, 20, -9, GREEN, { edge:false, op:.9 }) +
        I.box(28, 6, 0, 16, 10, 4, DEV);
    }
    s += tag(d[0], d[1]+40, d[3], d[4]);
  });
  /* what it has learned */
  s += panel(262, 330, 296, 112, { fill:'var(--paper-2)', stroke:'var(--border-2)', r:10 });
  s += T(410, 354, 'what it has learned', 'bg-t', 'middle', 'fill:var(--ink);font-weight:500');
  s += ln([[282,364],[538,364]], { c:'var(--border-2)', w:1 });
  s += '<g class="fadecyc" style="--dly:3.2s">'+T(410, 384, '3c:5a:b4:\u2026 \u2192 port 3', 'bg-t ok')+'</g>';
  s += '<g class="fadecyc" style="--dly:3.4s">'+T(410, 404, 'a4:11:9f:\u2026 \u2192 port 1', 'bg-t ok')+'</g>';
  s += T(410, 430, 'built by watching, not by configuration', 'bg-t');
  return stage('How a switch learns', s,
    'A switch floods an unknown frame to every port, hears the reply, records which port that address is on, and afterwards sends straight there.',
    '<b>The most self-sufficient device in networking.</b> Plug it in, configure nothing, and within seconds it knows the topology of everything attached \u2014 purely by noticing who answered from where. A frame between your phone and your TV never leaves this box.');
})();


/* ── copper against air ─────────────────────────────────── */
B.laptop = (function(){
  var s = title('Same router, same plan \u2014 one wire, one room of air');
  /* left: the cable */
  s += panel(36, 92, 362, 330, { fill:'var(--home-bg)', stroke:'var(--home)', sop:.6, ht:.1, htc:'var(--home)', g:5 });
  s += T(56, 122, 'Cat-6 cable', 'bg-l', 'start') + T(56, 140, 'a private corridor', 'bg-t ok', 'start');
  s += panel(62, 160, 310, 104, { fill:'var(--paper)', stroke:'var(--ink-3)', sw:1.4, r:20 });
  [ORANGE, GREEN, BLUE, BROWN].forEach(function(c, k){
    var yc = 180 + k*21, a = [], b = [], x;
    for(x = 80; x <= 354; x += 3){
      var o = Math.sin((x-80)/9 + k)*4.5;
      a.push([x, yc + o]); b.push([x, yc - o]);
    }
    s += ln(b, { c:I.lit(c, 55), w:3.2 }) + ln(a, { c:c, w:3.2 });
  });
  s += TH(217, 280, 'four twisted pairs', 'bg-t');
  [[300,'send',1],[334,'receive',-1]].forEach(function(l){
    s += panel(62, l[0]-12, 310, 24, { fill:'var(--paper)', stroke:'var(--home)', sw:1.2, sop:.6, r:12 });
    s += T(l[2] > 0 ? 74 : 360, l[0]+4, l[2] > 0 ? 'send \u2192' : '\u2190 receive', 'bg-t', l[2] > 0 ? 'start' : 'end', 'fill:var(--home)');
  });
  s += flow([[140,300],[372,300]], GREEN, 2, 0, 7) + flow([[140,300],[372,300]], GREEN, 2, 1, 7);
  s += flow([[294,334],[62,334]], GREEN, 2, 0, 7) + flow([[294,334],[62,334]], GREEN, 2, 1, 7);
  s += T(217, 384, 'send and receive at the same instant', 'bg-t ok');
  s += T(217, 402, 'nobody waits for anybody', 'bg-t');
  /* right: the air */
  s += panel(422, 92, 362, 330, { fill:'var(--access-bg)', stroke:'var(--access)', sop:.6, ht:.1, htc:'var(--access)', g:5 });
  s += T(442, 122, 'Wi-Fi', 'bg-l', 'start') + T(442, 140, 'one crowded room', 'bg-t hot', 'start');
  s += arcs(603, 178, -90, ORANGE, 3, 26, 14, 34, 3);
  s += icon('router', 603, 210, 0.75);
  s += icon('laptop', 486, 232, 0.62) + icon('phone', 722, 232, 0.62) + icon('router', 712, 150, 0.5, .55);
  s += TH(586, 262, 'router', 'bg-t', 'middle', 'fill:var(--access);font-weight:500');
  s += TH(486, 278, 'laptop', 'bg-t', 'middle', 'fill:var(--home);font-weight:500');
  s += TH(722, 278, 'phone', 'bg-t', 'middle', 'fill:var(--net);font-weight:500');
  s += TH(712, 180, 'neighbour', 'bg-t', 'middle', 'fill:var(--ink-3);font-weight:500');
  /* airtime: one talker at a time */
  var turns = [[44,'var(--home)'],[30,'var(--access)'],[38,'var(--net)'],[48,'var(--ink-3)'],[26,'var(--home)'],[36,'var(--access)'],[30,'var(--net)'],[34,'var(--ink-3)']];
  var tot = turns.reduce(function(a, t){ return a + t[0]; }, 0), gap = 4, x = 442, W = 322 - gap*(turns.length-1);
  s += panel(438, 296, 330, 28, { fill:'var(--paper)', stroke:'var(--border-2)', sw:1, r:8 });
  turns.forEach(function(t){
    var w = t[0]/tot*W;
    s += '<rect x="'+f(x)+'" y="300" width="'+f(w)+'" height="20" rx="4" fill="'+t[1]+'" opacity=".85"/>';
    x += w + gap;
  });
  s += flow([[442,334],[764,334]], ORANGE, 3.6, 0, 6) + flow([[442,334],[764,334]], ORANGE, 3.6, 1.8, 6);
  s += T(603, 356, 'airtime: one talker at a time', 'bg-t');
  s += T(603, 384, 'everything queues \u2014 the router included', 'bg-t hot');
  s += T(603, 402, 'your neighbour\u2019s router is in this room too', 'bg-t');
  s += T(410, 452, 'this is why a speed test on cable is the only honest one', 'bg-t', 'middle', 'fill:var(--ink);font-weight:500');
  return stage('Copper against air', s,
    'Side by side: a cable carrying traffic in both directions at once, and Wi-Fi where every station including the router must take turns.',
    '<b>Before you complain about your line, test it on a cable.</b> If the wire gives your full plan speed and Wi-Fi does not, the fibre is fine and your radio environment is the bottleneck. That single test settles most "Airtel is slow" arguments.');
})();

/* ── the mobile core is a building ──────────────────────── */
B.mcore = (function(){
  var s = title('Head office, and the corridor your data actually uses');
  s += panel(250, 92, 400, 336, { fill:'var(--paper-2)', stroke:'var(--border-2)', r:16, ht:.1, htc:'var(--ink-3)', g:6 });
  s += T(450, 116, 'the operator\u2019s core \u2014 often hundreds of km from you', 'bg-t');
  /* a small stack of servers, for each hall */
  function rack(x, y, c){
    I.at(x, y);
    var g = I.begin() + I.shadow(-18, -14, 36, 28, 4);
    [0, 11, 22].forEach(function(z){
      g += I.box(-18, -14, z, 36, 28, 10, DARK);
      g += I.face('y', 14.05, -14, z+4, 2, z+6.4, c);
      g += I.dot(8, 14, z+5.2, 1.3, GREEN) + I.dot(12, 14, z+5.2, 1.3, GREEN);
    });
    return g;
  }
  s += panel(270, 132, 360, 122, { fill:'var(--core-bg)', stroke:'var(--core)', sw:1.3, sop:.7 });
  s += T(290, 162, 'Control plane', 'bg-l', 'start') + T(290, 180, 'AMF \u00b7 SMF', 'bg-t', 'start');
  s += T(290, 206, 'who are you, what did you', 'bg-t', 'start') + T(290, 222, 'pay for \u2014 log it', 'bg-t', 'start');
  s += rack(570, 214, 'var(--core)');
  s += panel(270, 270, 360, 140, { fill:'var(--access-bg)', stroke:'var(--access)', sw:1.3, sop:.7 });
  s += T(290, 298, 'User plane', 'bg-l', 'start') + T(290, 316, 'UPF \u2014 your actual packets', 'bg-t', 'start');
  s += T(290, 334, 'never touches the hall above', 'bg-t hot', 'start');
  s += rack(570, 344, 'var(--access)');
  /* the tower, and the globe beyond */
  s += icon('tower', 120, 252, 1.4);
  s += T(120, 352, 'The tower', 'bg-l') + T(120, 370, 'just a radio', 'bg-t');
  s += '<g transform="translate(641 268) scale(1.05)">'+A.origin()+'</g>';
  s += T(725, 404, 'the internet', 'bg-t', 'middle', 'fill:var(--net);font-weight:500');
  /* signalling: to the hall above */
  var ctl = [[138,196],[200,178],[270,182]];
  s += ln(ctl, { c:'var(--core)', w:2.4, dash:'7 6', smooth:true }) + flow(ctl, YELLOW, 4.4, 0, 6);
  s += TH(196, 166, 'signalling', 'bg-t', 'middle', 'fill:var(--core);font-weight:500');
  /* data: straight through the hall below and out */
  var usr = [[150,318],[196,384],[270,384]];
  s += wire(usr, 'var(--access)', 3.4, true) + flow(usr, RED, 3, 0, 7);
  var out = [[270,384],[630,384],[712,384]];
  s += wire(out, 'var(--access)', 3.4) + flow(out, RED, 3, 1, 7);
  s += TH(200, 406, 'your data', 'bg-t hot');
  s += T(784, 452, 'your SIM holds the secret that proves you to the hall above', 'bg-t', 'end');
  return stage('The core, split in two', s,
    'A mobile core building with two separate halls: a control plane handling identity and billing, and a user plane that carries the data straight through to the internet.',
    '<b>Two planes, and only one of them ever sees your bytes.</b> Separating them is the whole point of the 5G core \u2014 the data hall can be pushed out to the edge of the network for low latency while identity and billing stay central.');
})();

/* ── your street, in fibre ──────────────────────────────── */
B.splitter = (function(){
  var s = title('The bit of the internet you walk past every day',
    'one fibre from the exchange, split 32 ways \u2014 your neighbours are, physically, on your wire');
  var G = 336;
  /* ground, pavement and road */
  s += '<rect x="0" y="'+G+'" width="820" height="'+(470-G)+'" fill="var(--home-bg)"/>';
  s += '<rect x="0" y="'+G+'" width="820" height="'+(470-G)+'" fill="'+dots('var(--home)', 6)+'" opacity=".22"/>';
  s += '<rect x="0" y="'+G+'" width="820" height="12" fill="var(--paper-3)"/>';
  s += '<rect x="0" y="'+(G+12)+'" width="820" height="48" fill="'+I.lit('var(--paper-3)', -6)+'"/>';
  s += ln([[0,G+36],[820,G+36]], { c:'var(--ink-3)', w:2.4, dash:'22 18', op:.5, cap:'butt' });
  /* a building in oblique view: face, lit roof, shaded side */
  function building(x, top, w, base, side, roof, edge){
    var d = 12;
    return '<path d="M'+(x+w)+' '+top+'l'+d+' '+(-d*0.6)+'V'+G+'H'+(x+w)+'Z" fill="'+side+'"/>'+
      '<path d="M'+(x+w)+' '+top+'l'+d+' '+(-d*0.6)+'V'+G+'H'+(x+w)+'Z" fill="'+dots('var(--ink)', 3)+'" opacity=".14"/>'+
      '<path d="M'+x+' '+top+'l'+d+' '+(-d*0.6)+'H'+(x+w+d)+'l'+(-d)+' '+(d*0.6)+'Z" fill="'+roof+'"/>'+
      '<rect x="'+x+'" y="'+top+'" width="'+w+'" height="'+(G-top)+'" fill="'+base+'"/>'+
      '<path d="M'+x+' '+G+'V'+top+'l'+d+' '+(-d*0.6)+'H'+(x+w+d)+'V'+G+'M'+(x+w)+' '+G+'V'+top+'H'+x+'" fill="none" stroke="'+edge+'" stroke-width="1"/>';
  }
  var homes = [[40,156],[130,130],[220,164],[310,144]], W = 78;
  homes.forEach(function(h, i){
    var mine = i === 2, x = h[0], top = h[1];
    var base = mine ? I.lit('var(--home)', 62) : DEV;
    s += building(x, top, W, base, I.lit(base, -22), I.lit(base, 30), 'var(--iso-line)');
    for(var r = 0; top + 22 + r*44 + 26 < G - (mine ? 90 : 46); r++) for(var c = 0; c < 2; c++){
      var lit = mine || (r + c + i) % 3 === 0;
      s += '<rect x="'+(x+12+c*32)+'" y="'+(top+22+r*44)+'" width="22" height="26" rx="2" fill="'+(lit ? YELLOW : SCR)+'" opacity="'+(lit ? .9 : .75)+'"/>';
    }
    s += '<rect x="'+(x+28)+'" y="'+(G-34)+'" width="22" height="34" rx="2" fill="'+I.lit(base, -40)+'"/>';
    if(mine) s += panel(x+6, G-84, W-12, 22, { fill:'var(--paper)', stroke:'var(--home)', sw:1.2, r:11 }) +
      T(x+W/2, G-69, 'your flat', 'bg-t ok');
  });
  /* the exchange */
  s += building(640, 150, 150, 'var(--access-bg)', I.lit('var(--access-bg)', -16), I.lit('var(--access-bg)', 30), 'var(--access)');
  s += T(715, 186, 'The exchange', 'bg-l') + T(715, 206, '2\u20138 km away', 'bg-t');
  s += T(715, 228, 'OLT racks live here', 'bg-t');
  [0,1,2].forEach(function(k){
    s += '<rect x="'+(664+k*36)+'" y="252" width="28" height="56" rx="3" fill="'+DARK+'"/>';
    [0,1,2,3].forEach(function(j){ s += '<circle class="blink" style="--dly:'+f((k+j)*0.3)+'s" cx="'+(671+k*36)+'" cy="'+(262+j*12)+'" r="2" fill="'+(j === 1 ? RED : GREEN)+'"/>'; });
  });
  /* the trunk: underground from the exchange, then up the pole */
  var PX = 470, BY = 88, trunk = [[715,G+12],[715,432],[PX+6,432],[PX+6,G],[PX+6,BY+46]];
  s += '<rect x="'+(PX-3)+'" y="'+(BY+40)+'" width="6" height="'+(G+8-BY-40)+'" rx="2" fill="'+DARK+'"/>';
  s += wire(trunk, ORANGE, 3.2);
  s += flow(trunk, ORANGE, 3.2, 0, 7);
  s += TH(593, 456, 'one fibre, from the exchange', 'bg-t', 'middle', 'fill:var(--access);font-weight:500');
  /* drop fibres, one to each home, leaving the splitter side by side */
  homes.forEach(function(h, i){
    var tx = h[0] + W/2 + 6, ty = h[1] - 4, y = BY + 12 + i*7;
    var d = [[442, y], [tx+8, y], [tx, y+1], [tx, y+8], [tx, ty]];
    s += ln(d, { c:ORANGE, w:2, smooth:true });
    s += flow(d, ORANGE, 3.2, 0.5 + i*0.55, 5);
    s += '<circle cx="'+tx+'" cy="'+ty+'" r="3.6" fill="'+ORANGE+'" stroke="var(--paper)" stroke-width="1.5"/>';
  });
  /* the splitter on its pole */
  s += '<rect x="442" y="'+BY+'" width="58" height="46" rx="7" fill="'+GREEN+'" stroke="var(--iso-line)"/>';
  s += '<rect x="442" y="'+BY+'" width="58" height="10" rx="4" fill="#fff" opacity=".14"/>';
  s += T(471, BY+29, '1 : 32', 'bg-l', 'middle', 'fill:var(--paper)');
  s += T(514, BY+18, 'the splitter', 'bg-l', 'start') + T(514, BY+36, 'no power, no brain', 'bg-t', 'start');
  return stage('Your street, in fibre', s,
    'A street with houses, a pole carrying a passive optical splitter, one trunk fibre running to the exchange, and drop fibres fanning out to each home in turn.',
    '<b>This is GPON, and it is mostly not electronic.</b> One expensive fibre runs from the exchange to your locality; a sealed box with no power supply splits its light 32 ways. That is why fibre broadband got cheap enough to sell to every flat \u2014 and why a cut between the splitter and the exchange takes out exactly your 32 neighbours at once.');
})();

/* ── inside the exchange ────────────────────────────────── */
B.olt = (function(){
  var s = title('A room in a building in your city, with your name in it');
  var OX = 300, OY = 326;
  function P(x, y, z){ I.at(OX, OY); return I.P(x, y, z); }
  I.at(OX, OY);
  var g = I.begin();
  g += I.face('z', 0, -190, -50, 170, 90, 'var(--paper-3)', { edge:false });
  g += I.halftone([[-190,-50,0],[170,-50,0],[170,90,0],[-190,90,0]], .08);
  var X0 = [-130, -40, 50], HR = 160;
  X0.forEach(function(x){ g += I.shadow(x, -25, 60, 50, 6); });
  var leds = '';
  X0.forEach(function(x, r){
    g += I.box(x, -25, 0, 60, 50, HR, DARK);
    g += I.box(x+4, -21, HR, 52, 42, 3, I.lit(DARK, 12));
    for(var i = 0; i < 8; i++){
      var z = 12 + i*18;
      g += I.face('y', 25.05, x+5, z, x+55, z+13, I.lit(DARK, 20));
      g += I.face('y', 25.1, x+40, z+4, x+51, z+9, DARK, { edge:false, op:.8 });
      var a = P(x+10, 25, z+6.5), b = P(x+17, 25, z+6.5);
      leds += '<circle cx="'+f(a[0])+'" cy="'+f(a[1])+'" r="2.2" class="blink" style="--dly:'+f((i+r)*0.18)+'s" fill="'+((i+r)%3 ? GREEN : RED)+'"/>'+
        '<circle cx="'+f(b[0])+'" cy="'+f(b[1])+'" r="2.2" fill="'+YELLOW+'" opacity=".85"/>';
    }
  });
  s += g + leds;
  /* fibres from the streets: one bundle along a floor trench, each fibre rising into a line card */
  s += I.face('z', .05, -190, 40, 150, 50, DARK, { edge:false, op:.55 });
  var bundle = [P(-340, 45, 0), P(122, 45, 0)];
  s += wire(bundle, ORANGE, 4);
  var targets = [[0,1],[0,5],[1,2],[1,6],[2,3],[2,7]];
  targets.forEach(function(t, j){
    var x = X0[t[0]] + 44 + (j % 2)*7, z = 12 + t[1]*18 + 6.5;
    var pts = [P(x, 45, 0), P(x, 25.2, 1), P(x, 25.2, z)];
    s += ln(pts, { c:ORANGE, w:2 });
    s += flow([bundle[0]].concat(pts), ORANGE, 3.4, j*0.3, 5);
  });
  var by = bundle[0][1] + (40 - bundle[0][0])*0.5774;
  s += TH(30, by - 26, 'fibre from the streets', 'bg-t', 'start', 'fill:var(--access);font-weight:500');
  X0.forEach(function(x, r){
    var b = P(x+30, 12, HR+3);
    s += TH(b[0], b[1]+4, 'shelf '+(r+1), 'bg-t', 'middle', 'fill:var(--ink);font-weight:500');
  });
  /* the uplink: along the cable tray on top, out to the backbone */
  var tray = [P(-100, -14, HR+3), P(80, -14, HR+3)], t1 = tray[1];
  var up = [tray[0], t1, [t1[0]+60, t1[1]-10], [552, t1[1]-10]];
  s += wire(up, 'var(--core)', 3.4) + flow(up, RED, 2.4, 1.2, 7);
  s += panel(552, 126, 232, 210, { fill:'var(--core-bg)', stroke:'var(--core)', sw:1.3, sop:.7 });
  s += T(572, 156, 'Uplink', 'bg-l', 'start') + T(572, 174, '10G / 100G', 'bg-t', 'start');
  s += T(572, 192, 'to Airtel\u2019s backbone', 'bg-t', 'start');
  s += ln([[572,232],[764,232]], { c:'var(--core)', w:1, op:.35 });
  s += T(572, 260, 'ranging', 'bg-l', 'start', 'font-size:12.5px');
  s += T(572, 280, 'it measures the exact', 'bg-t', 'start') + T(572, 298, 'distance to every home', 'bg-t', 'start');
  s += T(784, 456, 'when support says \u201can outage in your area\u201d, they usually mean this room', 'bg-t', 'end');
  return stage('Inside the exchange', s,
    'Rows of OLT shelves with blinking line cards, fibres arriving from surrounding streets and a single fast uplink leaving for the operator backbone.',
    '<b>The first Airtel machine with a power cable.</b> Light arrives from your street and becomes ordinary packets here, then hundreds of subscribers are aggregated onto one uplink. Your 4 km of fibre cost about 20 microseconds \u2014 irrelevant next to what comes later.');
})();

window.BIGSCENES = B;
})();
