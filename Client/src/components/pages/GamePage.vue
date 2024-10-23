
<template>
   <section class="flex">
      
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
         socket:   Object,
         initPack: Object,
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

         this.initGManager   ();
         this.preventCtxMenu ();
         this.$nextTick(     () => this.loadCoordinates());
      },

      methods: {
         
         preventCtxMenu() {

            document.body.oncontextmenu = (event) => {
               event.preventDefault();
               event.stopPropagation();
            };
         },

         initGManager() {

            this.GManager = new GameManager(
               this.Canvas,
               this.Ctx,
               this.socket,
               this.initPack,
            );
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
