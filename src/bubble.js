//
// bubble.js - part of bubble sample animation demo
// This exports a Bubble() class, which paints a single bubble
//
// Craig Fitzgerald
//

import * as $ from "jquery";

export default function Bubble(ctx, radius) {
   var self = this;

   this.Init = function(ctx,radius) {
      self.ctx    = ctx;
      self.radius = radius;
      self.color  = self.HSVToRGB (_x(Math.random()), 192, 255, 0.5);
   };

   this.Draw = function (ctx, xpos, ypos, radius) {
      var gradient = ctx.createRadialGradient(xpos + radius/4, ypos - radius/4, radius/5, xpos, ypos, radius);
      gradient.addColorStop(0,    '#fff'           );
      gradient.addColorStop(0.85, self.color       );
      gradient.addColorStop(1,    'rgba(0,0,128,0)');
      ctx.fillStyle = gradient;

      ctx.fillRect(xpos-radius, ypos-radius, radius*2, radius*2);
   };

   // Ported countless times to countless languages. originally from povray
   // which I'm sure was ported from something else
   this.HSVToRGB = function (h, s, v, o) {
      var dh = h / 255 * 6;
      var ds = s / 255    ;
      var dv = v / 255    ;

      var di = Math.floor(dh);
      var df = dh - di;

      var p1 = dv * (1 - ds);
      var p2 = dv * (1 - (ds * df));
      var p3 = dv * (1 - (ds * (1 - df)));

      var dr, dg, db;
      if      (di == 0) {dr = dv; dg = p3; db = p1}
      else if (di == 1) {dr = p2; dg = dv; db = p1}
      else if (di == 2) {dr = p1; dg = dv; db = p3}
      else if (di == 3) {dr = p1; dg = p2; db = dv}
      else if (di == 4) {dr = p3; dg = p1; db = dv}
      else if (di == 5) {dr = dv; dg = p1; db = p2}
      else              {dr = dg = db = 0}

      return 'rgba('+_x(dr)+','+_x(dg)+','+_x(db)+','+String(o)+')';
   }

   //private util fn
   function _x(i) {return String(Math.floor(i * 256));};

   this.Init(ctx,radius);
};

