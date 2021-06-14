//
// index.js - main driver of bubble sample animation demo
// This manages the page interaction
//
// Craig Fitzgerald
//

import "./index.css";
import * as $ from "jquery";
import BubbleScene from "./BubbleScene.js";
import * as drivers from "./drivers.js";

$(function() {
   new PageHandler();
});

function PageHandler() {
   var self = this;

   this.init = function(){
      self.canvas = $("canvas.bubbles").get(0);
      self.Resize();
      $("#buttons").on("click", "button", self.HandleClick);
      $(window).resize(self.Resize);
      $("#buttons button.b3").trigger("click");
   };

   this.Resize = function(){
      self.canvas.width  = $(self.canvas).width();
      self.canvas.height = $(self.canvas).height();
   };

   this.HandleClick = function(event){
      self.StopAll();
      self.GetButtonCtx(event.target).scene.Enable(1);
   };

   this.GetButtonCtx = function(button){
      let ctx = $(button).data("ctx");
      if (ctx) return ctx;
      let dname  = $(button).data("driver");
      let driver = drivers[dname](self.canvas);
      let scene  = new BubbleScene(self.canvas, driver);
      ctx = {driver, scene};
      $(button).data("ctx", ctx);
      return ctx;
   };

   this.StopAll = function(){
      $("#buttons button").each((i, button) => {
         let ctx = $(button).data("ctx");
         if (ctx) ctx.scene.Enable(0);
      });
   };

   this.init();
}
