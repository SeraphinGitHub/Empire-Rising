
<template>
   <section class="coordinates flex">

      <CoordSpan :coordType ="screenCoord"/>
      <CoordSpan :coordType ="gridCoord"/>
      <CoordSpan :coordType ="cellCoord"/>
      <CoordSpan :coordType ="cellID"/>

   </section>
</template>


<script>
   import CoordSpan from "./CoordSpan.vue"

   export default {
      components: {
         CoordSpan,
      },

      data() {
         return {
            screenCoord: {
               name: "Screen Coord:",
               classX: "cartX",
               classY: "cartY",
               x: 0,
               y: 0,
            },

            gridCoord: {
               name: "Grid Coord:",
               classX: "isoX",
               classY: "isoY",
               x: 0,
               y: 0,
            },

            cellCoord: {
               name: "Cell Coordinates:",
               classX: "cellX",
               classY: "cellY",
               x: 0,
               y: 0,
            },

            cellID: {
               name: "Cell ID:",
               classID: "ID-cell",
               id: "",
            },
         }
      },
   }
</script>


<style scoped>
   .coordinates {
      justify-content: space-around;
      position: fixed;
      top: 15px;

      padding-bottom: 5px;
      height: 80px;
      width: 50%;
      background: white;
   }
</style>