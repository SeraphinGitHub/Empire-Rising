
<template>
   <section class="flex">

      <div class="flex div-terrain">
         <canvas ref="terrain" class="canvas-terrain"/>
      </div>

      <canvas ref="assets"    class="cnvs canvas-assets"   />
      <canvas ref="selection" class="cnvs canvas-selection"/>

   </section>
</template>

<script>

   export default {

      data() {
      return {
         allCanvas: [
            "terrain",
            "assets",
            "selection",
         ],
      }},

      mounted() {

         this.allCanvas.forEach((canvasName) => {
            const canvasElem                = this.$refs[canvasName];
            this.$parent.Canvas[canvasName] = canvasElem;
            this.$parent.Ctx   [canvasName] = canvasElem.getContext("2d");
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
      overflow: hidden;

      /* -----------------------------------  Tempory  ----------------------------------- */
      width:  1400px !important; /* Has to match _GlobalVar.Viewport.width */
      height:  1000px !important; /* Has to match _GlobalVar.Viewport.heght */
      /* -----------------------------------  Tempory  ----------------------------------- */
     
      background: black;
   }

   .cnvs,
   .div-terrain {
      position: fixed;
      height: 100%;
      width: 100%;
   }

   .canvas-terrain {
      z-index: 10;
      /* background: orange; */
   }

   .canvas-assets {
      z-index: 20;
      /* background: dodgerblue; */
   }

   .canvas-selection {
      z-index: 30;
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