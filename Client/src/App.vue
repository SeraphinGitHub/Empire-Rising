
<template>
   <section class="flex" id="root">

      <Coordinates/>
      <IsoCanvas/>
      <CartCanvas/>

      <!-- <button class="flex" @click="sendData()" style="position: fixed; bottom: 100px; background: lime;">
         Send data
      </button> -->
      
   </section>
</template>

<script lang="ts">

   // Components 
   import Coordinates from "./components/debug/Coordinates.vue"
   import IsoCanvas   from "./components/canvas/IsometricsCanvas.vue"
   import CartCanvas  from "./components/canvas/CartesiansCanvas.vue"

   // Scripts
   import { io          } from "socket.io-client";
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
         title: "Empire Rising",
         URL:   "http://localhost:3000",
         socket: null,
      }},

      async mounted() {

         document.title = this.title;
         // this.connectWith_Express();
         
         // GameHandler.init(document, socket);
         GameHandler.init(document);
      },

      methods: {
         connectWith_Express() {
            this.$nextTick(() => setTimeout(async () => {
               
               await fetch(`${this.URL}/login`)
               .then((response: any) => {
                  if(response.ok) this.connectWith_SocketIO();
               }).catch((error) => console.log(error))

            }, 0));
         },

         connectWith_SocketIO() {
            this.socket = io(this.URL);

            this.socket.on("sync", (data: any) => {
               console.log(data);
            });
         },

         sendData() {
            if(this.socket === null) return;
            this.socket.emit("connectSocketIO", { success: true });
         },
      },
   }
</script>

<style>
   button:active{ background: red !important;}

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
