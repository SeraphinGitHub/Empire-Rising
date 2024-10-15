
<template>
   <section class="flex cover">
      
      <CartCanvas/>
      <IsoCanvas/>
      <Coordinates v-if="isLoaded" :htmlData ="htmlData"/>
      <ButtonBar/>

   </section>
</template>


<script lang="ts">

   // Components 
   import IsoCanvas       from "../canvas/IsometricsCanvas.vue"
   import CartCanvas      from "../canvas/CartesiansCanvas.vue"
   import Coordinates     from "../debug/Coordinates.vue"
   import ButtonBar       from "../debug/ButtonBar.vue"

   // Scripts
   import { GameManager } from "../../scripts/modules/_Export";

   export default {
      name: "GamePage",

      components: {
         IsoCanvas,
         CartCanvas,
         Coordinates,
         ButtonBar,
      },
      
      props: {
         socket: Object,
      },

      data() {
      return {
         isLoaded: false,
         GManager: null,
         htmlData: null,
         Canvas:   {},
         Ctx:      {},
      }},

      mounted() {

         this.socket.emit("getParams");

         this.socket.on  ("sendParams", (unitParams: any) => {
            this.initGManager(unitParams);

            this.$nextTick(() => setTimeout(() => {
               this.loadCoordinates ();
               this.startGame();
            }, 0));
         });

         this.preventCtxMenu ();
         this.onSync         ();
      },

      methods: {
         
         preventCtxMenu() {

            document.body.oncontextmenu = (event) => {
               event.preventDefault();
               event.stopPropagation();
            };
         },

         initGManager(unitParams: any) {

            this.GManager = new GameManager({
               unitParams,
               Canvas: this.Canvas,
               Ctx:    this.Ctx,
            });
         },

         onSync() {

            this.socket.on("sync", (data: any) => {
               console.log(data);
            });
         },

         startGame() {
            this.socket.emit("startGame", {
               name:     this.$parent.accName,
               gridSize: this.GManager.gridSize,
               cellSize: this.GManager.cellSize,
            });
         },

         loadCoordinates() {
               
            this.htmlData = this.GManager.setHtmlData();
            this.isLoaded = true;
   
            setInterval(() => this.htmlData = this.GManager.setHtmlData(), 50);
         },
      }
   }
</script>


<style scoped lang="scss">

</style>
