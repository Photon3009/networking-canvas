(function(){
'use strict';
var $ = function(s){ return document.querySelector(s); };
var nc = window.__nc, LAYERS = window.LAYERS, TOPICS = window.TOPICS, NODES = window.NODES;

/* ── hand-drawn figures ─────────────────────────────────── */
function encap(){
  var rows = [
    { y:34,  label:'5 · Application', z:'net',    unit:'message' },
    { y:92,  label:'4 · Transport',   z:'core',   unit:'segment' },
    { y:150, label:'3 · Network',     z:'access', unit:'packet'  },
    { y:208, label:'2 · Link',        z:'home',   unit:'frame'   },
    { y:266, label:'1 · Physical',    z:'core',   unit:'bits'    }
  ];
  function box(x, w, y, z, text, sub){
    var t = '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="44" rx="5" fill="var(--'+z+'-bg)" stroke="var(--'+z+')" stroke-width="1.2"/>'+
      '<text x="'+(x+w/2)+'" y="'+(y+(sub?20:27))+'" text-anchor="middle" font-size="11" font-weight="600" fill="var(--'+z+')">'+text+'</text>';
    if(sub) t += '<text x="'+(x+w/2)+'" y="'+(y+34)+'" text-anchor="middle" font-size="9.5" fill="var(--'+z+')" opacity=".75">'+sub+'</text>';
    return t;
  }
  var s = '';
  rows.forEach(function(r){
    s += '<text x="104" y="'+(r.y+21)+'" text-anchor="end" font-size="11" font-weight="600" fill="currentColor">'+r.label+'</text>'+
         '<text x="104" y="'+(r.y+34)+'" text-anchor="end" font-size="9.5" fill="currentColor" opacity=".55">'+r.unit+'</text>';
  });
  s += box(118, 744, 34, 'net', 'GET /watch?v=abc HTTP/1.1', 'what you actually wanted to say');
  s += box(118, 88, 92, 'core', 'TCP', '20 B') + box(206, 656, 92, 'net', 'the message above, untouched');
  s += box(118, 88, 150, 'access', 'IP', '20 B') + box(206, 88, 150, 'core', 'TCP', '20 B') + box(294, 568, 150, 'net', 'still untouched');
  s += box(118, 88, 208, 'home', 'Wi-Fi', 'hdr') + box(206, 88, 208, 'access', 'IP', '') + box(294, 88, 208, 'core', 'TCP', '') +
       box(382, 418, 208, 'net', 'payload — up to 1500 bytes in all', '') + box(800, 62, 208, 'home', 'CRC', '4 B');
  s += '<path d="M118 288 h10 v-18 h12 v18 h14 v-18 h10 v18 h18 v-18 h12 v18 h16 v-18 h10 v18 h20 v-18 h12 v18 h14 v-18 h12 v18 h18 v-18 h10 v18 h16 v-18 h12 v18 h20 v-18 h10 v18 h14 v-18 h12 v18 h18 v-18 h12 v18 h16 v-18 h10 v18 h20 v-18 h12 v18 h14 v-18 h10 v18 h18 v-18 h12 v18 h16 v-18 h12 v18 h18 v-18 h10 v18 h20 v-18 h12 v18 h14 v-18 h12 v18 h20 v-18 h10 v18 h16 v-18 h12 v18 h18 v-18 h10 v18 h24" fill="none" stroke="var(--core)" stroke-width="1.6" stroke-linejoin="round"/>';
  s += '<text x="490" y="312" text-anchor="middle" font-size="9.5" fill="currentColor" opacity=".6">light, voltage or radio — the only part you could photograph</text>';

  return '<figure><div class="figscroll"><svg viewBox="0 0 880 326" role="img" style="min-width:620px" '+
    'aria-label="Encapsulation: each layer wraps the one above it in its own header, so one HTTP request leaves your phone inside four nested envelopes.">'+s+'</svg></div>'+
    '<figcaption><b>Encapsulation.</b> Going down the stack, every layer bolts its own header onto the front of whatever it was handed and never looks inside. Going back up at the other end, each header is read and stripped in reverse. The 40-odd bytes of TCP and IP header ride with <i>every</i> packet — which is why a network of tiny packets wastes a surprising amount of a link.</figcaption></figure>';
}

function sawtooth(){
  var s = '<line x1="58" y1="24" x2="58" y2="196" stroke="currentColor" stroke-width="1.2" opacity=".5"/>'+
          '<line x1="58" y1="196" x2="688" y2="196" stroke="currentColor" stroke-width="1.2" opacity=".5"/>'+
          '<text x="58" y="16" font-size="10.5" fill="currentColor" opacity=".7">how much the sender dares send (cwnd)</text>'+
          '<text x="688" y="216" text-anchor="end" font-size="10.5" fill="currentColor" opacity=".7">time, in round trips →</text>';
  s += '<path d="M58 194 C 96 190, 120 160, 140 96 S 158 56, 168 44" fill="none" stroke="var(--core)" stroke-width="2.4"/>';
  s += '<path d="M168 44 L168 120 L300 66 L300 132 L432 76 L432 140 L564 84 L564 146 L672 96" fill="none" stroke="var(--core)" stroke-width="2.4" stroke-linejoin="round"/>';
  [[168,44],[300,66],[432,76],[564,84]].forEach(function(p){
    s += '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="3.6" fill="var(--net)"/>';
  });
  s += '<line x1="168" y1="24" x2="168" y2="196" stroke="currentColor" stroke-width="1" stroke-dasharray="4 4" opacity=".3"/>';
  s += '<text x="64" y="40" font-size="10.5" font-weight="600" fill="var(--core)">slow start</text>'+
       '<text x="64" y="54" font-size="9.5" fill="currentColor" opacity=".65">doubles every RTT</text>';
  s += '<text x="180" y="36" font-size="10.5" font-weight="600" fill="var(--core)">congestion avoidance</text>'+
       '<text x="180" y="50" font-size="9.5" fill="currentColor" opacity=".65">+1 packet per RTT</text>';
  s += '<text x="312" y="62" font-size="10" font-weight="600" fill="var(--net)">packet lost → halve</text>';
  s += '<text x="58" y="234" font-size="10" fill="currentColor" opacity=".6">Every sender on the internet is doing this, right now, with no idea what the others are doing.</text>';
  return '<figure><div class="figscroll"><svg viewBox="0 0 700 246" role="img" style="min-width:480px" '+
    'aria-label="TCP congestion window over time: an exponential slow start, then a sawtooth of slow additive growth and sharp halving at every packet loss.">'+s+'</svg></div>'+
    '<figcaption><b>The sawtooth.</b> The sender has no way to ask how much capacity exists, so it finds out by overshooting. Each dot is a lost packet — the only message the network ever sends back. This is why a video starts at 360p: the climb has not finished yet.</figcaption></figure>';
}

function doublenat(){
  function b(x, w, label, sub, z){
    return '<rect x="'+x+'" y="74" width="'+w+'" height="56" rx="7" fill="var(--'+z+'-bg)" stroke="var(--'+z+')" stroke-width="1.3"/>'+
      '<text x="'+(x+w/2)+'" y="'+97+'" text-anchor="middle" font-size="11.5" font-weight="600" fill="var(--'+z+')">'+label+'</text>'+
      '<text x="'+(x+w/2)+'" y="'+113+'" text-anchor="middle" font-size="9.5" fill="var(--'+z+')" opacity=".8">'+sub+'</text>';
  }
  var s = '<defs><marker id="ar" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">'+
          '<path d="M0 0 L10 5 L0 10 z" fill="currentColor"/></marker>'+
          '<marker id="arn" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">'+
          '<path d="M0 0 L10 5 L0 10 z" fill="var(--net)"/></marker></defs>';
  s += b(20, 120, 'Your phone', '192.168.1.7', 'home');
  s += b(196, 150, 'Router NAT', 'translation #1', 'home');
  s += b(402, 150, 'Airtel CGNAT', 'translation #2', 'access');
  s += b(608, 132, 'The internet', 'one shared IP', 'net');
  s += '<line x1="140" y1="60" x2="196" y2="60" stroke="var(--home)" stroke-width="2" marker-end="url(#ar)" color="var(--home)"/>'+
       '<line x1="346" y1="60" x2="402" y2="60" stroke="var(--home)" stroke-width="2" marker-end="url(#ar)" color="var(--home)"/>'+
       '<line x1="552" y1="60" x2="608" y2="60" stroke="var(--home)" stroke-width="2" marker-end="url(#ar)" color="var(--home)"/>'+
       '<text x="374" y="42" text-anchor="middle" font-size="10.5" font-weight="600" fill="var(--home)">outbound: fine, a table entry is created at each step</text>';
  s += '<line x1="608" y1="160" x2="560" y2="160" stroke="var(--net)" stroke-width="2" marker-end="url(#arn)"/>'+
       '<line x1="555" y1="150" x2="537" y2="170" stroke="var(--net)" stroke-width="2.6"/>'+
       '<line x1="537" y1="150" x2="555" y2="170" stroke="var(--net)" stroke-width="2.6"/>'+
       '<text x="530" y="186" text-anchor="end" font-size="10.5" font-weight="600" fill="var(--net)">inbound: dropped here — no entry, no flat number to deliver to</text>';
  return '<figure><div class="figscroll"><svg viewBox="0 0 760 200" role="img" style="min-width:520px" '+
    'aria-label="Traffic leaving your home is translated twice and succeeds; traffic arriving unrequested is dropped at the carrier NAT because no translation entry exists for it.">'+s+'</svg></div>'+
    '<figcaption><b>Why port forwarding does nothing on Airtel broadband.</b> A translation entry only exists because <i>you</i> started a connection. Nobody outside can create one, so an unrequested inbound packet reaches the carrier NAT and stops. Forwarding a port on your own router fixes the second-to-last hop of a journey that already ended.</figcaption></figure>';
}
window.FIGURES = { sawtooth: sawtooth(), doublenat: doublenat(),
  cells: window.HEXFIELD || '', handover: window.HANDOVER || '' };

/* ── protocol layers view ───────────────────────────────── */
(function renderLayers(){
  var h = '<div class="pagehead"><p class="eyebrow-s">Chapter 1 · Protocol layers and service models</p>'+
    '<h1>Five envelopes around <em>one sentence</em></h1>'+
    '<p>Nobody designed the internet as one enormous program. It was cut into five layers, each of which does one job and is forbidden from caring how the layer below does its own. That is why Wi-Fi could be invented without rewriting the web, and why your fibre upgrade did not break WhatsApp.</p></div>';
  h += encap();
  h += '<p class="eyebrow-s">Click any layer</p><div class="layerstack">';
  LAYERS.forEach(function(L){
    h += '<button class="layerrow" data-layer="'+L.id+'" style="--lc:var(--'+L.zone+');--lbg:var(--'+L.zone+'-bg)">'+
      '<span class="lnum">'+L.n+'</span><span>'+
      '<h3>'+L.name+' <em>'+L.unit+'</em></h3>'+
      '<p>'+L.blurb+'</p>'+
      '<div class="lproto">'+L.protos+'</div>'+
      '</span></button>';
  });
  h += '</div>';
  h += '<div class="sect-h" style="margin-top:clamp(44px,6vw,72px)"><p class="klabel">The point of layering</p>'+
    '<h2>Why bother <em>splitting it up</em>?</h2>'+
    '<p>Because every layer can then be replaced without touching the others. Copper became fibre and layer 3 never noticed. TCP became QUIC and your browser kept working. The cost is real \u2014 headers repeated on every packet, and information that one layer knows being hidden from another that could have used it \u2014 and it has been worth paying for fifty years.</p></div>';
    '<p>Because every layer can then be replaced without touching the others. Copper became fibre and layer 3 never noticed. TCP became QUIC and your browser kept working. The cost is real — headers repeated on every packet, and information that one layer knows being hidden from another that could have used it — and it has been worth paying for fifty years.</p></div>';
  $('#layerswrap').innerHTML = h;
  Array.prototype.forEach.call(document.querySelectorAll('.layerrow'), function(b){
    b.onclick = function(){
      var L = LAYERS.filter(function(x){ return x.id === b.dataset.layer; })[0];
      if(L) nc.openDetail(L, 'layer');
    };
  });
})();

/* ── concepts view ──────────────────────────────────────── */
var allTopics = [];
TOPICS.forEach(function(g){ g.items.forEach(function(t){ allTopics.push(t); }); });

function cardHTML(t, kindLabel){
  return '<button class="card" data-topic="'+t.id+'">'+
    '<h3>'+t.title+'</h3><p>'+(t.one||t.sub||'')+'</p>'+
    '<span class="chip z-'+(t.zone||'core')+'">'+(kindLabel || t.chapter)+'</span></button>';
}
function wireCards(root){
  Array.prototype.forEach.call(root.querySelectorAll('.card'), function(b){
    b.onclick = function(){
      var id = b.dataset.topic;
      if(b.dataset.kind === 'node'){
        nc.show('map');
        var n = nc.byId[id];
        setTimeout(function(){ nc.openDetail(n, 'node'); nc.focusNode(id); }, 60);
        return;
      }
      if(b.dataset.kind === 'layer'){
        var L = LAYERS.filter(function(x){ return x.id === id; })[0];
        if(L) nc.openDetail(L, 'layer');
        return;
      }
      var t = allTopics.filter(function(x){ return x.id === id; })[0];
      if(t) nc.openDetail(t, 'topic');
    };
  });
}
function renderTopics(){
  var h = '<div class="pagehead"><p class="eyebrow-s">The whole curriculum, in plain language</p>'+
    '<h1>Everything the map <em>does not</em> have room for</h1>'+
    '<p>Twenty-four ideas that make up a networking course, each written the way you would explain it to a friend — with the analogy first, the theory second, and what it means for your own connection at the end.</p></div><div class="groups">';
  TOPICS.forEach(function(g){
    h += '<section class="group"><h2>'+g.group+'<span class="gline"></span></h2><p class="gsub">'+g.sub+'</p><div class="cards">';
    g.items.forEach(function(t){ h += cardHTML(t); });
    h += '</div></section>';
  });
  h += '</div>';
  var w = $('#topicswrap');
  w.innerHTML = h;
  wireCards(w);
}
renderTopics();

/* ── search across everything ───────────────────────────── */
var q = $('#q');
function text(o){
  return [o.title, o.name, o.one, o.sub, o.blurb, o.protos, o.chapter, o.lead,
    (o.sections||[]).map(function(s){ return s.h; }).join(' ')].join(' ').toLowerCase();
}
q.addEventListener('input', function(){
  var v = q.value.trim().toLowerCase();
  var w = $('#topicswrap');
  if(!v){ renderTopics(); return; }
  nc.show('topics');
  var mn = NODES.filter(function(n){ return text(n).indexOf(v) > -1; });
  var ml = LAYERS.filter(function(l){ return text(l).indexOf(v) > -1; });
  var mt = allTopics.filter(function(t){ return text(t).indexOf(v) > -1; });
  var total = mn.length + ml.length + mt.length;
  var h = '<div class="pagehead"><p class="eyebrow-s">Search</p><h1>'+total+' result'+(total === 1 ? '' : 's')+' for “'+
    q.value.replace(/</g,'&lt;')+'”</h1></div><div class="groups">';
  if(!total) h += '<p class="empty">Nothing matched. Try <b>NAT</b>, <b>DNS</b>, <b>fibre</b>, <b>congestion</b>, <b>5G</b> or <b>TLS</b>.</p>';
  if(mn.length){
    h += '<section class="group"><h2>On the map<span class="gline"></span></h2><div class="cards">';
    mn.forEach(function(n){
      h += '<button class="card" data-topic="'+n.id+'" data-kind="node"><h3>'+n.title+'</h3><p>'+n.sub+'</p>'+
        '<span class="chip z-'+n.zone+'">'+n.chapter+'</span></button>';
    });
    h += '</div></section>';
  }
  if(ml.length){
    h += '<section class="group"><h2>Protocol layers<span class="gline"></span></h2><div class="cards">';
    ml.forEach(function(l){
      h += '<button class="card" data-topic="'+l.id+'" data-kind="layer"><h3>'+l.n+' · '+l.name+'</h3><p>'+l.blurb+'</p>'+
        '<span class="chip z-'+l.zone+'">'+l.chapter+'</span></button>';
    });
    h += '</div></section>';
  }
  if(mt.length){
    h += '<section class="group"><h2>Concepts<span class="gline"></span></h2><div class="cards">';
    mt.forEach(function(t){ h += cardHTML(t); });
    h += '</div></section>';
  }
  h += '</div>';
  w.innerHTML = h;
  wireCards(w);
});

/* ── cross-links in the drawer ──────────────────────────── */
var LINKS = {
  phone:['sockets','ip-addr'], wifi:['wifi-deep','mac-arp'], router:['nat','dhcp','switching-lan'],
  tv:['mac-arp','switching-lan'], laptop:['switching-lan','delay'], tower:['cellular-deep'],
  mcore:['cellular-deep','nat'], splitter:['edge-core','delay'], olt:['edge-core','switching'],
  bng:['nat','ip-addr'], backbone:['routing','bgp','switching'], resolver:['dns-deep','tls'],
  dnstree:['dns-deep','cdn'], ggc:['cdn','http'], ixp:['bgp','routing'], subsea:['delay','what-is'],
  gdc:['http','sockets','tls'], origin:['delay','congestion','cdn']
};
window.__ncAfterOpen = function(d, kind){
  route.mark(d, kind);
  var ids = (kind === 'node') ? LINKS[d.id] : null;
  if(!ids) return;
  var picks = ids.map(function(id){ return allTopics.filter(function(t){ return t.id === id; })[0]; }).filter(Boolean);
  if(!picks.length) return;
  var wrap = document.createElement('div');
  wrap.className = 'dlinks';
  wrap.innerHTML = '<span class="chip" style="border:0;background:transparent;padding-left:0">Go deeper</span>' +
    picks.map(function(t){ return '<button data-go="'+t.id+'">'+t.title+'</button>'; }).join('');
  $('#dbody').appendChild(wrap);
  Array.prototype.forEach.call(wrap.querySelectorAll('button[data-go]'), function(b){
    b.onclick = function(){
      var t = allTopics.filter(function(x){ return x.id === b.dataset.go; })[0];
      if(t) nc.openDetail(t, 'topic');
    };
  });
};

/* ── enlarge a figure to the whole screen ──────────────── */
(function(){
  var lb = document.getElementById('lightbox'), stage = document.getElementById('lbstage');
  function open(fig){
    stage.innerHTML = fig.outerHTML.replace('sc zoom', 'sc');
    document.getElementById('lbtitle').textContent = fig.dataset.title || 'Diagram';
    lb.hidden = false;
  }
  function close(){ lb.hidden = true; stage.innerHTML = ''; }
  document.addEventListener('click', function(e){
    if(!e.target.closest) return;
    if(e.target.closest('#lightbox')) return;
    var fig = e.target.closest('figure.zoom');
    if(fig) open(fig);
  });
  document.getElementById('lbclose').onclick = close;
  lb.addEventListener('click', function(e){ if(e.target === lb || e.target === stage) close(); });
  document.addEventListener('keydown', function(e){ if(e.key === 'Escape' && !lb.hidden){ e.stopPropagation(); close(); } }, true);
})();

/* ── addressable URLs: every box and concept has its own link ── */
var route = (function(){
  var VIEW = { home:'#/', map:'#/map', layers:'#/layers', topics:'#/concepts' };
  var last = null, applying = false;
  function currentView(){
    var b = document.querySelector('.nav button[aria-selected="true"]');
    return b ? b.dataset.view : 'home';
  }
  function set(h){
    if(applying || !h) return;
    last = h;
    if(location.hash !== h) location.hash = h;
  }
  function mark(d, kind){
    if(kind === 'node')  set('#/device/'+d.id);
    else if(kind === 'layer') set('#/layer/'+d.id);
    else if(kind === 'topic') set('#/topic/'+d.id);
  }
  function apply(){
    var h = location.hash || '#/';
    if(h === last) return;
    last = h;
    applying = true;
    try {
      var parts = h.replace(/^#\/?/, '').split('/');
      var head = parts[0] || 'home', id = decodeURIComponent(parts[1] || '');
      if(head === 'device' && nc.byId[id]){
        nc.show('map'); nc.openDetail(nc.byId[id], 'node'); nc.focusNode(id); return;
      }
      if(head === 'layer'){
        var L = LAYERS.filter(function(x){ return x.id === id; })[0];
        if(L){ nc.show('layers'); nc.openDetail(L, 'layer'); return; }
      }
      if(head === 'topic'){
        var T = allTopics.filter(function(x){ return x.id === id; })[0];
        if(T){ nc.show('topics'); nc.openDetail(T, 'topic'); return; }
      }
      nc.closeDetail();
      nc.show(head === 'layers' ? 'layers' : head === 'concepts' ? 'topics'
            : head === 'map' ? 'map' : 'home');
    } finally { applying = false; }
  }
  return { set:set, mark:mark, apply:apply, view:VIEW, currentView:currentView };
})();
function drawerClosed(){ var d = document.getElementById('drawer'); return !d || d.hidden; }
window.__ncAfterClose = function(){ route.set(route.view[route.currentView()]); };
var baseShow = nc.show;
nc.show = function(name){ baseShow(name); if(drawerClosed()) route.set(route.view[name] || '#/'); };
window.__nc.show = nc.show;
window.addEventListener('hashchange', route.apply);

/* ── open at rest, showing the whole shape ──────────────── */
(function heroArt(){
  var host = document.getElementById('heroart');
  if(!host || !window.HEXFIELD) return;
  var tmp = document.createElement('div');
  tmp.innerHTML = window.HEXFIELD;
  var svg = tmp.querySelector('svg');
  if(!svg) return;
  svg.style.minWidth = '560px';
  host.className = 'sc';
  host.appendChild(svg);
})();
requestAnimationFrame(function(){
  if((location.hash || '').length > 2) route.apply();
});
})();
