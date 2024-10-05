
<template>
   <section class="flex" id="root">

      <Coordinates v-if="isLoaded" :htmlData ="htmlData"/>
      <CartCanvas/>
      <IsoCanvas/>

      <div class="flex btn-bar">
         <!-- <button class="flex" @click="sendData()"   >Send data</button> -->
         <button class="flex" @click="toggleFrame()">Toggle Viewport</button>
         <button class="flex" @click="toggleGrid()" >Toggle Grid</button>
      </div>
      
   </section>
</template>

<script lang="ts">

   // Components 
   import Coordinates from "./components/debug/Coordinates.vue"
   import IsoCanvas   from "./components/canvas/IsometricsCanvas.vue"
   import CartCanvas  from "./components/canvas/CartesiansCanvas.vue"

   // Scripts
   import { io          } from "socket.io-client";
   import { unitParams  } from "./scripts/utils/unitParams";
   import { GameManager } from "./scripts/classes/_Export";
   
   export default {
      name: "App",

      components: {
         Coordinates,
         IsoCanvas,
         CartCanvas,
      },

      data() {
      return {
         title:   "Empire Rising",
         URL:     "http://localhost:3000",
         isLoaded: false,
         socket:   null,
         GManager: null,
         htmlData: null,
         Canvas:   {},
         Ctx:      {},

         props: {
            HideGrid:     false,
            HideViewport: true,
         },
      }},

      async mounted() {

         document.title = this.title;
         // this.connectWith_Express();

         document.body.oncontextmenu = (event) => {
            event.preventDefault();
            event.stopPropagation();
         }
         
         this.GManager = new GameManager({
            unitParams,
            docBody: document.body,
            Canvas:  this.Canvas,
            Ctx:     this.Ctx,
            props:   this.props,
         });
         
         this.htmlData = this.GManager.setHtmlData();
         
         setInterval(() => {
            this.htmlData = this.GManager.setHtmlData();
         }, 50);


         this.$nextTick(() => setTimeout(() => {
            this.isLoaded = true;
         }, 0));
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

         toggleFrame() {
            this.GManager.HideViewport = !this.GManager.HideViewport;
         },

         toggleGrid() {
            this.GManager.HideGrid = !this.GManager.HideGrid;
         },
      },
   }
</script>

<style lang="scss">
   button:active{ background: red !important;}

   .btn-bar {
      position: fixed;
      justify-content: space-between !important;
      bottom: 10px;
      height: 100px;
      width: 650px;
      // background: white;

      button {
         height: 60px;
         width: 200px;
         border: 4px double green;
         border-radius: 10px;
         background: lime;
      }
   }

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
