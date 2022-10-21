
<template>
   <section class="flex" id="app">

      <Coordinates/>
      <IsoCanvas/>
      <CartCanvas/>
      
   </section>
</template>


<script>
   // Components 
   import Coordinates from "./components/debug/Coordinates.vue"
   import IsoCanvas   from "./components/canvas/IsometricsCanvas.vue"
   import CartCanvas  from "./components/canvas/CartesiansCanvas.vue"

   // Scripts
   import GameHandler  from "./scripts/gameHandler.js"

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
   }
</script>


<style>
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
      background-color: rgb(30, 30, 30);
   }

   p {
      font-size: 20px;
      font-family: Verdana;
      color: black;
   }

</style>
