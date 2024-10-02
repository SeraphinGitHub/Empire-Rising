
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
   import CoordSpan       from "./CoordSpan.vue"
   import { GameManager } from "../../scripts/classes/_Export"

   export default {
      components: {
         CoordSpan,
      },

      props: {
         GManager: GameManager,
      },

      data() {
      return {
         title: `Empire Rising`,
      }},

      // computed: {
      methods: {
         population() {
            return {
               name: "Population:",
               classID: "ID-cell",
               id: `${this.GManager.curPop} / ${this.GManager.maxPop}`,
            }
         },
         
         screenCoord() {
            return {
               name: "Screen Coord:",
               classX: "cartX",
               classY: "cartY",
               x: `x : ${this.GManager.Cursor.curPos.cart.x}`,
               y: `y : ${this.GManager.Cursor.curPos.cart.y}`,
            }
         },

         gridCoord() {
            return {
               name: "Grid Coord:",
               classX: "isoX",
               classY: "isoY",
               x: `x : ${this.GManager.gridPos.x}`,
               y: `y : ${this.GManager.gridPos.y}`,
            }
         },

         cellCoord() {
            return {
               name: "Cell Coord:",
               classX: "cellX",
               classY: "cellY",
               x: `x : ${this.GManager.Cursor.hoverCell.pos.x}`,
               y: `y : ${this.GManager.Cursor.hoverCell.pos.y}`,
            }
         },

         cellID() {
            return {
               name: "Cell ID:",
               classID: "ID-cell",
               id: `id : ${this.GManager.hoverCell.id}`,
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