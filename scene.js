/* scene.js — a small animated diagram for every box on the map.
   Same ink-and-hatch vocabulary as the illustrations, drawn into a 360 × 170 stage. */
(function(){
'use strict';
var S = window.SK, N = 0;

function box(x, y, w, h, label, zone, sub){
  var seed = 900 + (N += 7);
  var p = S.d(S.rrect(x, y, w, h, 7), true, 1, seed);
  var g = S.shape(p, {x:x, y:y, w:w, h:h}, { fill:'var(--'+zone+'-bg)', shade:'var(--'+zone+')',
        gap:4.4, shadeOp:.2, seed:seed, w:2, inkColor:'var(--'+zone+')' }).svg;
  g += '<text x="'+(x+w/2)+'" y="'+(y+h/2+(sub?-1:4))+'" text-anchor="middle" class="sc-l">'+label+'</text>';
  if(sub) g += '<text x="'+(x+w/2)+'" y="'+(y+h/2+11)+'" text-anchor="middle" class="sc-s">'+sub+'</text>';
  return g;
}
function path(pts, curve){
  return curve === false ? S.d(pts, false, 1, 700+(N+=3)) : S.ds(pts, false, 1.1, 700+(N+=3));
}
function wire(d, color, cls){
  return '<path class="sc-w '+(cls||'')+'" d="'+d+'" stroke="'+(color||'var(--ink-3)')+'"/>';
}
function mv(d, color, dur, delay, r, cls){
  return '<circle class="mv '+(cls||'')+'" r="'+(r||5)+'" cx="0" cy="0" fill="'+color+'" '+
    'style="offset-path:path(\''+d+'\');--dur:'+(dur||2.8)+'s;--dly:'+(delay||0)+'s"/>';
}
function tag(x, y, t, cls, anchor){
  return '<text x="'+x+'" y="'+y+'" class="sc-t '+(cls||'')+'" text-anchor="'+(anchor||'middle')+'">'+t+'</text>';
}
function dot(x, y, r, c, cls, dly){
  return '<circle cx="'+x+'" cy="'+y+'" r="'+r+'" fill="'+c+'" class="'+(cls||'')+'" style="--dly:'+(dly||0)+'s"/>';
}
function cross(x, y, r, c){
  return '<g stroke="'+c+'" stroke-width="3" stroke-linecap="round"><line x1="'+(x-r)+'" y1="'+(y-r)+'" x2="'+(x+r)+'" y2="'+(y+r)+
    '"/><line x1="'+(x+r)+'" y1="'+(y-r)+'" x2="'+(x-r)+'" y2="'+(y+r)+'"/></g>';
}
function stage(inner, aria, cap){
  return '<figure class="sc"><svg viewBox="0 0 360 170" role="img" aria-label="'+aria+'">'+inner+
    '</svg><figcaption>'+cap+'</figcaption></figure>';
}

var SC = {};

/* ── your home ──────────────────────────────────────────── */
SC.phone = (function(){
  var s = box(10, 46, 78, 78, 'Your phone', 'home', '192.168.1.7');
  var ports = [['51343','YouTube',60,'var(--c-red)'], ['51344','WhatsApp',85,'var(--c-green)'], ['51345','Gmail',110,'var(--c-blue)']];
  ports.forEach(function(p, i){
    var d = path([[88,p[2]],[150,p[2]],[218,85]]);
    s += wire(d, p[3], 'thin') + mv(d, p[3], 2.6, i*0.55, 4);
    s += tag(96, p[2]-6, ':'+p[0], '', 'start');
  });
  s += box(222, 58, 74, 54, 'The wire', 'access', 'one address');
  s += tag(259, 130, 'all three share it', '');
  return stage(s, 'Three apps on one phone send through one IP address, kept apart by different port numbers.',
    '<b>One address, three conversations.</b> Every packet carries a four-tuple — your IP, your port, the server IP, the server port — and that is the only thing keeping YouTube’s bytes out of your inbox.');
})();

SC.wifi = (function(){
  var s = box(10, 24, 72, 46, 'Phone', 'home') + box(10, 100, 72, 46, 'Laptop', 'home');
  s += box(268, 62, 78, 46, 'Router', 'home');
  var a = path([[82,47],[180,60],[268,80]]), b = path([[82,123],[180,108],[268,90]]);
  s += wire(a, 'var(--home)') + wire(b, 'var(--ink-3)', 'alt');
  s += mv(a, 'var(--c-green)', 3.2, 0, 5);
  s += mv(b, 'var(--c-orange)', 3.2, 1.6, 5);
  s += '<g class="blink" style="--dly:0s">'+tag(150, 34, 'talking', 'ok')+'</g>';
  s += '<g class="blink" style="--dly:1.4s">'+tag(150, 146, 'waiting its turn', 'hot')+'</g>';
  s += '<g class="pulse">'+dot(307, 85, 6, 'var(--c-red)')+'</g>';
  return stage(s, 'Two devices take turns on the same Wi-Fi channel; while one transmits the other must wait.',
    '<b>The air is one room.</b> Wi-Fi is half duplex — listen first, and if someone is mid-sentence, back off a random moment and try again. That taking of turns is why a 300 Mbps link really delivers about half that.');
})();

SC.router = (function(){
  var s = box(8, 60, 76, 52, 'Phone', 'home', '192.168.1.7');
  s += box(140, 46, 88, 80, 'Your router', 'home', 'NAT table');
  s += box(282, 60, 70, 52, 'Airtel', 'access');
  var a = path([[84,86],[140,86]], false), b = path([[228,86],[282,86]], false);
  s += wire(a, 'var(--home)') + wire(b, 'var(--access)');
  s += mv(a, 'var(--c-red)', 3, 0, 5) + mv(b, 'var(--c-red)', 3, 0.7, 5);
  s += tag(112, 74, 'from', '', 'middle') + tag(112, 112, '192.168.1.7', '', 'middle');
  s += '<g class="fadecyc">'+tag(255, 74, 'rewritten')+tag(255, 112, ':62001', 'hot')+'</g>';
  s += tag(184, 104, '51343 → 62001', '');
  return stage(s, 'The router rewrites the packet source address and port on the way out and reverses it on the way back.',
    '<b>NAT, in one picture.</b> Your private address is swapped for the router’s public one and the change is written into a table. The reply comes back to port 62001, the table says that means the phone, and nothing outside ever hears of 192.168.1.7.');
})();

SC.tv = (function(){
  var s = box(8, 54, 70, 58, 'Phone', 'home') + box(136, 54, 76, 58, 'Router', 'home');
  s += box(266, 54, 78, 58, 'Smart TV', 'home');
  var a = path([[78,83],[136,83]], false), b = path([[212,83],[266,83]], false);
  s += wire(a, 'var(--home)') + wire(b, 'var(--home)');
  s += mv(a, 'var(--c-green)', 2.8, 0, 5) + mv(b, 'var(--c-green)', 2.8, 0.55, 5);
  var up = path([[174,54],[174,20],[300,20]]);
  s += wire(up, 'var(--ink-3)', 'alt thin');
  s += cross(250, 20, 7, 'var(--c-red)');
  s += tag(310, 24, 'never leaves', 'hot', 'start');
  s += tag(176, 140, 'one hop, no internet involved', 'ok');
  return stage(s, 'Traffic between two devices on the same home network stops at the router and never reaches the internet.',
    '<b>Local really means local.</b> Casting to the TV goes phone → router → TV and stops. Airtel never sees a byte of it, which is why it keeps working when your internet is down.');
})();

SC.laptop = (function(){
  var s = tag(80, 20, 'Cable — full duplex', 'ok') + tag(280, 20, 'Wi-Fi — half duplex', 'hot');
  s += box(12, 44, 54, 40, 'PC', 'home') + box(112, 44, 54, 40, 'Router', 'home');
  var a = path([[66,56],[112,56]], false), b = path([[112,74],[66,74]], false);
  s += wire(a, 'var(--c-green)') + wire(b, 'var(--c-green)');
  s += mv(a, 'var(--c-green)', 2, 0, 4.5) + mv(b, 'var(--c-green)', 2, 0, 4.5);
  s += tag(89, 100, 'both at once', 'ok');
  s += box(210, 44, 54, 40, 'PC', 'access') + box(300, 44, 50, 40, 'AP', 'access');
  var c = path([[264,64],[300,64]], false);
  s += wire(c, 'var(--c-orange)');
  s += mv(c, 'var(--c-orange)', 3.4, 0, 4.5) + mv(c, 'var(--c-orange)', 3.4, 1.7, 4.5);
  s += tag(285, 100, 'one at a time', 'hot');
  s += '<line x1="188" y1="14" x2="188" y2="156" stroke="var(--ink-3)" stroke-width="1.4" stroke-dasharray="4 5" opacity=".6"/>';
  s += tag(180, 140, 'same plan, same router', '', 'end');
  return stage(s, 'On a cable both directions run at once; on Wi-Fi only one station may transmit at a time.',
    '<b>Why the cable always wins.</b> Copper gives each direction its own pair of wires, so a collision is impossible. Air cannot be split that way, so everything queues — including the router.');
})();

/* ── the last mile ──────────────────────────────────────── */
SC.tower = (function(){
  var s = box(24, 30, 66, 44, 'Tower A', 'access') + box(258, 30, 66, 44, 'Tower B', 'access');
  s += box(140, 108, 74, 46, 'Your phone', 'home', 'moving →');
  var a = path([[70,74],[150,108]]), b = path([[286,74],[206,108]]);
  s += wire(a, 'var(--access)') + '<g class="fadecyc" style="--dly:1.4s">'+wire(b, 'var(--c-green)')+'</g>';
  s += '<g class="blink" style="--dly:1.4s">'+wire(a, 'var(--c-red)', 'alt')+'</g>';
  var hand = path([[90,52],[174,36],[258,52]]);
  s += wire(hand, 'var(--c-blue)', 'alt thin') + mv(hand, 'var(--c-blue)', 3.2, 0.4, 4.5);
  s += tag(174, 26, 'buffered packets forwarded', '');
  s += tag(174, 90, 'your IP never changes', 'ok');
  return stage(s, 'As the phone moves, the network hands it to the next tower and forwards its buffered packets, keeping the same IP address.',
    '<b>The handover.</b> Your phone measures the neighbouring cells and the network decides when to switch. Because the address survives, your TCP connections never notice — and this happens dozens of times on a drive to work.');
})();

SC.mcore = (function(){
  var s = box(8, 60, 66, 50, 'Tower', 'access');
  s += box(150, 14, 92, 44, 'Control plane', 'core', 'who are you?');
  s += box(150, 106, 92, 44, 'User plane', 'core', 'your data');
  s += box(286, 106, 64, 44, 'Internet', 'net');
  var up = path([[74,74],[112,40],[150,36]]), dn = path([[74,96],[112,128],[150,128]]);
  s += wire(up, 'var(--core)', 'alt') + wire(dn, 'var(--core)');
  s += mv(up, 'var(--c-yellow)', 3.4, 0, 4.5) + mv(dn, 'var(--c-red)', 2.6, 0.3, 5);
  var out = path([[242,128],[286,128]], false);
  s += wire(out, 'var(--net)') + mv(out, 'var(--c-red)', 2.6, 1.2, 5);
  s += tag(196, 80, 'signalling only — no data here', '');
  return stage(s, 'Signalling goes to the control plane while the data itself passes straight through the user plane to the internet.',
    '<b>Two planes, one core.</b> Authentication, your plan and your session live in the control plane; your actual packets never touch it. Splitting them is what lets the data path be pushed out to the edge for low latency.');
})();

SC.splitter = (function(){
  var s = box(252, 58, 96, 54, 'The exchange', 'access', 'one fibre');
  var homes = ['Home 1', 'Home 2', 'Home 3'];
  homes.forEach(function(h, i){
    var y = 26 + i*54;
    s += box(8, y, 62, 38, h, 'home');
    var d = path([[70,y+19],[150,y+19],[190,85],[252,85]]);
    s += '<g class="slot" style="--dly:'+(i*1.07)+'s">'+wire(d, 'var(--c-orange)')+'</g>';
    s += mv(d, 'var(--c-orange)', 3.21, i*1.07, 4.5);
  });
  s += dot(196, 85, 7, 'var(--c-green)');
  s += tag(196, 150, 'each home fires only in its own slot', '');
  return stage(s, 'Three homes share one fibre by transmitting in strict rotation, each only during its assigned time slot.',
    '<b>Taking turns, in microseconds.</b> Upstream would collide, so the exchange hands every home a precise slot and the ONT only fires its laser inside it. That is TDMA — and the splitter in the middle has no power and no brain.');
})();

SC.olt = (function(){
  var s = '';
  [30, 62, 94, 126].forEach(function(y, i){
    s += box(8, y-15, 56, 30, 'home', 'home');
    var d = path([[64,y],[118,y],[150,78]]);
    s += wire(d, 'var(--c-orange)', 'thin') + mv(d, 'var(--c-orange)', 2.8, i*0.32, 4);
  });
  s += box(154, 40, 76, 76, 'OLT', 'access', 'light → packets');
  var up = path([[230,78],[290,78]], false);
  s += wire(up, 'var(--access)') + mv(up, 'var(--c-red)', 2.8, 1.3, 6);
  s += box(294, 52, 58, 52, '10G', 'core', 'uplink');
  s += tag(192, 132, 'hundreds of homes, one uplink', '');
  return stage(s, 'Many home fibres arrive at the OLT, which converts the light back to packets and aggregates them onto one fast uplink.',
    '<b>Where light becomes packets again.</b> The OLT also measures the exact distance to every home so a house 500 m away and one 4 km away can both hit their slot to the nanosecond.');
})();

window.SCENES = SC;
window.__SCENE_KIT = { box:box, path:path, wire:wire, mv:mv, tag:tag, dot:dot, cross:cross, stage:stage };
})();

