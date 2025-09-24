
<template>
   <section class="flex btn-bar">

         <div class="flex bar-1">
            <button class="flex" @click="toggleGM('show_VP'  )">Viewport</button>
            <button class="flex" @click="toggleGM('show_Grid')">Grid    </button>
         </div>

         <div class="flex bar-3">
            <div class="flex ressource">
               <p>Food</p>
               <p>{{ ressources.food     }}</p>
            </div>

            <div class="flex ressource">
               <p>Stone</p>
               <p>{{ ressources.stone    }}</p>
            </div>

            <div class="flex ressource">
               <p>Wood</p>
               <p>{{ ressources.wood     }}</p>
            </div>

            <div class="flex ressource">
               <p>Coal</p>
               <p>{{ ressources.coal     }}</p>
            </div>

            <div class="flex ressource">
               <p>Iron Ore</p>
               <p>{{ ressources.ironOre  }}</p>
            </div>

            <div class="flex ressource">
               <p>Iron Bar</p>
               <p>{{ ressources.ironBar  }}</p>
            </div>

            <div class="flex ressource">
               <p>Gold Ore</p>
               <p>{{ ressources.goldOre  }}</p>
            </div>

            <div class="flex ressource">
               <p>Gold Bar</p>
               <p>{{ ressources.goldBar  }}</p>
            </div>
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

      props: {
         ressources: Object,
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
      justify-content: space-around !important;
      bottom: 50px;
      height: 100px;
      width:  95%;
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

      .bar-3 {
         justify-content: space-around;
         align-content: space-around;
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