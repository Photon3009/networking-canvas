/* iso.js — isometric drawing kit for the map illustrations.
   World units are pixels: +x runs to the lower right, +y to the lower left, +z straight up.
   Solids are lit from the upper left: top face brightest, the +y face at base colour,
   the +x face in shade with a light halftone. */
window.ISO = (function(){
'use strict';
var C = 0.8660, S = 0.5, OX = 80, OY = 74, uid = 0, HT = '';
var LINE = ' stroke="var(--iso-line)" stroke-width=".8" stroke-linejoin="round" stroke-linecap="round"';

function f(n){ return Math.round(n*10)/10; }
function at(x, y){ OX = x; OY = y; }
function origin(){ return [OX, OY]; }
function P(x, y, z){ return [OX + (x-y)*C, OY + (x+y)*S - (z||0)]; }
function pd(pts, open){
  return 'M'+pts.map(function(p){ return f(p[0])+' '+f(p[1]); }).join('L')+(open ? '' : 'Z');
}
function proj(pts){ return pts.map(function(p){ return P(p[0], p[1], p[2]); }); }
/* shade a colour toward white (k > 0) or black (k < 0) by |k| percent */
function lit(c, k){ return k ? 'color-mix(in srgb,'+c+','+(k > 0 ? '#fff ' : '#000 ')+Math.abs(k)+'%)' : c; }

/* one halftone tile per illustration, reused by every shaded face in it */
function begin(){
  HT = 'iht'+(++uid);
  return '<defs><pattern id="'+HT+'" width="2.4" height="2.4" patternUnits="userSpaceOnUse" patternTransform="rotate(30)">'+
    '<circle cx="1.2" cy="1.2" r=".55" fill="var(--ink)"/></pattern></defs>';
}
function poly(pts3, fill, o){
  o = o || {};
  return '<path d="'+pd(proj(pts3))+'" fill="'+fill+'"'+(o.edge === false ? '' : LINE)+
    (o.op !== undefined ? ' opacity="'+o.op+'"' : '')+'/>';
}
function halftone(pts3, op){
  return HT ? '<path d="'+pd(proj(pts3))+'" fill="url(#'+HT+')" opacity="'+(op || .16)+'"/>' : '';
}

/* axis-aligned box from its min corner */
function box(x, y, z, w, d, h, c, o){
  o = o || {};
  var t = [[x,y,z+h],[x+w,y,z+h],[x+w,y+d,z+h],[x,y+d,z+h]];
  var r = [[x+w,y,z],[x+w,y+d,z],[x+w,y+d,z+h],[x+w,y,z+h]];
  var l = [[x,y+d,z],[x+w,y+d,z],[x+w,y+d,z+h],[x,y+d,z+h]];
  return poly(l, o.left || c, o) + poly(r, o.right || lit(c, -20), o) +
    (o.ht === false ? '' : halftone(r, o.htOp)) + poly(t, o.top || lit(c, 40), o);
}
/* a quad lying on one face of the world: 'x' (constant x), 'y' or 'z' plane */
function face(plane, k, a0, b0, a1, b1, fill, o){
  var q;
  if(plane === 'z') q = [[a0,b0,k],[a1,b0,k],[a1,b1,k],[a0,b1,k]];
  else if(plane === 'y') q = [[a0,k,b0],[a1,k,b0],[a1,k,b1],[a0,k,b1]];
  else q = [[k,a0,b0],[k,a1,b0],[k,a1,b1],[k,a0,b1]];
  return poly(q, fill, o || { edge:false });
}
/* upright cylinder, centred on (x, y), standing on z */
function cyl(x, y, z, r, h, c, o){
  o = o || {};
  var id = 'icg'+(++uid), b = P(x, y, z), t = P(x, y, z+h), rx = r*1.2247, ry = r*0.7071;
  var body = 'M'+f(b[0]-rx)+' '+f(t[1])+'L'+f(b[0]-rx)+' '+f(b[1])+
    'A'+f(rx)+' '+f(ry)+' 0 0 0 '+f(b[0]+rx)+' '+f(b[1])+'L'+f(b[0]+rx)+' '+f(t[1])+'Z';
  return '<defs><linearGradient id="'+id+'" x1="0" x2="1">'+
      '<stop offset="0" stop-color="'+lit(c, 14)+'"/><stop offset=".5" stop-color="'+c+'"/>'+
      '<stop offset="1" stop-color="'+lit(c, -30)+'"/></linearGradient></defs>'+
    '<path d="'+body+'" fill="url(#'+id+')"'+LINE+'/>'+
    '<ellipse cx="'+f(t[0])+'" cy="'+f(t[1])+'" rx="'+f(rx)+'" ry="'+f(ry)+'" fill="'+(o.top || lit(c, 40))+'"'+LINE+'/>';
}
/* a circle lying flat on the ground plane */
function ring(x, y, z, r, color, w, op, dash){
  var p = P(x, y, z);
  return '<ellipse cx="'+f(p[0])+'" cy="'+f(p[1])+'" rx="'+f(r*1.2247)+'" ry="'+f(r*0.7071)+'" fill="none" stroke="'+color+
    '" stroke-width="'+(w || 1)+'" opacity="'+(op === undefined ? 1 : op)+'"'+(dash ? ' stroke-dasharray="'+dash+'"' : '')+'/>';
}
function disc(x, y, z, r, fill, op){
  var p = P(x, y, z);
  return '<ellipse cx="'+f(p[0])+'" cy="'+f(p[1])+'" rx="'+f(r*1.2247)+'" ry="'+f(r*0.7071)+'" fill="'+fill+'"'+
    (op !== undefined ? ' opacity="'+op+'"' : '')+'/>';
}
/* polyline through world points */
function line(pts3, color, w, o){
  o = o || {};
  return '<path d="'+pd(proj(pts3), true)+'" fill="none" stroke="'+color+'" stroke-width="'+(w || 1.2)+
    '" stroke-linecap="round" stroke-linejoin="round"'+(o.op !== undefined ? ' opacity="'+o.op+'"' : '')+
    (o.dash ? ' stroke-dasharray="'+o.dash+'"' : '')+'/>';
}
/* a cable: a dark casing under a coloured core, so it reads against any ground */
function cable(pts3, color, w){
  return line(pts3, 'var(--iso-line)', (w || 2) + 1.6) + line(pts3, color, w || 2);
}
function dot(x, y, z, r, c){
  var p = P(x, y, z);
  return '<circle cx="'+f(p[0])+'" cy="'+f(p[1])+'" r="'+r+'" fill="'+c+'"/>';
}
/* soft contact shadow under a footprint */
function shadow(x, y, w, d, spread){
  var s = spread === undefined ? 5 : spread, out = '', i;
  for(i = 2; i >= 0; i--){
    var e = s*(i+1)/3;
    out += poly([[x-e,y-e,0],[x+w+e*1.6,y-e,0],[x+w+e*1.6,y+d+e*1.6,0],[x-e,y+d+e*1.6,0]],
      'var(--ink)', { edge:false, op:.045 });
  }
  return out;
}

return { at:at, origin:origin, P:P, f:f, lit:lit, begin:begin, poly:poly, halftone:halftone, box:box, face:face,
         cyl:cyl, ring:ring, disc:disc, line:line, cable:cable, dot:dot, shadow:shadow, pd:pd };
})();
