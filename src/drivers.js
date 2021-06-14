//
// drivers.js - part of bubble sample animation demo
// This exports several driver functions, each of which 
// makes a different scene
//
// Craig Fitzgerald
//

import * as $ from "jquery";


// a sample scene - a rotating scene of fixed bubbles
//
export function SpinningBubbles(canvas){
   return {};
};


// a sample scene - a spinning torus
//
export function BubbleDonut(canvas){
   return {
      bubbleRadius: 8,
      center:       {x: 0, y:0, z:1800},
      startRange:   {dmin: 500, dmax:600, ymin:-50, ymax:10, tmin:0, tmax:0},
      bubbleInitFn: function(bubble){
         bubble.theta = Math.random() * Math.PI * 2;
      }
   };
}


// a sample scene - a spinning spiral
//
export function BubbleSpiral(canvas){
   return {
      bubbleCount:  144,
      bubbleRadius: 12,
      center:       {x: 0, y:0, z:1200},
      offsetCamera: 1,
      bubbleInitFn: function(bubble,i){
         var ii = Math.floor(i/6);
         var jj = i%6;
         bubble.d     = ii * 20;
         bubble.y     = -30;
         bubble.theta = jj*Math.PI/3 - (Math.PI/100)*ii;
      }
   };
}


// a sample scene - bubbles approaching and flying by
//
export function BubbleStarfield(canvas){
   return {
      bubbleCount:  600,
      bubbleRadius: 60,
      bubbleInitFn: function(bubble,i){
         bubble.xpos = Math.random()*1000-500,
         bubble.ypos = Math.random()*1000-500,
         bubble.zpos = Math.random()*3000+50
         },
      drawBubbleFn: function(bubble){
         if (self.zpos == 0) self.zpos = 0.01;
         var vx = (bubble.xpos  / bubble.zpos ) * 1000 + canvas.width/2;
         var vy = (bubble.ypos  / bubble.zpos ) * 1000 + canvas.height/2;
         var vr = (bubble.radius / bubble.zpos) * 200 + 1;
         bubble.Draw(bubble.ctx, vx, vy, vr);
         },
      updateBubbleFn: function(bubble){
         bubble.zpos -= 20;
         },
      bubbleIsGoneFn: function(bubble){
         return (bubble.zpos < 21);
      }
   };
}


// a sample scene - bubbles floating around and popping
//
export function FloatingBubbles(canvas){
   return {
      bubbleCount:  50,
      
      bubbleInitFn: function(bubble,i){
         bubble.dr     = ((Math.random()*2-1));
         bubble.dx     = ((Math.random()*80)-40)/10.0;
         bubble.dy     = ((Math.random()*80)-40)/10.0;
         bubble.radius = Math.random()*20 + 10;      
         bubble.xpos   = Math.random() * canvas.width; 
         bubble.ypos   = (bubble.dy>0 ? -bubble.radius : canvas.height + bubble.radius);
         if (bubble.dy<0.05 && bubble.dy>-0.05) bubble.dy=1;
         },
      drawBubbleFn: function(bubble){
         bubble.Draw(bubble.ctx, bubble.xpos, bubble.ypos, bubble.radius);
      },
      updateBubbleFn: function(bubble){
         bubble.xpos   += bubble.dx;
         bubble.ypos   += bubble.dy;
         bubble.radius += bubble.dr;
      },
      bubbleIsGoneFn: function(bubble){
         return (bubble.xpos > canvas.width  + bubble.radius ||
                 bubble.ypos > canvas.height + bubble.radius ||
                 bubble.xpos < 0             - bubble.radius ||
                 bubble.ypos < 0             - bubble.radius ||
                 bubble.radius <= 0                 ||
                 bubble.radius > 60                 );
      }
   };
}

