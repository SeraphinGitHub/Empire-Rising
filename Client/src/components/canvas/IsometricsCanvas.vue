
<template>
   <section class="flex">

      <div class="flex">
         <canvas ref="isometric" class="flex canvas-isometric"></canvas>
      </div>

   </section>
</template>

<script>
   
   export default {

      mounted() {

         const canvasName = "isometric";
         const canvasElem = this.$refs[canvasName];

         this.$parent.Canvas[canvasName] = canvasElem;
         this.$parent.Ctx   [canvasName] = canvasElem.getContext("2d");
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
      opacity: 50%;
      height: 1080px;
      width: 1920px;

      /* -----------------------------------  Tempory  ----------------------------------- */
      width:  1400px !important; /* Has to match _GlobalVar.Viewport.width */
      height:  1000px !important; /* Has to match _GlobalVar.Viewport.heght */
      /* -----------------------------------  Tempory  ----------------------------------- */
   }

   div {
      position: fixed;
      top: 50%;
      transform: translate(0%, -50%) rotateX(60deg);
      width: 100%;
      height: 100%;
   }

   canvas {
      z-index: 0;
      position: fixed;
      top: 50%;
      transform: translate(0%, -50%) rotateZ(-45deg);
   }

   /* --- Laptop 17,3" --- */
   @media screen and (min-width : 1367px) and (max-width : 1600px) {
      section {
         width: 1600px;
         height: 900px;
      }
   }
   
   /* --- Laptop 15,6" --- */
   @media screen and (max-width : 1366px) {
      section {
         width: 1366px;
         height: 768px;
      }
   }
</style>