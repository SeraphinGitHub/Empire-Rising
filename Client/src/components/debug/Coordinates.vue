
<template>
   <section v-if="isLoaded" class="coordinates flex">

      <CoordSpan :coordType ="population"   />
      <CoordSpan :coordType ="viewportCoord"/>
      <CoordSpan :coordType ="screenCoord"  />
      <CoordSpan :coordType ="gridCoord"    />
      <CoordSpan :coordType ="cellCoord"    />
      <CoordSpan :coordType ="cellID"       />

   </section>
</template>


<script>
   import CoordSpan from "./CoordSpan.vue"

   export default {
      components: {
         CoordSpan,
      },

      props: {
         htmlData: Object,
      },

      data() {
      return {
         isLoaded:      false,

         population:    undefined,
         viewportCoord: undefined,
         screenCoord:   undefined,
         gridCoord:     undefined,
         cellCoord:     undefined,
         cellID:        undefined,
      }},

      watch: {
         htmlData() { this.initDOM() }
      },

      mounted() {            
         this.initDOM();

         this.$nextTick(() => setTimeout(() => {
            this.isLoaded = true;
         }, 0));
      },
      
      methods: {

         initDOM() {
            this.setPopulation    ();
            this.setViewportCoord ();
            this.setScreenCoord   ();
            this.setGridCoord     ();
            this.setCellCoord     ();
            this.setCellID        ();
         },

         setPopulation() {
            const { curPop, maxPop } = this.htmlData;

            this.population = {
               name: "Population:",
               classID: "ID-cell",
               id: `${curPop} / ${maxPop}`,
            }
         },

         setViewportCoord() {
            const { viewPort } = this.htmlData;

            this.viewportCoord = {
               name: "Viewport Coord:",
               classX: "cartX",
               classY: "cartY",
               x: `x : ${viewPort.x}`,
               y: `y : ${viewPort.y}`,
            }
         },
         
         setScreenCoord() {
            const { cartPos } = this.htmlData;

            this.screenCoord = {
               name: "Screen Coord:",
               classX: "cartX",
               classY: "cartY",
               x: `x : ${cartPos.x}`,
               y: `y : ${cartPos.y}`,
            }
         },

         setGridCoord() {
            const { gridPos } = this.htmlData;

            this.gridCoord = {
               name: "Grid Coord:",
               classX: "isoX",
               classY: "isoY",
               x: `x : ${gridPos.x}`,
               y: `y : ${gridPos.y}`,
            }
         },

         setCellCoord() {
            const { hoverCell } = this.htmlData;

            this.cellCoord = {
               name: "Cell Coord:",
               classX: "cellX",
               classY: "cellY",
               x: `x : ${hoverCell.pos.x}`,
               y: `y : ${hoverCell.pos.y}`,
            }
         },

         setCellID() {
            const { hoverCell } = this.htmlData;

            this.cellID = {
               name: "Cell ID:",
               classID: "ID-cell",
               id: `id : ${hoverCell.id}`,
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

   .coordinates {
      user-select: none;
      
      justify-content: space-around;
      align-content: flex-start;
      position: fixed;
      top: 15px;
      height: auto;
      width: 1400px;
   }
</style>