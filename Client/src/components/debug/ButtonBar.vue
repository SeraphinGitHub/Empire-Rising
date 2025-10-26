
<template>
   <section class="flex btn-bar">

      <div class="flex bar-1">
         <button class="flex bgd-blue"   @click="toggleGM('show_VP'  )">Viewport</button>
         <button class="flex bgd-blue"   @click="toggleGM('show_Grid')">Grid    </button>
      </div>

      <div class="flex bar-2">
         <button class="flex bgd-orange" @click="toggleGM('isCastleMode',  $event)">Castle  </button>
         <button class="flex bgd-orange" @click="toggleGM('isBarrackMode', $event)">Barrack </button>
         <button class="flex bgd-orange" @click="toggleGM('isWallMode',    $event)">Wall    </button>
         <button class="flex bgd-orange" @click="toggleGM('isUnitMode',    $event)">Unit    </button>
      </div>

      <div class="flex bar-3">
         <div class="flex ressource">
            <p>Food</p>
            <p>{{ playerYield.food     }}</p>
         </div>

         <div class="flex ressource">
            <p>Stone</p>
            <p>{{ playerYield.stone    }}</p>
         </div>

         <div class="flex ressource">
            <p>Wood</p>
            <p>{{ playerYield.wood     }}</p>
         </div>

         <div class="flex ressource">
            <p>Coal</p>
            <p>{{ playerYield.coal     }}</p>
         </div>

         <div class="flex ressource">
            <p>Iron Ore</p>
            <p>{{ playerYield.ironOre  }}</p>
         </div>

         <div class="flex ressource">
            <p>Iron Bar</p>
            <p>{{ playerYield.ironBar  }}</p>
         </div>

         <div class="flex ressource">
            <p>Gold Ore</p>
            <p>{{ playerYield.goldOre  }}</p>
         </div>

         <div class="flex ressource">
            <p>Gold Bar</p>
            <p>{{ playerYield.goldBar  }}</p>
         </div>
      </div>

   </section>
</template>


<script lang="ts">
   export default {
      name: "ButtonBar",

      props: {
         playerYield:  Object,
      },

      data() {
      return {
         isActive:   {},
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
      justify-content: space-between;
      bottom: 30px;
      width:  97%;
      // background: white;

      .bar-1 {
         position: relative;
         justify-content: space-between;
         width: 22%;
         top: 165px;
      }

      .bar-2 {
         width: 100%;
      }

      .bar-1 button,
      .bar-2 button {
         margin: 10px;
         height: 50px;
         width: 100px;
      }

      .bar-3 {
         justify-content: space-around;
         margin: auto;
         height: 100px;
         width: 55%;
         border: 4px double black;
         border-radius: 10px;
         background: silver;

         .ressource {
            align-content: space-around;
            height: 100%;
            width: 12%;
            // background: blue;
         }

         p {
            font-size: 18px;
            align-content: center;
            text-align: center;
            border: 1px solid black;
            border-radius: 5px;
            height: 45%;
            width: 100%;
            background: white;
         }
      }

      button {
         position: relative;
         top:  0px;
         left: 0px;

         margin-left: 20px;
         margin-right: 20px;
         height: 60px;
         width: 110px;
         border: 4px double dimgray;
         border-radius: 10px;
         font-size: 20px;
      }
   }

   .bgd-blue {
      background: linear-gradient(to bottom right,
         blue,
         dodgerblue,
         white,
         dodgerblue,
         blue
      );
   }

   .bgd-orange {
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