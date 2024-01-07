
<template>
   <section class="flex">

      <canvas v-for="canvasName in allCanvas"
         :key="canvasName"
         :ref="canvasName"
         :class="`flex canvas-${canvasName}`"
      ></canvas>

   </section>
</template>

<script lang="ts">

   // Scripts
   import { ref } from "vue";
   import { glo } from "../../scripts/utils/_GlobalVar"

   export default {

      data() {
      return {
         allCanvas: [
            "terrain",
            "buildings",
            "units",
            "selection",
         ],
      }},

      mounted() {

         this.allCanvas.forEach(canvasName => {
            const canvasElem = this.$refs[canvasName] as HTMLCanvasElement;

            glo.Canvas[canvasName] = canvasElem;
            glo.Ctx   [canvasName] = canvasElem.getContext("2d") as CanvasRenderingContext2D;
         });
      },
   }
</script>

<style scoped>
   section {
      position: fixed;
      top: 50%;
      transform: translate(0%, -50%);
      height: 1080px;
      width: 1920px;
   }

   canvas {
      position: fixed;
      height: 100%;
      width: 100%;
      /* opacity: 30%; */
   }

   .canvas-terrain {
      z-index: 10;
      /* background: orange; */
   }

   .canvas-buildings {
      z-index: 20;
      /* background: darkviolet; */
   }

   .canvas-units {
      z-index: 30;
      /* background: dodgerblue; */
   }

   .canvas-selection {
      z-index: 40;
      /* background: red; */
   }


   /* --- Laptop 17,3" --- */
   @media screen and (min-width : 1367px) and (max-width : 1600px) {
      section {
         height: 900px;
         width: 1600px;
      }
   }
   
   /* --- Laptop 15,6" --- */
   @media screen and (max-width : 1366px) {
      section {
         height: 768px;
         width: 1366px;
      }
   }
</style>