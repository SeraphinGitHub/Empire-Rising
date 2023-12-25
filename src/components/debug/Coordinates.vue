
<template>
   <section class="coordinates flex">

      <DebugMessage
         :message_1 ="title"
         :message_2 ="faction"
      />

      <CoordSpan :coordType ="screenCoord"/>
      <CoordSpan :coordType ="gridCoord"/>
      <CoordSpan :coordType ="cellCoord"/>
      <CoordSpan :coordType ="cellID"/>

   </section>
</template>


<script>
   import CoordSpan    from "./CoordSpan.vue"
   import DebugMessage from "./DebugMessage.vue"
   import Glo          from "../../scripts/modules/mod_globalVar.js"

   export default {
      components: {
         CoordSpan,
         DebugMessage,
      },

      data() {
         return {
            title:   `- Empire Rising -`,
            faction: `Faction: ${Glo.faction}`,

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
      width: 60%;
      background: white;
   }
</style>