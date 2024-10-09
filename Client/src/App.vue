
<template>
   <section class="flex" id="root">

      <CartCanvas/>
      <IsoCanvas/>

      <Coordinates v-if="isLoaded" :htmlData ="htmlData"/>

      <ButtonBar/>
      
   </section>
</template>


<script lang="ts">

   // Components 
   import IsoCanvas       from "./components/canvas/IsometricsCanvas.vue"
   import CartCanvas      from "./components/canvas/CartesiansCanvas.vue"
   import Coordinates     from "./components/debug/Coordinates.vue"
   import ButtonBar       from "./components/debug/ButtonBar.vue"

   // Scripts
   import { io          } from "socket.io-client";
   import { unitParams  } from "./scripts/utils/unitParams";
   import { GameManager } from "./scripts/classes/_Export";
   
   export default {
      name: "App",

      components: {
         IsoCanvas,
         CartCanvas,
         Coordinates,
         ButtonBar,
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
         
         setInterval(   () => this.htmlData =  this.GManager.setHtmlData(), 50);
         this.$nextTick(() => setTimeout(() => this.isLoaded = true, 0       ));
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


<style lang="scss">

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
