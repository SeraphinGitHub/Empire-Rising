
<template>
   <section class="flex">
      
      <CartCanvas/>
      <IsoCanvas/>
      <Coordinates v-if="isLoaded" :htmlData ="htmlData"/>
      <ButtonBar :playerYield ="playerYield"/>

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
         isLoaded:    false,
         GManager:    null,
         htmlData:    null,
         Canvas:      {},
         Ctx:         {},
         playerName:  "",
         teamColor:   "",
         playerYield: {},
      }},

      mounted() {
         try {
            this.initGManager   ();
            this.preventCtxMenu ();
            this.$nextTick(     () => this.loadCoordinates());
         }
         
         catch(error) {
            console.log({ Error: "Could not init GameManager in GamePage !"});
         }
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

            setTimeout(() => {
               this.playerName  = this.GManager.name;
               this.teamColor   = this.GManager.teamColor;
               this.playerYield = this.GManager.playerYield;
            }, 100);
   
            setInterval(() => {
               this.htmlData    = this.GManager.setHtmlData();
               this.playerYield = this.htmlData.playerYield; 
            }, 50);
         },
      }
   }
</script>


<style scoped lang="scss">

</style>
