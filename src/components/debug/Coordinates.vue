
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
   import { readGlo } from '../../scripts/utils/_GlobalVar';

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
               popValue: `${readGlo.CurrentPop} / ${readGlo.MaxPop}`,
            }
         },
         
         screenCoord() {
            return {
               name: "Screen Coord:",
               classX: "cartX",
               classY: "cartY",
               x: `x : ${readGlo.SelectArea.currentPos.cartesian.x}`,
               y: `y : ${readGlo.SelectArea.currentPos.cartesian.y}`,
            }
         },

         gridCoord() {
            return {
               name: "Grid Coord:",
               classX: "isoX",
               classY: "isoY",
               x: `x : ${readGlo.IsoGridPos.x}`,
               y: `y : ${readGlo.IsoGridPos.y}`,
            }
         },

         cellCoord() {
            return {
               name: "Cell Coord:",
               classX: "cellX",
               classY: "cellY",
               x: `x : ${readGlo.HoverCell.gridPos.x}`,
               y: `y : ${readGlo.HoverCell.gridPos.y}`,
            }
         },

         cellID() {
            return {
               name: "Cell ID:",
               classID: "ID-cell",
               id: `id : ${readGlo.HoverCell.id}`,
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