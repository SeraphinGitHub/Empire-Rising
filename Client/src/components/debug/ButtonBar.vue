
<template>
   <section class="flex btn-bar">

         <div class="flex bar-1">
            <button class="flex" @click="toggleGM('show_VP'  )">Viewport</button>
            <button class="flex" @click="toggleGM('show_Grid')">Grid    </button>
         </div>

         <div class="flex bar-2">
            <button class="flex" @click="toggleGM('isWallMode', $event)">Wall</button>
            <button class="flex" @click="toggleGM('isUnitMode', $event)">Unit</button>
         </div>

      </section>
</template>


<script lang="ts">
   export default {
      name: "ButtonBar",

      data() {
      return {
         isActive: {},
      }},

      methods: {
         toggleGM(
            property: string,
            event?:   Event,
         ) {
            const GM = this.$parent.GManager;

            GM[property] = !GM[property];

            if(property === "isWallMode") {
               GM.Cursor.selectCell = null;
               GM.Cursor.raycast    = null;
            }

            if(!event) return;

            const elem     = event.target as HTMLElement;
            const isActive = this.isActive[property];

            elem.classList.toggle("active", !isActive);
            this.isActive[property]       = !isActive;
         }
      },
   }
</script>


<style scoped lang="scss">

   .btn-bar {
      position: fixed;
      justify-content: space-between !important;
      bottom: 50px;
      height: 100px;
      width:  93%;
      // background: white;

      .bar-1 button {
         background: linear-gradient(to bottom right,
            blue,
            dodgerblue,
            white,
            dodgerblue,
            blue
         );
      }

      .bar-2 button {
         background: linear-gradient(to bottom right,
            orangered,
            darkorange,
            orange,
            gold,
            white,
            gold,
            orange,
            darkorange,
            orangered
         );
      }

      button {
         position: relative;
         top:  0px;
         left: 0px;

         margin-left: 20px;
         margin-right: 20px;
         height: 60px;
         width: 120px;
         border: 4px double dimgray;
         border-radius: 10px;
         font-size: 20px;
      }
   }

   button:active {
      top:  3px !important;
      left: 3px !important;
   }

   .active {
      background: linear-gradient(to bottom right,
         green,
         lime,
         white,
         lime,
         green
      ) !important;
   }
</style>