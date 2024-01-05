
<template>
   <section class="flex">

      <canvas class="flex canvas-isoSelect"></canvas>

   </section>
</template>


<style scoped>
   section {
      position: fixed;
      top: 50%;
      transform: rotateX(60deg);
   }

   canvas {
      z-index: 0;
      position: fixed;
      transform: translate(0%, -50%) rotateZ(-45deg);
      background: mediumseagreen;
   }
</style>