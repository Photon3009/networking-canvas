/* scene.js — a small animated diagram for every box on the map.
   Clean vector vocabulary: isometric mini-objects (window.ISO) for the physical endpoints,
   flat tinted cards for the logical parts, crisp wires and moving packets.
   Every stage is 360 user units wide; its height is fitted to the content. */
(function(){
'use strict';
var S = window.SK, I = window.ISO, N = 0, K = 1;
var DEV = 'var(--dev)', DARK = 'var(--iso-dark)', SCR = 'var(--scr)';
var RED = 'var(--c-red)', GREEN = 'var(--c-green)', ORANGE = 'var(--c-orange)', BLUE = 'var(--c-blue)';
var YELLOW = 'var(--c-yellow)', PINK = 'var(--c-pink)', TAN = 'var(--c-tan)';
var HALO = ' paint-order="stroke" stroke="var(--surface)" stroke-width="4" stroke-linejoin="round"';

function f(n){ return Math.round(n*10)/10; }

/* ── text ───────────────────────────────────────────────── */
/* o: { c: extra class, a: anchor, fs: font-size, cls: base class, halo: bool, w: weight } */
function T(x, y, t, o){
  o = o || {};
  return '<text x="'+f(x)+'" y="'+f(y)+'" class="'+(o.cls || 'sc-t')+(o.c ? ' '+o.c : '')+'" text-anchor="'+(o.a || 'middle')+'"'+
    (o.fs || o.w ? ' style="'+(o.fs ? 'font-size:'+o.fs+'px;' : '')+(o.w ? 'font-weight:'+o.w : '')+'"' : '')+(o.halo === false ? '' : HALO)+'>'+t+'</text>';
}
function tag(x, y, t, cls, anchor, fs){ return T(x, y, t, { c:cls, a:anchor, fs:fs || 8.5 }); }
/* a name under an object, with an optional mono sub-line */
function name(x, y, t, sub, a){
  return T(x, y, t, { cls:'sc-l', fs:10.5, a:a }) + (sub ? T(x, y+11.5, sub, { fs:8, a:a }) : '');
}

/* ── flat card: the logical parts ───────────────────────── */
function card(x, y, w, h, label, zone, sub, o){
  o = o || {};
  var g = '<rect x="'+x+'" y="'+(y+2.5)+'" width="'+w+'" height="'+h+'" rx="8" fill="var(--ink)" opacity=".06"/>'+
    '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="8" fill="var(--'+zone+'-bg)" stroke="var(--'+zone+')" stroke-width="1.4"/>'+
    '<rect x="'+(x+8)+'" y="'+y+'" width="'+Math.min(22, w-16)+'" height="2.6" rx="1.3" fill="var(--'+zone+')"/>';
  if(label) g += T(x+w/2, y+h/2+(sub ? -2 : 4), label, { cls:'sc-l', fs:o.fs || 10.5, halo:false });
  if(sub) g += T(x+w/2, y+h/2+11, sub, { fs:8, halo:false });
  return g;
}
/* soft tinted panel behind a group */
function panel(x, y, w, h, title, cls){
  return '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+h+'" rx="10" fill="var(--surface-2)"/>'+
    (title ? T(x+12, y+17, title, { c:cls, a:'start', fs:8.5, w:600, halo:false }) : '');
}

/* ── wires and packets ──────────────────────────────────── */
function path(pts, curve){
  return curve === false ? S.d(pts, false, 1, 700+(N+=3)) : S.ds(pts, false, 1.1, 700+(N+=3));
}
function wire(d, color, cls){
  return '<path class="sc-w '+(cls||'')+'" d="'+d+'" stroke="'+(color||'var(--ink-3)')+'"/>';
}
function mv(d, color, dur, delay, r, cls){
  return '<circle class="mv '+(cls||'')+'" r="'+(r||4.5)+'" cx="0" cy="0" fill="'+color+'" stroke="var(--surface)" stroke-width="1.6" '+
    'style="offset-path:path(\''+d+'\');--dur:'+(dur||2.8)+'s;--dly:'+(delay||0)+'s"/>';
}
function dot(x, y, r, c, cls, dly){
  return '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+c+'" class="'+(cls||'')+'" style="--dly:'+(dly||0)+'s"/>';
}
function cross(x, y, r, c){
  return '<circle cx="'+x+'" cy="'+y+'" r="'+(r+4)+'" fill="var(--surface)" stroke="'+c+'" stroke-width="1.6"/>'+
    '<g stroke="'+c+'" stroke-width="2.4" stroke-linecap="round"><line x1="'+(x-r*.6)+'" y1="'+(y-r*.6)+'" x2="'+(x+r*.6)+'" y2="'+(y+r*.6)+
    '"/><line x1="'+(x+r*.6)+'" y1="'+(y-r*.6)+'" x2="'+(x-r*.6)+'" y2="'+(y+r*.6)+'"/></g>';
}
function divider(x, y0, y1){
  return '<line x1="'+x+'" y1="'+y0+'" x2="'+x+'" y2="'+y1+'" stroke="var(--ink-3)" stroke-width="1" stroke-dasharray="3 4" opacity=".55"/>';
}
function stage(inner, aria, cap, h){
  return '<figure class="sc"><svg viewBox="0 0 360 '+(h||150)+'" role="img" aria-label="'+aria+'">'+inner+
    '</svg><figcaption>'+cap+'</figcaption></figure>';
}

/* ── isometric mini-objects: the physical endpoints ─────── */
/* each is placed by the screen point of its ground centre; k scales it */
function bx(x, y, z, w, d, h, c, o){ return I.box(x*K, y*K, z*K, w*K, d*K, h*K, c, o); }
function fc(pl, k, a0, b0, a1, b1, c, o){ return I.face(pl, k*K, a0*K, b0*K, a1*K, b1*K, c, o); }
function sh(x, y, w, d){ return I.shadow(x*K, y*K, w*K, d*K, 3*K); }

var ICON = {
  phone: function(){
    return sh(-6,-2,12,4) + bx(-6,-1.6,0,12,3.2,24,DARK,{ top:DARK }) +
      fc('y',1.65,-4.8,2.6,4.8,21.6,SCR) + fc('y',1.7,-3.6,12,3.6,19.8,RED,{ edge:false }) +
      fc('y',1.7,-3.6,5,1.4,7.4,'var(--dev)',{ edge:false, op:.55 }) + fc('y',1.7,-3.6,8.6,3,10.6,'var(--dev)',{ edge:false, op:.35 });
  },
  laptop: function(){
    return sh(-13,-9,26,18) + bx(-13,-9,0,26,18,2.2,DEV) + bx(-13,-9,2.2,26,1.6,17,DEV) +
      fc('y',-7.35,-11,4,11,17.4,SCR) + fc('y',-7.3,-9,10,-1,16,BLUE,{ edge:false, op:.9 }) +
      fc('z',2.25,-10,-4,10,4,'var(--iso-line)',{ edge:false, op:.5 });
  },
  router: function(){
    return sh(-13,-8,26,16) + I.cyl(-9*K,-5*K,6*K,1.1*K,13*K,DARK) + I.cyl(9*K,-5*K,6*K,1.1*K,13*K,DARK) +
      bx(-13,-8,0,26,16,6.5,DEV) + I.dot(-8*K,8.2*K,3.2*K,1.1,GREEN) + I.dot(-4*K,8.2*K,3.2*K,1.1,GREEN) +
      I.dot(0,8.2*K,3.2*K,1.1,YELLOW) + I.dot(4*K,8.2*K,3.2*K,1.1,GREEN);
  },
  tv: function(){
    return sh(-7,-4,14,8) + bx(-7,-4,0,14,8,1.6,DARK) + bx(-1.3,-1.3,1.6,2.6,2.6,5,DARK) +
      bx(-20,-1.2,6.6,40,2.4,25,DARK) + fc('y',1.25,-18,8.4,18,29.8,SCR) +
      fc('y',1.3,-15.5,17,-1,27.5,PINK,{ edge:false }) + fc('y',1.3,1.5,17,15.5,27.5,YELLOW,{ edge:false, op:.9 }) +
      fc('y',1.3,-15.5,10.5,-5,15,BLUE,{ edge:false, op:.85 }) + fc('y',1.3,-3,10.5,7.5,15,GREEN,{ edge:false, op:.85 });
  },
  tower: function(c){
    var s = sh(-6,-6,12,12), L = function(a, b, w){ return I.line([[a[0]*K,a[1]*K,a[2]*K],[b[0]*K,b[1]*K,b[2]*K]], 'var(--ink-2)', w || 1.3); };
    var top = [0,0,40];
    s += L([-6,-6,0],[-1,-1,34]) + L([6,-6,0],[1,-1,34]) + L([6,6,0],[1,1,34]) + L([-6,6,0],[-1,1,34]);
    s += L([-4.4,4.4,11],[4.4,4.4,11],1) + L([4.4,4.4,11],[4.4,-4.4,11],1) + L([-2.6,2.6,23],[2.6,2.6,23],1) + L([2.6,2.6,23],[2.6,-2.6,23],1);
    s += L([-4.4,4.4,11],[2.6,2.6,23],.8) + L([4.4,4.4,11],[-2.6,2.6,23],.8);
    s += bx(-3.6,1,28,2,1.2,9,DEV) + bx(1.6,1,28,2,1.2,9,DEV) + bx(1,-3.6,28,1.2,2,9,DEV);
    s += L([0,0,34],top,1.4);
    var p = I.P(0, 0, top[2]*K);
    return s + '<circle cx="'+f(p[0])+'" cy="'+f(p[1])+'" r="'+(2.6*K)+'" fill="'+(c || ORANGE)+'"/>';
  },
  rack: function(c){
    var s = sh(-9,-8,18,16) + bx(-9,-8,0,18,16,30,DARK), z;
    for(z = 3; z < 28; z += 6.4){
      s += fc('y',8.05,-7.2,z,7.2,z+4.2,'var(--dev)',{ edge:false, op:.22 });
      s += I.dot(5*K, 8.1*K, (z+2.1)*K, 1, c || GREEN);
    }
    return s;
  },
  building: function(c){
    var s = sh(-16,-10,32,20) + bx(-16,-10,0,32,20,20,DEV,{ top:I.lit(c || DEV, 55) }), x, z;
    for(z = 5; z < 17; z += 6) for(x = -13; x < 12; x += 6.4) s += fc('y',10.05,x,z,x+3.6,z+3,SCR,{ edge:false, op:.75 });
    for(z = 5; z < 17; z += 6) s += fc('x',16.05,-6,z,-2,z+3,SCR,{ edge:false, op:.6 }) + fc('x',16.05,2,z,6,z+3,SCR,{ edge:false, op:.6 });
    return s;
  },
  home: function(){
    var r = 'var(--c-red)';
    var s = sh(-11,-9,22,18) + bx(-11,-9,0,22,18,12,DEV);
    s += I.poly([[-11*K,-9*K,12*K],[11*K,-9*K,12*K],[11*K,0,19*K],[-11*K,0,19*K]], I.lit(r, 18));
    s += I.poly([[11*K,-9*K,12*K],[11*K,9*K,12*K],[11*K,0,19*K]], I.lit(DEV, -12));
    s += I.poly([[-11*K,0,19*K],[11*K,0,19*K],[11*K,9*K,12*K],[-11*K,9*K,12*K]], r);
    s += fc('y',9.05,-3,0,2,7,DARK,{ edge:false }) + fc('y',9.05,-9,5,-5,9,SCR,{ edge:false, op:.8 }) + fc('y',9.05,5,5,9,9,SCR,{ edge:false, op:.8 });
    return s;
  },
  /* the classic router puck: a short cylinder with crossing arrows on top */
  puck: function(c){
    var h = 8*K, r = 11*K, a = 6.5*K, L = function(p, q){ return I.line([p, q], c || 'var(--core)', 1.5); };
    return I.disc(0, 0, 0, r+2*K, 'var(--ink)', .07) + I.cyl(0, 0, 0, r, h, DEV) +
      L([-a,0,h],[a,0,h]) + L([0,-a,h],[0,a,h]) +
      L([a-2.4*K,-1.6*K,h],[a,0,h]) + L([a-2.4*K,1.6*K,h],[a,0,h]) + L([-a+2.4*K,-1.6*K,h],[-a,0,h]) + L([-a+2.4*K,1.6*K,h],[-a,0,h]) +
      L([-1.6*K,a-2.4*K,h],[0,a,h]) + L([1.6*K,a-2.4*K,h],[0,a,h]) + L([-1.6*K,-a+2.4*K,h],[0,-a,h]) + L([1.6*K,-a+2.4*K,h],[0,-a,h]);
  },
  cache: function(c){
    return I.disc(0, 0, 0, 13*K, 'var(--ink)', .07) + I.cyl(0,0,0,10*K,8*K,c || 'var(--core)') + I.cyl(0,0,9*K,10*K,8*K,c || 'var(--core)');
  }
};
function icon(kind, x, y, k, c){ K = k || 1; I.at(x, y); var s = ICON[kind](c); K = 1; return '<g>'+s+'</g>'; }
/* a flat globe for "the internet" */
function globe(x, y, r, zone){
  zone = zone || 'net';
  return '<circle cx="'+x+'" cy="'+(y+2)+'" r="'+r+'" fill="var(--ink)" opacity=".06"/>'+
    '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="var(--'+zone+'-bg)" stroke="var(--'+zone+')" stroke-width="1.4"/>'+
    '<g fill="none" stroke="var(--'+zone+')" stroke-width="1" opacity=".7">'+
    '<ellipse cx="'+x+'" cy="'+y+'" rx="'+(r*.42)+'" ry="'+r+'"/><line x1="'+(x-r)+'" y1="'+y+'" x2="'+(x+r)+'" y2="'+y+'"/>'+
    '<path d="M'+f(x-r*.86)+' '+f(y-r*.5)+'Q'+x+' '+f(y-r*.28)+' '+f(x+r*.86)+' '+f(y-r*.5)+'M'+f(x-r*.86)+' '+f(y+r*.5)+'Q'+x+' '+f(y+r*.72)+' '+f(x+r*.86)+' '+f(y+r*.5)+'"/></g>';
}

var SC = {};

/* ── your home ──────────────────────────────────────────── */
SC.phone = (function(){
  var s = I.begin() + icon('phone', 40, 92, 1.5) + name(40, 112, 'Your phone', '192.168.1.7');
  var ports = [['51343','YouTube',30,RED], ['51344','WhatsApp',70,GREEN], ['51345','Gmail',110,BLUE]];
  ports.forEach(function(p, i){
    var d = path([[54,70],[78,p[2]],[150,p[2]],[196,70],[238,70]]);
    s += wire(d, p[3], 'thin') + mv(d, p[3], 2.6, i*0.55, 4.5);
  });
  ports.forEach(function(p){
    s += T(86, p[2]-7, '<tspan font-weight="600" fill="'+p[3]+'">'+p[1]+'</tspan> :'+p[0], { a:'start', fs:8.5 });
  });
  s += card(240, 46, 104, 48, 'The wire', 'access', 'one public address');
  s += tag(292, 112, 'all three share it', '', 'middle', 8.5);
  return stage(s, 'Three apps on one phone send through one IP address, kept apart by different port numbers.',
    '<b>One address, three conversations.</b> Every packet carries a four-tuple — your IP, your port, the server IP, the server port — and that is the only thing keeping YouTube’s bytes out of your inbox.', 134);
})();

SC.wifi = (function(){
  var s = I.begin() + icon('phone', 40, 54, 1.3) + name(40, 72, 'Phone');
  s += icon('laptop', 40, 122, 1.25) + name(40, 140, 'Laptop');
  s += icon('router', 308, 92, 1.5) + name(308, 112, 'Router');
  var a = path([[62,40],[180,52],[284,76]]), b = path([[70,112],[180,104],[284,86]]);
  s += wire(a, 'var(--home)') + wire(b, 'var(--ink-3)', 'alt');
  s += mv(a, GREEN, 3.2, 0, 5);
  s += mv(b, ORANGE, 3.2, 1.6, 5);
  s += '<g class="blink" style="--dly:0s">'+tag(176, 36, 'talking', 'ok', 'middle', 9)+'</g>';
  s += '<g class="blink" style="--dly:1.4s">'+tag(176, 128, 'waiting its turn', 'hot', 'middle', 9)+'</g>';
  s += '<g class="pulse"><path d="M298 44Q308 36 318 44M292 38Q308 26 324 38" fill="none" stroke="'+RED+'" stroke-width="2" stroke-linecap="round"/></g>';
  return stage(s, 'Two devices take turns on the same Wi-Fi channel; while one transmits the other must wait.',
    '<b>The air is one room.</b> Wi-Fi is half duplex — listen first, and if someone is mid-sentence, back off a random moment and try again. That taking of turns is why a 300 Mbps link really delivers about half that.', 150);
})();

SC.router = (function(){
  var s = I.begin() + icon('phone', 34, 82, 1.4) + name(34, 101, 'Phone', '192.168.1.7');
  s += icon('router', 180, 42, 1.3);
  s += card(120, 54, 120, 64, '', 'home');
  s += T(180, 70, 'NAT table', { cls:'sc-l', fs:10, halo:false });
  s += '<line x1="130" y1="77" x2="230" y2="77" stroke="var(--home)" stroke-width="1" opacity=".5"/>';
  s += T(130, 90, 'inside', { a:'start', fs:7.5, halo:false }) + T(230, 90, 'outside', { a:'end', fs:7.5, halo:false });
  s += T(130, 106, '.1.7:51343', { a:'start', fs:8, halo:false }) + T(190, 106, '→', { fs:8, halo:false }) +
       T(230, 106, ':62001', { a:'end', c:'hot', fs:8, halo:false });
  s += icon('building', 322, 88, 1, 'var(--access)') + name(322, 108, 'Airtel');
  var a = path([[52,70],[120,70]], false), b = path([[240,70],[300,70]], false);
  s += wire(a, 'var(--home)') + wire(b, 'var(--access)');
  s += mv(a, RED, 3, 0, 4.5) + mv(b, RED, 3, 0.7, 4.5);
  s += tag(88, 60, 'from .1.7', '', 'middle', 8);
  s += '<g class="fadecyc">'+tag(268, 60, 'now :62001', 'hot', 'middle', 8)+'</g>';
  return stage(s, 'The router rewrites the packet source address and port on the way out and reverses it on the way back.',
    '<b>NAT, in one picture.</b> Your private address is swapped for the router’s public one and the change is written into a table. The reply comes back to port 62001, the table says that means the phone, and nothing outside ever hears of 192.168.1.7.', 130);
})();

SC.tv = (function(){
  var s = I.begin() + icon('phone', 40, 104, 1.4) + name(40, 124, 'Phone');
  s += icon('router', 176, 104, 1.4) + name(176, 124, 'Router');
  s += icon('tv', 314, 106, 1.25) + name(314, 124, 'Smart TV');
  var a = path([[58,88],[150,88]], false), b = path([[202,88],[290,88]], false);
  s += wire(a, 'var(--home)') + wire(b, 'var(--home)');
  s += mv(a, GREEN, 2.8, 0, 5) + mv(b, GREEN, 2.8, 0.55, 5);
  var up = path([[176,70],[176,30],[222,30]], false);
  s += wire(up, 'var(--ink-3)', 'alt thin');
  s += cross(232, 30, 6, RED);
  s += globe(262, 30, 13);
  s += tag(282, 34, 'never leaves', 'hot', 'start', 8.5);
  s += tag(176, 146, 'one hop, no internet involved', 'ok', 'middle', 9);
  return stage(s, 'Traffic between two devices on the same home network stops at the router and never reaches the internet.',
    '<b>Local really means local.</b> Casting to the TV goes phone → router → TV and stops. Airtel never sees a byte of it, which is why it keeps working when your internet is down.', 156);
})();

SC.laptop = (function(){
  var s = I.begin() + panel(4, 4, 172, 132, 'Cable — full duplex', 'ok') + panel(184, 4, 172, 132, 'Wi-Fi — half duplex', 'hot');
  s += icon('laptop', 36, 82, 1.1) + name(36, 100, 'PC');
  s += icon('router', 144, 82, 1.1) + name(144, 100, 'Router');
  var a = path([[58,58],[122,58]], false), b = path([[122,72],[58,72]], false);
  s += wire(a, GREEN) + wire(b, GREEN);
  s += mv(a, GREEN, 2, 0, 4) + mv(b, GREEN, 2, 0, 4);
  s += tag(90, 124, 'both at once', 'ok', 'middle', 9);
  s += icon('laptop', 216, 82, 1.1) + name(216, 100, 'PC');
  s += icon('router', 324, 82, 1.1) + name(324, 100, 'AP');
  var c = path([[238,65],[302,65]], false);
  s += wire(c, ORANGE, 'alt');
  s += mv(c, ORANGE, 3.4, 0, 4) + mv(c, ORANGE, 3.4, 1.7, 4);
  s += tag(270, 124, 'one at a time', 'hot', 'middle', 9);
  return stage(s, 'On a cable both directions run at once; on Wi-Fi only one station may transmit at a time.',
    '<b>Why the cable always wins.</b> Copper gives each direction its own pair of wires, so a collision is impossible. Air cannot be split that way, so everything queues — including the router.', 140);
})();

/* ── the last mile ──────────────────────────────────────── */
SC.tower = (function(){
  var s = I.begin() + icon('tower', 56, 82, 1.25) + name(56, 100, 'Tower A');
  s += icon('tower', 304, 82, 1.25, GREEN) + name(304, 100, 'Tower B');
  s += icon('phone', 180, 132, 1.3) + name(180, 150, 'Your phone', 'moving →');
  var a = path([[70,62],[124,96],[164,112]]), b = path([[290,62],[236,96],[196,112]]);
  s += wire(a, 'var(--access)') + '<g class="fadecyc" style="--dly:1.4s">'+wire(b, GREEN)+'</g>';
  s += '<g class="blink" style="--dly:1.4s">'+wire(a, RED, 'alt')+'</g>';
  var hand = path([[76,30],[180,10],[284,30]]);
  s += wire(hand, BLUE, 'alt thin') + mv(hand, BLUE, 3.2, 0.4, 4.5);
  s += tag(180, 36, 'buffered packets forwarded', '', 'middle', 8.5);
  s += tag(180, 78, 'your IP never changes', 'ok', 'middle', 9);
  return stage(s, 'As the phone moves, the network hands it to the next tower and forwards its buffered packets, keeping the same IP address.',
    '<b>The handover.</b> Your phone measures the neighbouring cells and the network decides when to switch. Because the address survives, your TCP connections never notice — and this happens dozens of times on a drive to work.', 170);
})();

SC.mcore = (function(){
  var s = I.begin() + icon('tower', 36, 92, 1.2) + name(36, 110, 'Tower');
  s += card(132, 8, 108, 44, 'Control plane', 'core', 'who are you?');
  s += card(132, 98, 108, 44, 'User plane', 'core', 'your data');
  s += globe(318, 120, 18) + name(318, 152, 'Internet');
  var up = path([[54,58],[96,30],[132,30]]), dn = path([[54,84],[96,120],[132,120]]);
  s += wire(up, 'var(--core)', 'alt') + wire(dn, 'var(--core)');
  s += mv(up, YELLOW, 3.4, 0, 4.5) + mv(dn, RED, 2.6, 0.3, 5);
  var out = path([[240,120],[300,120]], false);
  s += wire(out, 'var(--net)') + mv(out, RED, 2.6, 1.2, 5);
  s += tag(186, 79, 'signalling only — no data here', '', 'middle', 8.5);
  return stage(s, 'Signalling goes to the control plane while the data itself passes straight through the user plane to the internet.',
    '<b>Two planes, one core.</b> Authentication, your plan and your session live in the control plane; your actual packets never touch it. Splitting them is what lets the data path be pushed out to the edge for low latency.', 160);
})();

SC.splitter = (function(){
  var s = I.begin() + icon('building', 312, 86, 1.15, 'var(--access)') + name(312, 108, 'The exchange', 'one fibre');
  var homes = ['Home 1', 'Home 2', 'Home 3'];
  homes.forEach(function(h, i){
    var y = 30 + i*46;
    var d = path([[54,y],[130,y],[176,74],[284,74]]);
    s += '<g class="slot" style="--dly:'+(i*1.07)+'s">'+wire(d, ORANGE)+'</g>';
    s += mv(d, ORANGE, 3.21, i*1.07, 4.5);
  });
  homes.forEach(function(h, i){
    var y = 30 + i*46;
    s += icon('home', 26, y+8, .95) + T(48, y-8, h, { cls:'sc-l', fs:9.5, a:'start' });
  });
  s += '<circle cx="182" cy="74" r="8" fill="var(--surface)" stroke="'+GREEN+'" stroke-width="2"/>'+dot(182, 74, 3.5, GREEN);
  s += tag(194, 93, 'splitter', '', 'start', 8);
  s += tag(180, 146, 'each home fires only in its own slot', '', 'middle', 9);
  return stage(s, 'Three homes share one fibre by transmitting in strict rotation, each only during its assigned time slot.',
    '<b>Taking turns, in microseconds.</b> Upstream would collide, so the exchange hands every home a precise slot and the ONT only fires its laser inside it. That is TDMA — and the splitter in the middle has no power and no brain.', 156);
})();

SC.olt = (function(){
  var s = I.begin() + '';
  [22, 52, 82, 112].forEach(function(y, i){
    var d = path([[44,y],[100,y],[140,70]]);
    s += wire(d, ORANGE, 'thin') + mv(d, ORANGE, 2.8, i*0.32, 3.8);
  });
  [22, 52, 82, 112].forEach(function(y){ s += icon('home', 24, y+7, .8); });
  s += icon('rack', 172, 96, 1.4, ORANGE) + name(172, 116, 'OLT', 'light → packets');
  var up = path([[204,70],[262,70]], false);
  s += wire(up, 'var(--access)') + mv(up, RED, 2.8, 1.3, 5.5);
  s += card(264, 46, 84, 48, '10G', 'core', 'uplink', { fs:13 });
  s += tag(306, 112, 'hundreds of homes,', '', 'middle', 8.5) + tag(306, 124, 'one uplink', '', 'middle', 8.5);
  return stage(s, 'Many home fibres arrive at the OLT, which converts the light back to packets and aggregates them onto one fast uplink.',
    '<b>Where light becomes packets again.</b> The OLT also measures the exact distance to every home so a house 500 m away and one 4 km away can both hit their slot to the nanosecond.', 134);
})();

window.SCENES = SC;
window.__SCENE_KIT = { box:card, card:card, panel:panel, path:path, wire:wire, mv:mv, tag:tag, T:T, name:name, dot:dot,
  cross:cross, stage:stage, icon:icon, globe:globe, divider:divider };
})();

