
<template>
   <section class="flex" id="app">

      <Coordinates/>
      <IsoCanvas/>
      <CartCanvas/>
      
      <button class="flex rand-path-btn" @click="randomize">Randomize Path</button>
      <button class="flex stop-path-btn" @click="stopRand">Stop randomize</button>
      
   </section>
</template>


<script>
   // Components 
   import Coordinates from "./components/debug/Coordinates.vue"
   import IsoCanvas   from "./components/canvas/IsometricsCanvas.vue"
   import CartCanvas  from "./components/canvas/CartesiansCanvas.vue"

   // Scripts
   import GameHandler  from "./scripts/_GameHandler.js"

   export default {
      name: "App",

      mixins: [
         GameHandler,
      ],

      components: {
         Coordinates,
         IsoCanvas,
         CartCanvas,
      },

      mounted() {
         this.initGameHandler(document);
      },

      methods: {
         randomize() {
            const enter = new KeyboardEvent('keydown', { key: 'Enter' });
            window.dispatchEvent(enter);
         },

         stopRand() {
            const backspace = new KeyboardEvent('keydown', { key: 'Backspace' });
            window.dispatchEvent(backspace);
         }
      },
   }
</script>


<style>

   /* ------ Tempory ------ */
   .rand-path-btn,
   .stop-path-btn {
      z-index: 10;
      position: fixed;
      padding: 15px !important;
      
      right: 30px;
      height: 50px;
      width: auto;

      text-align: center;
      border-radius: 10px;

      font-size: 20px;
      font-family: Verdana;
      color: black;
   }

   .rand-path-btn {
      top: 100px;
      border: double blue 4px;
      background-color: dodgerblue;
   }

   .stop-path-btn {
      top: 200px;
      border: double red 4px;
      background-color: pink;
   }

   .rand-path-btn:active,
   .stop-path-btn:active {
      right: 27px;
      box-shadow: black -3px -3px;
   }

   .rand-path-btn:active {
      top: 103px;
   }

   .stop-path-btn:active {
      top: 203px;
   }
   /* ------ Tempory ------ */

   .canvas-selection {
      cursor: url("../public/GUI/cursors.png"), auto !important;
   }

   .flex {
      /* Reset */
      margin: 0;
      padding: 0;

      /* flexCenter */
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-content: center;
   }

   body {
      height: 100%;
      background-color: rgb(60, 60, 60);
   }

   p {
      font-size: 20px;
      font-family: Verdana;
      color: black;
   }

</style>
