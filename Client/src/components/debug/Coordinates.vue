
<template>
   <section class="coordinates flex">

      <CoordSpan :coordType ="population"/>
      <CoordSpan :coordType ="screenCoord"/>
      <CoordSpan :coordType ="gridCoord"/>
      <CoordSpan :coordType ="cellCoord"/>
      <CoordSpan :coordType ="cellID"/>

   </section>
</template>


<script>
   import CoordSpan   from "./CoordSpan.vue"

   import { readGlo } from '../../scripts/utils/_GlobalVar';

   export default {
      components: {
         CoordSpan,
      },

      data() {
      return {
         title: `Empire Rising`,
      }},

      computed: {
         population() {
            return {
               name: "Population:",
               classID: "ID-cell",
               id: `${readGlo.CurrentPop} / ${readGlo.MaxPop}`,
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
   p {
      width: 100%;
      font-size: 20px;
      font-weight: 600;
   }

   .title {
      margin: 10px;
      color: darkviolet;
      text-decoration: underline;
   }

   .coordinates {
      justify-content: space-around;
      align-content: flex-start;
      position: fixed;
      top: 10px;
      height: auto;
      width: 1400px;
      background: white;
   }
</style>