/* ── the carrier core and the open internet ─────────────── */
(function(){
'use strict';
var K = window.__SCENE_KIT, SC = window.SCENES, I = window.ISO;
var card = K.card, panel = K.panel, path = K.path, wire = K.wire, mv = K.mv, tag = K.tag, T = K.T, name = K.name,
    dot = K.dot, cross = K.cross, stage = K.stage, icon = K.icon, globe = K.globe, divider = K.divider;
var RED = 'var(--c-red)', GREEN = 'var(--c-green)', ORANGE = 'var(--c-orange)', YELLOW = 'var(--c-yellow)';

SC.bng = (function(){
  var s = I.begin() + icon('home', 38, 86, 1.3) + name(38, 108, 'Your home', 'a device');
  s += card(126, 34, 108, 80, '', 'core');
  s += T(180, 54, 'CGNAT', { cls:'sc-l', fs:10.5, halo:false }) + T(180, 66, 'the table', { fs:8, halo:false });
  s += '<rect x="134" y="74" width="92" height="13" rx="3" fill="var(--surface)" opacity=".8"/>' +
       T(180, 84, 'you ⇄ :4410 ✓', { fs:7.5, c:'ok', halo:false });
  s += '<rect x="134" y="91" width="92" height="13" rx="3" fill="none" stroke="var(--core)" stroke-dasharray="2 2" opacity=".6"/>' +
       T(180, 101, 'no entry', { fs:7.5, c:'hot', halo:false });
  s += globe(320, 74, 20) + name(320, 108, 'The internet');
  var out = path([[60,70],[126,58]]), out2 = path([[234,58],[300,66]]);
  s += wire(out, GREEN) + wire(out2, GREEN);
  s += mv(out, GREEN, 3, 0, 4.5) + mv(out2, GREEN, 3, 0.62, 4.5);
  s += tag(180, 22, 'outbound — an entry is written', 'ok', 'middle', 8.5);
  var inb = path([[302,92],[256,98]], false);
  s += wire(inb, RED, 'alt') + mv(inb, RED, 3, 0.4, 4.5, 'bounce');
  s += cross(250, 98, 6, RED);
  s += tag(180, 134, 'inbound — no entry, so it is dropped', 'hot', 'middle', 8.5);
  return stage(s, 'Outbound traffic creates a translation entry and succeeds; unrequested inbound traffic finds no entry and is dropped.',
    '<b>Why port forwarding does nothing.</b> A translation entry only exists because <i>you</i> started the connection. Nobody on the outside can create one, so your CCTV, your game server and your home NAS stay unreachable.', 144);
})();

SC.backbone = (function(){
  var pts = [[34,92],[106,54],[180,96],[254,54],[326,92]];
  var s = I.begin(), i, d, top = function(p){ return [p[0], p[1]-6]; };
  s += tag(180, 16, 'longest prefix match, then forget the packet', '', 'middle', 8.5);
  for(i = 0; i < pts.length-1; i++){
    d = path([top(pts[i]), top(pts[i+1])], false);
    s += wire(d, 'var(--core)');
  }
  pts.forEach(function(p, i){
    s += '<g class="blink" style="--dly:'+(i*0.62)+'s"><ellipse cx="'+p[0]+'" cy="'+(p[1]-2)+'" rx="20" ry="12" fill="var(--core-bg)" stroke="var(--core)" stroke-width="1" opacity=".9"/></g>';
    s += icon('puck', p[0], p[1]+2, 1);
  });
  pts.forEach(function(p, i){
    s += '<rect x="'+(p[0]-11)+'" y="'+(p[1]+14)+'" width="22" height="14" rx="7" fill="var(--core-bg)" stroke="var(--core)" stroke-width="1"/>'+
      T(p[0], p[1]+24, 'R'+(i+1), { fs:8, w:600, halo:false });
  });
  for(i = 0; i < pts.length-1; i++){
    d = path([top(pts[i]), top(pts[i+1])], false);
    s += mv(d, RED, 3.4, i*0.62, 4.5);
  }
  s += tag(180, 140, 'each router knows only the next hop — nobody holds the route', '', 'middle', 8.5);
  return stage(s, 'A packet hops from router to router, each one independently choosing only the next hop.',
    '<b>No one has the map.</b> Each router reads the destination, finds the longest matching prefix, pushes the packet out of a port and keeps no memory of it. That is why the core can be so fast — and why reliability had to be invented at the edges.', 150);
})();

SC.resolver = (function(){
  var s = I.begin() + panel(4, 4, 172, 136, 'first person to ask', 'hot') + panel(184, 4, 172, 136, 'everyone after', 'ok');
  s += icon('phone', 30, 98, 1.2) + name(30, 118, 'You');
  s += icon('rack', 118, 100, 1.1, YELLOW) + name(118, 118, 'Resolver');
  var a = path([[44,80],[98,80]], false);
  s += wire(a, 'var(--core)') + mv(a, RED, 3.4, 0, 4.5);
  var up = path([[118,58],[118,42],[160,42]], false);
  s += wire(up, 'var(--ink-3)', 'alt thin') + mv(up, YELLOW, 3.4, 0.5, 4);
  s += T(166, 34, 'root · .com · ns1', { a:'end', fs:7.5 });
  s += tag(90, 132, '3 round trips · ~90 ms', 'hot', 'middle', 8.5);
  s += icon('phone', 210, 98, 1.2) + name(210, 118, 'You');
  s += icon('cache', 300, 98, 1.2, 'var(--c-tan)') + name(300, 118, 'Cache');
  var b = path([[224,80],[282,80]], false);
  s += wire(b, GREEN) + mv(b, GREEN, 1.5, 0, 4.5);
  s += tag(270, 132, 'from memory · <1 ms', 'ok', 'middle', 8.5);
  return stage(s, 'The first lookup walks the DNS tree over several round trips; later lookups are answered instantly from the resolver cache.',
    '<b>Caching is what makes DNS survive.</b> Only the first person to ask after the TTL expires pays the full cost. Everyone else gets the answer from memory — which is also why an IP change lingers in caches worldwide for exactly one TTL.', 144);
})();

SC.dnstree = (function(){
  var s = I.begin() + card(8, 86, 72, 40, 'Resolver', 'core');
  var steps = [['Root', 106, '→ ask .com'], ['.com', 186, '→ ask ns1'], ['Google', 266, 'the answer']];
  steps.forEach(function(st, i){
    var cx = st[1]+38, d = path([[80,106],[cx,106],[cx,54]], false);
    s += '<g class="fadecyc" style="--dly:'+(i*1.0)+'s">'+wire(d, 'var(--net)', 'alt thin')+'</g>';
  });
  steps.forEach(function(st, i){
    var cx = st[1]+38;
    s += card(st[1], 12, 76, 42, st[0], 'net', st[2]);
    s += mv(path([[80,106],[cx,106],[cx,54]], false), YELLOW, 3.2, i*1.0, 4.5);
    s += '<circle cx="'+cx+'" cy="106" r="3" fill="var(--net)"/>';
  });
  s += tag(44, 140, 'one questioner', '', 'middle', 8.5) + tag(228, 140, 'each level only knows who to ask next', '', 'middle', 8.5);
  return stage(s, 'The resolver asks the root, then the .com servers, then Google’s own servers, one referral at a time.',
    '<b>Nobody holds the whole phone book.</b> Read <code>www.youtube.com</code> backwards and that is the order it is resolved in. Each level answers only "ask them next", which is exactly why no single failure can take DNS down.', 150);
})();

SC.ggc = (function(){
  var s = I.begin() + icon('phone', 34, 90, 1.4) + name(34, 110, 'You');
  s += card(130, 10, 110, 44, 'Cache in Airtel', 'core', '5–15 ms');
  s += card(130, 96, 110, 44, 'Oregon', 'net', '200–250 ms');
  var near = path([[52,62],[94,34],[130,32]]), far = path([[52,82],[94,116],[130,118]]);
  s += wire(near, GREEN) + wire(far, RED, 'alt');
  s += mv(near, GREEN, 1.3, 0, 5) + mv(far, RED, 5.2, 0, 5);
  s += tag(252, 36, 'already there', 'ok', 'start', 9) + tag(252, 122, 'crosses an ocean', 'hot', 'start', 9);
  s += '<g class="pulse">'+dot(229, 21, 3.5, GREEN)+'</g>';
  return stage(s, 'The cached copy inside Airtel answers almost instantly while the overseas origin takes twenty times longer.',
    '<b>Same plan, twenty times the wait.</b> Watch the two dots — the green one is a Google server racked inside an Airtel datacentre. Nothing you can buy improves the red one; the only fix is not making the journey.', 148);
})();

SC.ixp = (function(){
  var s = I.begin() + panel(4, 4, 172, 150, 'without an exchange', 'hot') + panel(184, 4, 172, 150, 'with one', 'ok');
  s += icon('building', 42, 66, .9, 'var(--core)') + name(42, 84, 'Airtel');
  s += icon('building', 138, 66, .9, 'var(--access)') + name(138, 84, 'Jio');
  var far = path([[58,54],[76,42],[90,122],[104,42],[122,54]]);
  s += wire(far, RED, 'alt') + mv(far, RED, 4.6, 0, 4.5);
  s += globe(90, 116, 9);
  s += tag(90, 144, 'via a paid carrier abroad', 'hot', 'middle', 8);
  s += icon('building', 222, 66, .9, 'var(--core)') + name(222, 84, 'Airtel');
  s += icon('building', 318, 66, .9, 'var(--access)') + name(318, 84, 'Jio');
  var full = path([[226,94],[250,112],[290,112],[314,94]]);
  s += wire(full, GREEN);
  s += mv(full, GREEN, 2.2, 0, 4.5);
  s += card(242, 100, 56, 26, 'NIXI', 'net', '', { fs:10 });
  s += tag(270, 144, 'across the room, free', 'ok', 'middle', 8);
  return stage(s, 'Without a local exchange two Indian networks meet abroad; with one they hand traffic straight across a room in Mumbai.',
    '<b>Why NIXI was built.</b> An email between two Delhi users could genuinely travel to America and back, because that was where the networks met. Peering at an exchange made it faster <i>and</i> cheaper at the same time.', 158);
})();

SC.subsea = (function(){
  var s = I.begin() + '<path d="M0 100Q45 94 90 100T180 100T270 100T360 100V136H0Z" fill="var(--net-bg)"/>' +
    '<path d="M0 100Q45 94 90 100T180 100T270 100T360 100" fill="none" stroke="var(--net)" stroke-width="1.2" opacity=".55"/>';
  s += icon('building', 38, 66, 1, 'var(--core)') + name(38, 88, 'Mumbai');
  s += icon('building', 322, 66, 1, 'var(--net)') + name(322, 88, 'Oregon');
  var d = path([[54,70],[74,100],[120,128],[180,114],[240,128],[286,100],[306,70]]);
  s += wire(d, 'var(--net)');
  s += mv(d, ORANGE, 5.4, 0, 5.5);
  s += mv(d, ORANGE, 5.4, 2.7, 5.5);
  s += tag(180, 40, '~20,000 km of glass', '', 'middle', 9.5);
  s += tag(180, 154, 'light manages 200 km per millisecond', '', 'middle', 8.5);
  s += tag(180, 168, 'so the round trip cannot go below ~200 ms', 'hot', 'middle', 8.5);
  return stage(s, 'A packet crawls the length of a submarine cable from Mumbai to Oregon, bounded by the speed of light in glass.',
    '<b>The one delay money cannot fix.</b> Watch how long the dot takes. Upgrading your plan widens the pipe; this is about how <i>long</i> the pipe is, and no plan shortens the Pacific.', 176);
})();

SC.gdc = (function(){
  var s = I.begin() + icon('phone', 30, 90, 1.4) + name(30, 110, 'You');
  var inn = path([[46,76],[96,76]], false);
  s += wire(inn, 'var(--net)');
  [30, 76, 122].forEach(function(y, i){
    var d = path([[180,76],[226,y],[272,y]]);
    s += wire(d, 'var(--core)', 'thin');
    s += '<g class="fadecyc" style="--dly:'+(i*1.07)+'s">'+wire(d, GREEN)+'</g>';
  });
  [30, 76, 122].forEach(function(y, i){
    s += icon('rack', 290, y+14, .85, GREEN) + T(310, y+4, 'server '+(i+1), { a:'start', fs:8.5 });
    s += mv(path([[46,76],[96,76],[180,76],[226,y],[272,y]]), RED, 3.21, i*1.07, 4.5);
  });
  s += card(96, 52, 84, 48, 'Balancer', 'net', 'one IP');
  s += tag(138, 124, 'you never learn which', '', 'middle', 8.5);
  return stage(s, 'One public address fronts many machines; the load balancer picks a healthy one for each request.',
    '<b>"The cloud" is a room full of ordinary machines.</b> The IP that DNS gave you belongs to a load balancer, not a server. If the machine answering you dies mid-video, another takes over and you see nothing.', 146);
})();

SC.origin = (function(){
  var rows = [['Cached in Airtel', 8, GREEN, 1.2], ['Google Mumbai', 30, YELLOW, 2.2], ['Oregon', 220, RED, 6.0]];
  var s = I.begin() + '<line x1="14" y1="12" x2="14" y2="128" stroke="var(--ink-3)" stroke-width="1.2"/>' +
          '<line x1="346" y1="12" x2="346" y2="128" stroke="var(--ink-3)" stroke-width="1.2" stroke-dasharray="3 3"/>';
  rows.forEach(function(r, i){
    var y = 36 + i*40;
    s += T(22, y - 9, r[0], { cls:'sc-l', fs:10, a:'start' });
    s += T(338, y - 9, r[1] + ' ms', { c:i === 2 ? 'hot' : 'ok', a:'end', fs:9.5 });
    var d = path([[14,y],[346,y]], false);
    s += '<line x1="14" y1="'+y+'" x2="346" y2="'+y+'" stroke="var(--surface-3)" stroke-width="6" stroke-linecap="round"/>';
    s += mv(d, r[2], r[3], 0, 5.5);
  });
  s += tag(180, 146, 'three dots, one starting line — distance is the whole difference', '', 'middle', 8.5);
  return stage(s, 'Three packets race the same distance on screen but take wildly different real times, set only by distance.',
    '<b>Bandwidth is width; latency is length.</b> All three journeys are the same picture and utterly different experiences. Upgrading from 100 to 300 Mbps moves none of these numbers.', 154);
})();
})();
