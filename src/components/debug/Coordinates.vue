
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
   import CoordSpan    from "./CoordSpan.vue"
   import DebugMessage from "./DebugMessage.vue"
   import GlobalVar    from "../../scripts/modules/globalVar.js"

   export default {
      components: {
         CoordSpan,
         DebugMessage,
      },

      data() {
      return {
         glo:    GlobalVar,
         title: `Empire Rising`,
      }},

      computed: {
         population() {
            return {
               popText:  `Population`,
               popValue: `${this.glo.CurrentPop} / ${this.glo.MaxPop}`,
            }
         },

         screenCoord() {
            return {
               name: "Screen Coord:",
               classX: "cartX",
               classY: "cartY",
               x: `x : ${this.glo.SelectArea.currentPos.cartesian.x}`,
               y: `y : ${this.glo.SelectArea.currentPos.cartesian.y}`,
            }
         },

         gridCoord() {
            return {
               name: "Grid Coord:",
               classX: "isoX",
               classY: "isoY",
               x: `x : ${this.glo.IsoGridPos.x}`,
               y: `y : ${this.glo.IsoGridPos.y}`,
            }
         },

         cellCoord() {
            return {
               name: "Cell Coord:",
               classX: "cellX",
               classY: "cellY",
               x: `x : ${this.glo.HoverCell.gridPos.x}`,
               y: `y : ${this.glo.HoverCell.gridPos.y}`,
            }
         },

         cellID() {
            return {
               name: "Cell ID:",
               classID: "ID-cell",
               id: `id : ${this.glo.HoverCell.id}`,
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