/* sketch.js — hand-drawn SVG primitives: wobbly ink, hatching, stipple, grain.
   Everything is deterministic (seeded) so the art never re-rolls between renders. */
window.SK = (function(){
'use strict';
function f(n){ return Math.round(n*10)/10; }
function prng(seed){
  var s = (seed>>>0) || 2463534242;
  return function(){ s ^= s<<13; s>>>=0; s ^= s>>17; s ^= s<<5; s>>>=0; return s/4294967296; };
}

/* ── shape builders (return point arrays) ───────────────── */
function rrect(x, y, w, h, r, steps){
  r = Math.min(r, w/2, h/2); steps = steps || 4;
  var p = [], i, a;
  function arc(cx, cy, a0, a1){
    for(i = 0; i <= steps; i++){ a = a0 + (a1-a0)*i/steps; p.push([cx+Math.cos(a)*r, cy+Math.sin(a)*r]); }
  }
  arc(x+w-r, y+r,   -Math.PI/2, 0);
  arc(x+w-r, y+h-r,  0, Math.PI/2);
  arc(x+r,   y+h-r,  Math.PI/2, Math.PI);
  arc(x+r,   y+r,    Math.PI, Math.PI*1.5);
  return p;
}
function ell(cx, cy, rx, ry, n){
  n = n || 28; var p = [], i, a;
  for(i = 0; i < n; i++){ a = i/n*Math.PI*2; p.push([cx+Math.cos(a)*rx, cy+Math.sin(a)*ry]); }
  return p;
}
function blob(cx, cy, rx, ry, n, amp, seed){
  var R = prng(seed), p = [], i, a, k;
  n = n || 18;
  for(i = 0; i < n; i++){
    a = i/n*Math.PI*2; k = 1 + (R()-0.5)*(amp||0.14);
    p.push([cx+Math.cos(a)*rx*k, cy+Math.sin(a)*ry*k]);
  }
  return p;
}

/* ── wobbly path from points ────────────────────────────── */
function d(pts, close, amp, seed){
  var R = prng(seed||7), s = '', i, x, y;
  amp = amp === undefined ? 0.9 : amp;
  for(i = 0; i < pts.length; i++){
    x = pts[i][0] + (R()-0.5)*amp*2;
    y = pts[i][1] + (R()-0.5)*amp*2;
    s += (i ? 'L' : 'M') + f(x) + ' ' + f(y);
  }
  return s + (close === false ? '' : 'Z');
}
/* smooth wobbly path (quadratic through midpoints) — for organic outlines */
function ds(pts, close, amp, seed){
  var R = prng(seed||11), q = pts.map(function(p){
    return [p[0]+(R()-0.5)*amp*2, p[1]+(R()-0.5)*amp*2];
  });
  var i, m, s;
  if(close !== false){
    q.push(q[0], q[1]);
    s = 'M'+f((q[0][0]+q[1][0])/2)+' '+f((q[0][1]+q[1][1])/2);
    for(i = 1; i < q.length-1; i++){
      m = [(q[i][0]+q[i+1][0])/2, (q[i][1]+q[i+1][1])/2];
      s += 'Q'+f(q[i][0])+' '+f(q[i][1])+' '+f(m[0])+' '+f(m[1]);
    }
    return s + 'Z';
  }
  /* open: start at the real first point and finish at the real last one */
  s = 'M'+f(q[0][0])+' '+f(q[0][1]);
  for(i = 1; i < q.length-1; i++){
    m = [(q[i][0]+q[i+1][0])/2, (q[i][1]+q[i+1][1])/2];
    s += 'Q'+f(q[i][0])+' '+f(q[i][1])+' '+f(m[0])+' '+f(m[1]);
  }
  return s + 'L'+f(q[q.length-1][0])+' '+f(q[q.length-1][1]);
}

/* ── ink: two slightly-offset passes, like a pen gone over twice ── */
function ink(path, color, w, seed, op){
  var R = prng(seed||3);
  return '<path d="'+path+'" fill="none" stroke="'+(color||'var(--ink)')+'" stroke-width="'+(w||1.6)+
    '" stroke-linecap="round" stroke-linejoin="round" opacity="'+(op===undefined?1:op)+'"/>'+
    '<path d="'+path+'" fill="none" stroke="'+(color||'var(--ink)')+'" stroke-width="'+((w||1.6)*0.55)+
    '" stroke-linecap="round" stroke-linejoin="round" opacity="'+((op===undefined?1:op)*0.5)+
    '" transform="translate('+f((R()-0.5)*1.3)+' '+f((R()-0.5)*1.3)+')"/>';
}
function fill(path, color, op){
  return '<path d="'+path+'" fill="'+color+'" opacity="'+(op===undefined?1:op)+'" stroke="none"/>';
}

/* ── hatching, clipped to a shape ───────────────────────── */
var cid = 0;
function clip(path){
  var id = 'ck'+(++cid);
  return { id:id, def:'<clipPath id="'+id+'"><path d="'+path+'"/></clipPath>' };
}
function hatch(clipId, box, angle, gap, color, w, op, seed, dash){
  var cx = box.x+box.w/2, cy = box.y+box.h/2;
  var R0 = Math.hypot(box.w, box.h)/2 + 6;
  var R = prng(seed||5), s = '', y, y1, y2, x1, x2;
  for(y = cy-R0; y <= cy+R0; y += gap){
    y1 = y + (R()-0.5)*gap*0.4; y2 = y1 + (R()-0.5)*1.4;
    x1 = cx-R0 + R()*5; x2 = cx+R0 - R()*5;
    s += '<line x1="'+f(x1)+'" y1="'+f(y1)+'" x2="'+f(x2)+'" y2="'+f(y2)+'"/>';
  }
  return '<g clip-path="url(#'+clipId+')" transform="rotate('+angle+' '+f(cx)+' '+f(cy)+')" stroke="'+color+
    '" stroke-width="'+(w||0.7)+'" opacity="'+(op===undefined?0.3:op)+'" stroke-linecap="round"'+
    (dash ? ' stroke-dasharray="'+dash+'"' : '')+'>'+s+'</g>';
}
/* short broken strokes scattered inside a shape — the "pencil tooth" of the reference art */
function tooth(clipId, box, angle, n, color, w, op, seed, len){
  var R = prng(seed||9), s = '', i, x, y, L;
  for(i = 0; i < n; i++){
    x = box.x + R()*box.w; y = box.y + R()*box.h; L = (len||7)*(0.5+R());
    s += '<line x1="'+f(x)+'" y1="'+f(y)+'" x2="'+f(x+L)+'" y2="'+f(y+(R()-0.5)*1.5)+'"/>';
  }
  return '<g clip-path="url(#'+clipId+')" transform="rotate('+angle+' '+f(box.x+box.w/2)+' '+f(box.y+box.h/2)+
    ')" stroke="'+color+'" stroke-width="'+(w||0.8)+'" opacity="'+(op===undefined?0.35:op)+
    '" stroke-linecap="round">'+s+'</g>';
}
function stipple(clipId, box, n, color, r, seed, op){
  var R = prng(seed||13), s = '', i;
  for(i = 0; i < n; i++){
    s += '<circle cx="'+f(box.x+R()*box.w)+'" cy="'+f(box.y+R()*box.h)+'" r="'+f((r||1)*(0.5+R()))+'"/>';
  }
  return '<g clip-path="url(#'+clipId+')" fill="'+color+'" opacity="'+(op===undefined?0.55:op)+'">'+s+'</g>';
}

/* ── a fully-textured shape: fill + hatch + tooth + ink ─── */
function shape(path, box, opt){
  opt = opt || {};
  var c = clip(path), out = '<defs>'+c.def+'</defs>';
  if(opt.fill) out += fill(path, opt.fill, opt.fillOp);
  if(opt.shade) out += hatch(c.id, box, opt.shadeAngle===undefined?38:opt.shadeAngle,
    opt.gap||3.2, opt.shade, opt.hw||0.7, opt.shadeOp===undefined?0.3:opt.shadeOp, opt.seed||5, opt.dash);
  if(opt.shade2) out += hatch(c.id, box, opt.shade2Angle===undefined?-42:opt.shade2Angle,
    opt.gap2||4.6, opt.shade2, 0.6, opt.shade2Op===undefined?0.22:opt.shade2Op, (opt.seed||5)+31, opt.dash2);
  if(opt.tooth) out += tooth(c.id, box, opt.toothAngle||12, opt.toothN||40, opt.tooth,
    0.75, opt.toothOp===undefined?0.3:opt.toothOp, (opt.seed||5)+57, opt.toothLen);
  if(opt.dots) out += stipple(c.id, box, opt.dotsN||18, opt.dots, opt.dotR||1, (opt.seed||5)+83, opt.dotsOp);
  if(opt.ink !== false) out += ink(path, opt.inkColor, opt.w||1.7, (opt.seed||5)+101, opt.inkOp);
  return { svg: out, clip: c.id };
}

/* ── paper grain as a repeating data-URI tile ───────────── */
function grain(size, dark){
  size = size || 160;
  var cv = document.createElement('canvas');
  cv.width = cv.height = size;
  var g = cv.getContext('2d'), img = g.createImageData(size, size), px = img.data;
  var R = prng(4242), i, v;
  for(i = 0; i < px.length; i += 4){
    v = R();
    px[i] = px[i+1] = px[i+2] = dark ? 255 : 0;
    px[i+3] = v > 0.86 ? Math.floor((v-0.86)*(dark ? 90 : 150)) : 0;
  }
  g.putImageData(img, 0, 0);
  /* a few long paper fibres */
  g.strokeStyle = dark ? 'rgba(255,255,255,.05)' : 'rgba(60,40,20,.055)';
  g.lineWidth = 1;
  for(i = 0; i < 26; i++){
    var x = R()*size, y = R()*size, a = R()*Math.PI, L = 8+R()*26;
    g.beginPath(); g.moveTo(x, y); g.lineTo(x+Math.cos(a)*L, y+Math.sin(a)*L); g.stroke();
  }
  try { return cv.toDataURL('image/png'); } catch(e){ return ''; }
}

return { f:f, prng:prng, rrect:rrect, ell:ell, blob:blob, d:d, ds:ds, ink:ink, fill:fill,
         clip:clip, hatch:hatch, tooth:tooth, stipple:stipple, shape:shape, grain:grain };
})();
