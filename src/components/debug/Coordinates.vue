
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

   export default {
      components: {
         CoordSpan,
         DebugMessage,
      },

      computed: {

         screenCoord() {
         return {
            name: "Screen Coord:",
            classX: "cartX",
            classY: "cartY",
            x: "x : 0",
            y: "y : 0",
         }},

         gridCoord() {
         return {
            name: "Grid Coord:",
            classX: "isoX",
            classY: "isoY",
            x: "x : 0",
            y: "y : 0",
         }},

         cellCoord() {
         return {
            name: "Cell Coord:",
            classX: "cellX",
            classY: "cellY",
            x: "x : 0",
            y: "y : 0",
         }},

         cellID() {
         return {
            name: "Cell ID:",
            classID: "ID-cell",
            id: "id :",
         }},
      },

      data() {
      return {
         title: `Empire Rising`,
         faction: ``,
      }},
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