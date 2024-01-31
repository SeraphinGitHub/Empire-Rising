
<template>
   <section class="flex" id="root">

      <Coordinates/>
      <IsoCanvas/>
      <CartCanvas/>
      
   </section>
</template>

<script lang="ts">

   import { io } from "socket.io-client";

   // Components 
   import Coordinates from "./components/debug/Coordinates.vue"
   import IsoCanvas   from "./components/canvas/IsometricsCanvas.vue"
   import CartCanvas  from "./components/canvas/CartesiansCanvas.vue"

   // Scripts
   import { GameHandler } from "./scripts/_GameHandler"

   export default {
      name: "App",

      components: {
         Coordinates,
         IsoCanvas,
         CartCanvas,
      },

      data() {
      return {
         socket: null,
      }},

      mounted() {
         GameHandler.init(document);
         
         this.socket = io();

         this.socket.on('connect', () => {
            console.log('Connected to server');
         });
      },
   }
</script>

<style>
   #root {
      position: fixed;
      height: 100%;
      width: 100%;
      background-color: rgb(60, 60, 60);
   }

   html * {
      /* Reset */
      margin: 0;
      padding: 0;
      cursor: url("../public/GUI/cursors.png"), auto !important;
   }

   .flex {
      /* flexCenter */
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-content: center;
   }  

   p,
   input,
   button {
      font-family: "Verdana";
      font-size: 22px;
      text-align: center;
   }

   input,
   button {
      border: none;
      background: none;
   }
</style>
