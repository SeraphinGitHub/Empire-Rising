
<template>
   <section class="coordinates flex">

      <DebugMessage
         :title   ="title"
         :message ="population"
      />

      <CoordSpan :coordType ="screenCoord"/>
      <CoordSpan :coordType ="gridCoord"/>
      <CoordSpan :coordType ="cellCoord"/>
      <CoordSpan :coordType ="cellID"/>

   </section>
</template>


<script>
   // Components
   import CoordSpan    from "./CoordSpan.vue"
   import DebugMessage from "./DebugMessage.vue"
   
   // Scripts
   import { glo } from "../../scripts/utils/_GlobalVar"

   export default {
      components: {
         CoordSpan,
         DebugMessage,
      },

      data() {
      return {
         title: `Empire Rising`,
      }},

      computed: {
         population() {
            return {
               popText:  `Population`,
               popValue: `${glo.CurrentPop} / ${glo.MaxPop}`,
            }
         },

         screenCoord() {
            return {
               name: "Screen Coord:",
               classX: "cartX",
               classY: "cartY",
               x: `x : ${glo.SelectArea.currentPos.cartesian.x}`,
               y: `y : ${glo.SelectArea.currentPos.cartesian.y}`,
            }
         },

         gridCoord() {
            return {
               name: "Grid Coord:",
               classX: "isoX",
               classY: "isoY",
               x: `x : ${glo.IsoGridPos.x}`,
               y: `y : ${glo.IsoGridPos.y}`,
            }
         },

         cellCoord() {
            return {
               name: "Cell Coord:",
               classX: "cellX",
               classY: "cellY",
               x: `x : ${glo.HoverCell.gridPos.x}`,
               y: `y : ${glo.HoverCell.gridPos.y}`,
            }
         },

         cellID() {
            return {
               name: "Cell ID:",
               classID: "ID-cell",
               id: `id : ${glo.HoverCell.id}`,
            }
         },
      },
   }
</script>


<style scoped>
   .coordinates {
      justify-content: space-between;
      align-content: space-between;
      position: fixed;
      top: 50%;
      left: 15px;

      transform: translate(0%, -50%);
      padding-bottom: 5px;
      height: 500px;
      width: 185px;
      background: white;
   }
</style>