
<template>
   <section class="flex">

      <div class="flex">
         <canvas ref="isoSelectCanvas" class="flex canvas-isoSelect"></canvas>
      </div>

   </section>
</template>

<script lang="ts">

   // Scripts
   import { ref } from "vue";
   import { glo } from "../../scripts/utils/_GlobalVar"
   
   export default {

      mounted() {
         const canvasName = "isoSelect";
         const canvasElem = this.$refs[canvasName] as HTMLCanvasElement;

         glo.Canvas[canvasName] = canvasElem;
         glo.Ctx   [canvasName] = canvasElem.getContext("2d") as CanvasRenderingContext2D;
      },
   }
</script>

<style scoped>
   section {
      position: fixed;
      overflow: hidden;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);

      /* -----------------------------------  Tempory  ----------------------------------- */
      width:  1000px !important;
      height: 650px !important;
      /* -----------------------------------  Tempory  ----------------------------------- */

      background-color: black;
   }

   div {
      position: fixed;
      top: 50%;
      transform: translate(0%, -50%) rotateX(60deg);
      width: 100%;
      height: 100%;
      /* background-color: blue; */
   }

   canvas {
      z-index: 0;
      position: fixed;
      top: 50%;
      transform: translate(0%, -50%) rotateZ(-45deg);
      background: mediumseagreen;
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