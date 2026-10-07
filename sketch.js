/* sketch.js — SVG drawing primitives: clean ink, halftone shading, stipple, grain.
   The API still speaks in "wobble" and "hatch" terms from the hand-drawn era, but the
   output is now crisp: WOBBLE scales every jitter, and hatching renders as halftone dots.
   Everything is deterministic (seeded) so the art never re-rolls between renders. */
window.SK = (function(){
'use strict';
function f(n){ return Math.round(n*10)/10; }
var WOBBLE = 0;   /* 0 = ruler-straight; 1 = the old hand-drawn jitter */
function prng(seed){
  var s = (seed>>>0) || 2463534242;
  return function(){ s ^= s<<13; s>>>=0; s ^= s>>17; s ^= s<<5; s>>>=0; return s/4294967296; };
}

/* ── shape builders (return point arrays) ───────────────── */
function rrect(x, y, w, h, r, steps){
  r = Math.min(r, w/2, h/2); steps = Math.max(steps || 0, 8);
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
  amp = (amp === undefined ? 0.9 : amp) * WOBBLE;
  for(i = 0; i < pts.length; i++){
    x = pts[i][0] + (R()-0.5)*amp*2;
    y = pts[i][1] + (R()-0.5)*amp*2;
    s += (i ? 'L' : 'M') + f(x) + ' ' + f(y);
  }
  return s + (close === false ? '' : 'Z');
}
/* smooth wobbly path (quadratic through midpoints) — for organic outlines */
function ds(pts, close, amp, seed){
  amp = (amp || 0) * WOBBLE;
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

/* ── ink: one clean stroke ─────────────────────────────── */
function ink(path, color, w, seed, op){
  return '<path d="'+path+'" fill="none" stroke="'+(color||'var(--ink)')+'" stroke-width="'+f((w||1.6)*0.82)+
    '" stroke-linecap="round" stroke-linejoin="round" opacity="'+(op===undefined?1:op)+'"/>';
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
  /* halftone: a rotated grid of dots instead of ruled lines */
  var id = 'ht'+(++cid), g = Math.max(gap*0.9, 2.2), r = f(Math.min(g*0.3, 0.55 + (w||0.7)*0.55));
  var cx = box.x+box.w/2, cy = box.y+box.h/2, R0 = Math.hypot(box.w, box.h)/2 + 4;
  return '<defs><pattern id="'+id+'" width="'+f(g)+'" height="'+f(g)+'" patternUnits="userSpaceOnUse"'+
    ' patternTransform="rotate('+angle+' '+f(cx)+' '+f(cy)+')"><circle cx="'+f(g/2)+'" cy="'+f(g/2)+'" r="'+r+
    '" fill="'+color+'"/></pattern></defs><rect clip-path="url(#'+clipId+')" x="'+f(cx-R0)+'" y="'+f(cy-R0)+
    '" width="'+f(R0*2)+'" height="'+f(R0*2)+'" fill="url(#'+id+')" opacity="'+f(Math.min(1,(op===undefined?0.3:op)*1.5))+'"/>';
}
/* short broken strokes scattered inside a shape — the "pencil tooth" of the reference art */
function tooth(){ return ''; }   /* pencil scratches retired with the hand-drawn look */
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
