/* landing.js — the landing page: the diorama, the route, the three endings, the index.
   Everything is composed from the map's isometric set in art.js. */
(function(){
'use strict';
var A = window.ART, I = window.ISO;
if(!A || !I) return;
function $(s){ return document.querySelector(s); }
function f(n){ return Math.round(n*10)/10; }

/* place one art.js illustration so its own ground origin lands on screen point p */
function place(id, p, arg){
  var svg = A[id](arg), o = I.origin();
  return '<svg x="'+f(p[0]-o[0])+'" y="'+f(p[1]-o[1])+'" width="160" height="112" viewBox="0 0 160 112" overflow="visible">'+svg+'</svg>';
}

/* ── the diorama: six territory plates in a row, one fibre through all of them ── */
(function(){
  var host = $('#diorama'); if(!host) return;
  var OX = 120, OY = 132, L = 110, G = 116, TH = 9;
  var plates = [
    { z:'home',   label:'your flat',        items:[['router',-28,-26],['phone',26,24]] },
    { z:'access', label:'your street',      items:[['splitter',-4,-4]] },
    { z:'access', label:'the exchange',     items:[['olt',-26,-22],['bng',18,22]] },
    { z:'core',   label:'Airtel’s core', items:[['backbone',0,0]] },
    { z:'net',    label:'Mumbai',           items:[['gdc',-22,-22],['ixp',24,22]] },
    { z:'sea',    label:'the seabed → Oregon', items:[['origin',14,14]] }
  ];
  function P(x, y, z){ I.at(OX, OY); return I.P(x, y, z); }
  function pts(arr){ return arr.map(function(p){ return f(p[0])+' '+f(p[1]); }).join(' L'); }

  var s = '', objs = [], route = [];
  I.at(OX, OY);
  s += I.begin();
  plates.forEach(function(pl, i){
    var cx = i*G, cy = -i*G, x0 = cx - L/2, y0 = cy - L/2;
    var top = pl.z === 'sea' ? 'color-mix(in srgb,var(--c-blue) 34%,var(--surface))' : 'var(--'+pl.z+'-bg)';
    var zc = pl.z === 'sea' ? 'var(--c-blue)' : 'var(--'+pl.z+')';
    I.at(OX, OY);
    s += I.shadow(x0, y0, L, L, 8);
    s += I.box(x0, y0, 0, L, L, TH, zc, { top:top,
      left:'color-mix(in srgb,'+zc+' 42%,var(--surface))', right:'color-mix(in srgb,'+zc+' 66%,var(--surface))' });
    if(pl.z === 'sea'){
      [-30, -10, 10, 30].forEach(function(k, j){
        var w = [], t;
        for(t = -48; t <= 48; t += 4) w.push([cx + t, cy + k + Math.sin(t/7 + j)*1.8, TH + .1]);
        s += I.line(w, '#fff', .9, { op:.55 });
      });
    } else {
      /* a faint survey grid on each plate */
      for(var g = -L/2 + 22; g < L/2; g += 22){
        s += I.line([[cx+g, y0, TH+.05],[cx+g, y0+L, TH+.05]], zc, .6, { op:.18 });
        s += I.line([[x0, cy+g, TH+.05],[x0+L, cy+g, TH+.05]], zc, .6, { op:.18 });
      }
    }
    route.push(P(cx, cy, TH + .4));
    var lp = P(cx + L/2, cy + L/2, 0);
    s += '<text class="dio-l" x="'+f(lp[0])+'" y="'+f(lp[1]+30)+'" text-anchor="middle"><tspan class="n">0'+(i+1)+'</tspan> '+pl.label+'</text>';
    pl.items.forEach(function(it){ objs.push({ id:it[0], x:cx+it[1], y:cy+it[2] }); });
  });

  /* the fibre, glowing, with the packet riding it */
  var d = 'M'+pts(route);
  s += '<path d="'+d+'" fill="none" stroke="var(--accent)" stroke-width="7" stroke-linecap="round" opacity=".16"/>';
  s += '<path d="'+d+'" fill="none" stroke="var(--iso-line)" stroke-width="3.6" stroke-linecap="round"/>';
  s += '<path d="'+d+'" fill="none" stroke="var(--c-orange)" stroke-width="2" stroke-linecap="round"/>';
  s += '<circle class="mv" r="5.5" fill="var(--accent)" stroke="var(--surface)" stroke-width="2" style="offset-path:path(\''+d+'\');--dur:9s"/>';
  s += '<circle class="mv" r="5.5" fill="var(--accent)" stroke="var(--surface)" stroke-width="2" style="offset-path:path(\''+d+'\');--dur:9s;--dly:-4.5s"/>';

  /* objects back to front, so nearer ones overlap farther ones */
  objs.sort(function(a, b){ return (a.x + a.y) - (b.x + b.y); });
  objs.forEach(function(o){ var p = P(o.x, o.y, TH); s += place(o.id, p); });

  host.innerHTML = '<svg viewBox="0 0 1240 300" role="img" aria-label="An isometric diorama of the journey: your flat, your street, the exchange, Airtel’s core, Mumbai and the seabed to Oregon, joined by one fibre with a packet travelling along it.">'+s+'</svg>';
})();

/* ── 01 the route: seven stops on a line ──────────────────── */
(function(){
  var host = $('#stops'); if(!host) return;
  var STOPS = [
    { id:'phone',    z:'home',   met:'192.168.1.7', k:'a private address', h:'Your phone',
      p:'An address your router invented. Thousands of other Airtel homes are using the very same one right now.' },
    { id:'wifi',     z:'home',   met:'10 m',   k:'of radio', h:'The air in your flat',
      p:'Wi-Fi is one crowded room. Everyone, the router included, waits for silence before speaking.' },
    { id:'router',   z:'home',   met:'NAT #1', k:'the first translation', h:'The white box on your wall',
      p:'Four machines in one case. It swaps your private address for its own and writes the swap in a table.' },
    { id:'splitter', z:'access', met:'1 : 32', k:'homes per fibre', h:'A sealed box on your street',
      p:'No power, no decisions. Your light and 31 neighbours’ share one strand of glass, each in its own time slot.' },
    { id:'olt',      z:'access', met:'4 km',   k:'of glass', h:'The exchange',
      p:'Light becomes packets again. The OLT schedules every home on the street to the nanosecond.' },
    { id:'bng',      z:'core',   met:'NAT #2', k:'carrier-grade', h:'Airtel’s gate',
      p:'Hundreds of homes squeezed behind one public address. This is why port forwarding silently does nothing.' },
    { id:'backbone', z:'core',   met:'AS9498', k:'one network', h:'Airtel’s backbone',
      p:'Routers that know only the next hop. Nobody holds the whole route, and nobody needs to.' }
  ];
  var h = '';
  STOPS.forEach(function(st, i){
    h += '<li class="lp-stop z-'+st.z+'">'+
      '<span class="dot">0'+(i+1)+'</span>'+
      '<div class="txt"><div class="met"><b>'+st.met+'</b><em>'+st.k+'</em></div>'+
      '<h3>'+st.h+'</h3><p>'+st.p+'</p>'+
      '<a class="open" href="#/device/'+st.id+'">Open the drawing <span aria-hidden="true">→</span></a></div>'+
      '<a class="well" href="#/device/'+st.id+'" aria-label="Open '+st.h+'"><svg viewBox="0 0 160 112" aria-hidden="true">'+A[st.id]()+'</svg></a>'+
      '</li>';
  });
  host.innerHTML = h + '<span class="lp-rail" aria-hidden="true"></span><span class="lp-rail-pk" aria-hidden="true"></span>';

  /* the packet on the rail follows your scroll */
  var sc = $('#homeview .scroller'), pk = host.querySelector('.lp-rail-pk'), rail = host.querySelector('.lp-rail');
  var dots = host.querySelectorAll('.dot');
  function centre(el, r){ var b = el.getBoundingClientRect(); return b.top - r.top + b.height/2; }
  function track(){
    var r = host.getBoundingClientRect(), v = sc.getBoundingClientRect();
    var top = centre(dots[0], r), bot = centre(dots[dots.length-1], r);
    rail.style.top = top + 'px'; rail.style.height = (bot - top) + 'px';
    var y = Math.max(top, Math.min(bot, v.top + v.height*0.5 - r.top));
    pk.style.top = y + 'px';
  }
  sc.addEventListener('scroll', track, { passive:true });
  window.addEventListener('resize', track);
  track();
})();

/* ── 02 three endings, to scale ───────────────────────────── */
(function(){
  var host = $('#race'); if(!host) return;
  var LANES = [
    { id:'ggc',    c:'var(--home)', n:'A cache inside Airtel',        w:'Mumbai · already holds the video', lo:5,   hi:15  },
    { id:'gdc',    c:'var(--net)',  n:'Google’s datacentre in India', w:'over the Mumbai exchange',      lo:20,  hi:40  },
    { id:'origin', c:'var(--core)', n:'The origin, overseas',         w:'Oregon · ~20,000 km of cable', lo:200, hi:250 }
  ];
  var W = 1240, X0 = 400, X1 = 1200, MAX = 250, LH = 128, TOP = 40;
  function X(ms){ return X0 + (X1 - X0)*ms/MAX; }
  var s = '', t;
  for(t = 0; t <= MAX; t += 50){
    s += '<line x1="'+f(X(t))+'" y1="'+(TOP-8)+'" x2="'+f(X(t))+'" y2="'+(TOP + LH*3 - 18)+'" stroke="var(--border)" stroke-width="1"'+(t ? ' stroke-dasharray="2 5"' : '')+'/>';
    s += '<text class="rc-t" x="'+f(X(t))+'" y="'+(TOP-16)+'" text-anchor="middle">'+t+(t === MAX ? ' ms' : '')+'</text>';
  }
  LANES.forEach(function(l, i){
    var y = TOP + i*LH + LH/2 - 10, mid = (l.lo + l.hi)/2;
    I.at(0, 0);
    s += '<g transform="translate(0 '+(y-62)+')"><svg x="0" y="0" width="150" height="105" viewBox="0 0 160 112" overflow="visible">'+A[l.id]()+'</svg></g>';
    s += '<text class="rc-n" x="168" y="'+(y-6)+'">'+l.n+'</text><text class="rc-w" x="168" y="'+(y+15)+'">'+l.w+'</text>';
    s += '<line x1="'+X0+'" y1="'+y+'" x2="'+X1+'" y2="'+y+'" stroke="var(--surface-3)" stroke-width="6" stroke-linecap="round"/>';
    s += '<rect x="'+f(X(l.lo))+'" y="'+(y-9)+'" width="'+f(Math.max(10, X(l.hi)-X(l.lo)))+'" height="18" rx="9" fill="'+l.c+'" opacity=".22"/>';
    s += '<path d="M'+X0+' '+y+'H'+f(X(mid))+'" stroke="'+l.c+'" stroke-width="2.4" stroke-linecap="round" opacity=".55"/>';
    s += '<text class="rc-v" x="'+f(Math.min(X(l.hi) + 16, X1 - 4))+'" y="'+(y+8)+'" text-anchor="'+(X(l.hi) + 140 > W ? 'end' : 'start')+'" fill="'+l.c+'"'+
      (X(l.hi) + 140 > W ? ' dy="-22"' : '')+'>'+l.lo+'–'+l.hi+' ms</text>';
    s += '<circle class="mv" r="7" fill="'+l.c+'" stroke="var(--bg)" stroke-width="2.5" style="offset-path:path(\'M'+X0+' '+y+'H'+f(X(mid))+'\');--dur:'+f(mid*0.04)+'s"/>';
  });
  host.innerHTML = '<svg viewBox="0 0 '+W+' '+(TOP + LH*3)+'" role="img" aria-label="Round trips drawn to scale: a cache inside Airtel in Mumbai, 5 to 15 milliseconds; Google’s datacentre in India, 20 to 40; the origin in Oregon, 200 to 250.">'+s+'</svg>';
})();

/* ── index rows: an illustration that slides in on hover ───── */
document.querySelectorAll('[data-art]').forEach(function(el){
  var id = el.getAttribute('data-art'); if(!A[id]) return;
  el.innerHTML = '<svg viewBox="0 0 160 112" aria-hidden="true">'+A[id]()+'</svg>';
});
})();