/* ── the carrier core and the open internet ─────────────── */
(function(){
'use strict';
var K = window.__SCENE_KIT, SC = window.SCENES;
var box = K.box, path = K.path, wire = K.wire, mv = K.mv, tag = K.tag, dot = K.dot, cross = K.cross, stage = K.stage;

SC.bng = (function(){
  var s = box(8, 56, 70, 56, 'Your home', 'home', 'a device');
  s += box(142, 50, 80, 68, 'CGNAT', 'core', 'the table');
  s += box(286, 56, 66, 56, 'The internet', 'net');
  var out = path([[78,72],[142,68]]), out2 = path([[222,68],[286,72]]);
  s += wire(out, 'var(--c-green)') + wire(out2, 'var(--c-green)');
  s += mv(out, 'var(--c-green)', 3, 0, 5) + mv(out2, 'var(--c-green)', 3, 0.62, 5);
  s += tag(182, 34, 'outbound \u2014 an entry is written', 'ok');
  var inb = path([[286,104],[228,104]], false);
  s += wire(inb, 'var(--c-red)', 'alt') + mv(inb, 'var(--c-red)', 3, 0.4, 5, 'bounce');
  s += cross(224, 104, 8, 'var(--c-red)');
  s += tag(182, 148, 'inbound \u2014 no entry, so it is dropped', 'hot');
  s += tag(318, 132, 'turned back', 'hot');
  return stage(s, 'Outbound traffic creates a translation entry and succeeds; unrequested inbound traffic finds no entry and is dropped.',
    '<b>Why port forwarding does nothing.</b> A translation entry only exists because <i>you</i> started the connection. Nobody on the outside can create one, so your CCTV, your game server and your home NAS stay unreachable.');
})();

SC.backbone = (function(){
  var pts = [[26,90],[104,48],[186,104],[264,52],[332,92]];
  var s = '', i, d;
  for(i = 0; i < pts.length-1; i++){
    d = path([pts[i], pts[i+1]]);
    s += wire(d, 'var(--core)') + mv(d, 'var(--c-red)', 3.4, i*0.62, 5.5);
  }
  pts.forEach(function(p, i){
    s += '<g class="blink" style="--dly:'+(i*0.62)+'s">'+dot(p[0], p[1], 11, 'var(--core-bg)')+'</g>';
    s += '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="11" fill="none" stroke="var(--core)" stroke-width="2"/>';
    s += tag(p[0], p[1]+4, String(i+1), '');
  });
  s += tag(180, 150, 'each router knows only the next hop — nobody holds the route', '');
  s += tag(180, 22, 'longest prefix match, then forget the packet', '');
  return stage(s, 'A packet hops from router to router, each one independently choosing only the next hop.',
    '<b>No one has the map.</b> Each router reads the destination, finds the longest matching prefix, pushes the packet out of a port and keeps no memory of it. That is why the core can be so fast — and why reliability had to be invented at the edges.');
})();

SC.resolver = (function(){
  var s = tag(88, 18, 'first person to ask', 'hot') + tag(272, 18, 'everyone after', 'ok');
  s += box(10, 52, 58, 46, 'You', 'home');
  s += box(96, 52, 66, 46, 'Resolver', 'core');
  var a = path([[68,75],[96,75]], false);
  s += wire(a, 'var(--core)') + mv(a, 'var(--c-red)', 3.4, 0, 4.5);
  var up = path([[129,52],[129,26],[168,26]]);
  s += wire(up, 'var(--ink-3)', 'alt thin') + mv(up, 'var(--c-yellow)', 3.4, 0.5, 4);
  s += tag(88, 126, '3 round trips · ~90 ms', 'hot');
  s += '<line x1="190" y1="14" x2="190" y2="156" stroke="var(--ink-3)" stroke-width="1.4" stroke-dasharray="4 5" opacity=".6"/>';
  s += box(206, 52, 58, 46, 'You', 'home') + box(292, 52, 58, 46, 'Cache', 'core');
  var b = path([[264,75],[292,75]], false);
  s += wire(b, 'var(--c-green)') + mv(b, 'var(--c-green)', 1.5, 0, 4.5);
  s += tag(278, 126, 'straight from memory · <1 ms', 'ok');
  return stage(s, 'The first lookup walks the DNS tree over several round trips; later lookups are answered instantly from the resolver cache.',
    '<b>Caching is what makes DNS survive.</b> Only the first person to ask after the TTL expires pays the full cost. Everyone else gets the answer from memory — which is also why an IP change lingers in caches worldwide for exactly one TTL.');
})();

SC.dnstree = (function(){
  var s = box(8, 62, 62, 46, 'Resolver', 'core');
  var steps = [['Root', 106, 20, 'ask .com'], ['.com', 186, 20, 'ask ns1'], ['Google', 266, 20, 'the answer']];
  steps.forEach(function(st, i){
    s += box(st[1], st[2], 74, 42, st[0], 'net');
    var d = path([[39,62],[st[1]+37,62]]);
    s += '<g class="fadecyc" style="--dly:'+(i*1.0)+'s">'+wire(d, 'var(--net)', 'alt thin')+'</g>';
    var q = path([[39,62],[st[1]+37,62],[st[1]+37,20+42]]);
    s += mv(q, 'var(--c-yellow)', 3.2, i*1.0, 4.5);
    s += tag(st[1]+37, 78, st[3], '');
  });
  s += tag(39, 126, 'one questioner', '') + tag(220, 150, 'each level only knows who to ask next', '');
  return stage(s, 'The resolver asks the root, then the .com servers, then Google’s own servers, one referral at a time.',
    '<b>Nobody holds the whole phone book.</b> Read <code>www.youtube.com</code> backwards and that is the order it is resolved in. Each level answers only "ask them next", which is exactly why no single failure can take DNS down.');
})();

SC.ggc = (function(){
  var s = box(8, 62, 62, 46, 'You', 'home');
  s += box(126, 18, 96, 44, 'Cache in Airtel', 'core', '5–15 ms');
  s += box(126, 106, 96, 44, 'Oregon', 'net', '200–250 ms');
  var near = path([[70,74],[100,44],[126,40]]), far = path([[70,96],[100,126],[126,128]]);
  s += wire(near, 'var(--c-green)') + wire(far, 'var(--c-red)', 'alt');
  s += mv(near, 'var(--c-green)', 1.3, 0, 5.5) + mv(far, 'var(--c-red)', 5.2, 0, 5.5);
  s += '<g class="pulse">'+dot(174, 76, 6, 'var(--c-green)')+'</g>';
  s += tag(292, 40, 'already there', 'ok') + tag(292, 128, 'crosses an ocean', 'hot');
  return stage(s, 'The cached copy inside Airtel answers almost instantly while the overseas origin takes twenty times longer.',
    '<b>Same plan, twenty times the wait.</b> Watch the two dots — the green one is a Google server racked inside an Airtel datacentre. Nothing you can buy improves the red one; the only fix is not making the journey.');
})();

SC.ixp = (function(){
  var s = tag(84, 16, 'without an exchange', 'hot') + tag(272, 16, 'with one', 'ok');
  s += box(8, 44, 50, 38, 'Airtel', 'core') + box(112, 44, 50, 38, 'Jio', 'access');
  var far = path([[33,44],[50,26],[85,120],[120,26],[137,44]]);
  s += wire(far, 'var(--c-red)', 'alt') + mv(far, 'var(--c-red)', 4.6, 0, 4.5);
  s += tag(85, 140, 'via a paid carrier abroad', 'hot');
  s += '<line x1="186" y1="10" x2="186" y2="158" stroke="var(--ink-3)" stroke-width="1.4" stroke-dasharray="4 5" opacity=".6"/>';
  s += box(204, 44, 50, 38, 'Airtel', 'core') + box(300, 44, 50, 38, 'Jio', 'access');
  s += box(240, 104, 74, 40, 'NIXI', 'net', 'Mumbai');
  var l = path([[229,82],[258,104]]), r = path([[296,104],[325,82]]);
  s += wire(l, 'var(--c-green)') + wire(r, 'var(--c-green)');
  var full = path([[229,82],[258,104],[296,104],[325,82]]);
  s += mv(full, 'var(--c-green)', 2.2, 0, 4.5);
  s += tag(277, 160, 'across the room, free', 'ok');
  return stage(s, 'Without a local exchange two Indian networks meet abroad; with one they hand traffic straight across a room in Mumbai.',
    '<b>Why NIXI was built.</b> An email between two Delhi users could genuinely travel to America and back, because that was where the networks met. Peering at an exchange made it faster <i>and</i> cheaper at the same time.');
})();

SC.subsea = (function(){
  var s = box(8, 60, 58, 48, 'Mumbai', 'core') + box(294, 60, 58, 48, 'Oregon', 'net');
  var d = path([[66,84],[120,110],[180,66],[240,110],[294,84]]);
  s += wire(d, 'var(--net)');
  s += mv(d, 'var(--c-orange)', 5.4, 0, 6);
  s += mv(d, 'var(--c-orange)', 5.4, 2.7, 6);
  s += tag(180, 38, '~20,000 km of glass', '');
  s += tag(180, 142, 'light manages 200 km per millisecond', '');
  s += tag(180, 158, 'so the round trip cannot go below ~200 ms', 'hot');
  return stage(s, 'A packet crawls the length of a submarine cable from Mumbai to Oregon, bounded by the speed of light in glass.',
    '<b>The one delay money cannot fix.</b> Watch how long the dot takes. Upgrading your plan widens the pipe; this is about how <i>long</i> the pipe is, and no plan shortens the Pacific.');
})();

SC.gdc = (function(){
  var s = box(8, 60, 58, 48, 'You', 'home');
  s += box(112, 52, 76, 64, 'Balancer', 'net', 'one IP');
  var inn = path([[66,84],[112,84]], false);
  s += wire(inn, 'var(--net)') + mv(inn, 'var(--c-red)', 3, 0, 5);
  [30, 84, 138].forEach(function(y, i){
    s += box(268, y-18, 80, 36, 'server ' + (i+1), 'core');
    var d = path([[188,84],[228,y],[268,y]]);
    s += wire(d, 'var(--core)', 'thin');
    s += '<g class="fadecyc" style="--dly:'+(i*1.07)+'s">'+wire(d, 'var(--c-green)')+'</g>';
    s += mv(path([[66,84],[112,84],[188,84],[228,y],[268,y]]), 'var(--c-red)', 3.21, i*1.07, 4.5);
  });
  s += tag(150, 134, 'you never learn which', '');
  return stage(s, 'One public address fronts many machines; the load balancer picks a healthy one for each request.',
    '<b>"The cloud" is a room full of ordinary machines.</b> The IP that DNS gave you belongs to a load balancer, not a server. If the machine answering you dies mid-video, another takes over and you see nothing.');
})();

SC.origin = (function(){
  var rows = [['Cached in Airtel', 8, 'var(--c-green)', 1.2], ['Google Mumbai', 30, 'var(--c-yellow)', 2.2],
              ['Oregon', 220, 'var(--c-red)', 6.0]];
  var s = '';
  rows.forEach(function(r, i){
    var y = 40 + i*44;
    s += tag(10, y - 12, r[0], '', 'start');
    s += tag(350, y - 12, r[1] + ' ms', i === 2 ? 'hot' : 'ok', 'end');
    var d = path([[12,y],[348,y]], false);
    s += wire(d, 'var(--ink-3)', 'thin');
    s += mv(d, r[2], r[3], 0, 6);
  });
  s += tag(180, 162, 'three dots, one starting line — distance is the whole difference', '');
  return stage(s, 'Three packets race the same distance on screen but take wildly different real times, set only by distance.',
    '<b>Bandwidth is width; latency is length.</b> All three journeys are the same picture and utterly different experiences. Upgrading from 100 to 300 Mbps moves none of these numbers.');
})();
})();
