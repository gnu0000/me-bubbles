//
// bubblescene.js - part of bubble sample animation demo
// This exports a BubbleScene() class, which creates the bubbles
// and handles the animation based on the driver fn
//
// Craig Fitzgerald
//

import * as $ from "jquery";
import Bubble from "./bubble.js";

var BUBBLE_COUNT    = 400;
var BUBBLE_RADIUS   = 15;
var UPDATE_INTERVAL = 40;

export default function BubbleScene(canvas, options){
   var self = this;

   this.Init = function(canvas, options){
      self.bubbles     = [];
      self.canvas      = canvas;
      self.ctx         = canvas.getContext('2d');
      self.initialized = 0;
      
      $(canvas).data('object', self);
      
      var defaults = {
         bgColor0:          "#FFF", 
         bgColor1:          "#8F8",
         bubbleCount:       BUBBLE_COUNT,
         bubbleRadius:      15,
         center:            {x: 0, y:0, z:1000},
         animationInterval: UPDATE_INTERVAL,
         animationIncrement:(Math.PI * UPDATE_INTERVAL) /8000,
         startRange:        {dmin: 0, dmax:800, ymin:-200, ymax: 200, tmin:0, tmax: Math.PI * 2},
         keepSorted:        1,
         offsetCamera:      0
      };
      self.options = $.extend(defaults, options || {});
      
      self.Draw         = self.options.drawFn         || self.DefaultDraw;
      self.CreateBubbles= self.options.createBubblesFn|| self.DefaultCreateBubbles;
      self.CreateBubble = self.options.createBubbleFn || self.DefaultCreateBubble;
      self.BubbleInit   = self.options.bubbleInitFn   || self.DefaultBubbleInit;
      self.DrawBubble   = self.options.drawBubbleFn   || self.DefaultDrawBubble;
      self.UpdateBubble = self.options.updateBubbleFn || self.DefaultUpdateBubble;
      self.BubbleIsGone = self.options.bubbleIsGoneFn || self.DefaultBubbleIsGone;
   };
   
   this.InitState = function(){
      self.bkgGradient = self.ctx.createLinearGradient(0, 0, 0, canvas.height);
      self.bkgGradient.addColorStop(0, self.options.bgColor0);
      self.bkgGradient.addColorStop(1, self.options.bgColor1);
      self.CreateBubbles();
   };

   // 0=disable 1=enable 2=toggle
   this.Enable = function (enable){
      if (self.initialized == 0){
         self.InitState ();
         self.initialized = 1;
      }
      if ((enable == 0 || enable == 2) && self.interval) {
         clearInterval(self.interval);
         self.interval = null;
         self.DrawBackground();
         $(canvas).hide();
      } else if ((enable == 1 || enable == 2) && !self.interval) {
         $(canvas).show();
         self.interval = setInterval(self.Draw, self.options.animationInterval);
      }
   };

   this.DefaultCreateBubbles = function (){
      for (var i=0; i<self.options.bubbleCount; i++){
         var bubble = self.CreateBubble(i);
         self.bubbles.push(bubble);
         self.BubbleInit(bubble,i);
      }
   };

   this.DefaultCreateBubble = function (i) {
      var bubble       = new Bubble(self.ctx, self.options.bubbleRadius);
      bubble.d         = self.options.startRange.dmin + Math.random() * (self.options.startRange.dmax - self.options.startRange.dmin);
      bubble.y         = self.options.startRange.ymin + Math.random() * (self.options.startRange.ymax - self.options.startRange.ymin);
      bubble.theta     = self.options.startRange.tmin + Math.random() * (self.options.startRange.tmax - self.options.startRange.tmin);
      bubble.increment = self.options.bubbleIncrement || (Math.PI * self.options.animationInterval) /8000;
      return bubble;
   };
   
   this.DefaultBubbleInit = function (bubble,i) {};

   this.DefaultDraw = function () {
      self.DrawBackground();

      if(self.options.keepSorted){
         self.bubbles.sort(function(a,b){
            return Math.cos(b.theta) * b.d  - Math.cos(a.theta) * a.d;
         });
      };

      for (let i=0; i < self.bubbles.length; i++){
         var bubble = self.bubbles[i];
         self.DrawBubble  (bubble);
         self.UpdateBubble(bubble);

         if (self.BubbleIsGone(bubble)) {
            self.bubbles.splice(i, 1);
            bubble = self.CreateBubble(i);
            self.bubbles.unshift(bubble);
            self.BubbleInit(bubble,i);
            //delete bubble;
         }
      }
   };   

   this.DrawBackground = function () {
      self.ctx.fillStyle = self.bkgGradient;
      self.ctx.fillRect(0, 0, self.canvas.width, self.canvas.height);
   };

   this.DefaultDrawBubble = function (bubble) {
      var xpos   = Math.sin(bubble.theta) * bubble.d + self.options.center.x;
      var ypos   = bubble.y;
      var zpos   = Math.cos(bubble.theta) * bubble.d + self.options.center.z;
      var radius = bubble.radius;

      if (self.options.offsetCamera){
         ypos += Math.cos(bubble.theta) * bubble.d /20;
      };

      // map 3d coordinates to 2d camera view
      var vx = (xpos  / zpos) * 1000 + self.canvas.width/2;
      var vy = (ypos  / zpos) * 1000 + self.canvas.height/2;
      var vr = (radius/ zpos) * 1000;

      bubble.Draw(self.ctx, vx, vy, vr);
   };

   this.DefaultUpdateBubble = function (bubble){
      bubble.theta += bubble.increment;
   };

   this.DefaultBubbleIsGone = function (bubble){
      return 0;
   };

   this.Init(canvas, options);
};

