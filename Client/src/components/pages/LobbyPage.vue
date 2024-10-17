
<template>
   <section class="flex">
      
      <div class="flex settings">

         <div class="flex params">
            <label>Faction</label>

            <select v-model="faction" class="flex" @change="setBattleSpecs()">
               <option value="Orange">Orange</option>
               <option value="Red"   >Red   </option>
               <option value="Blue"  >Blue  </option>
               <option value="Purple">Purple</option>
            </select>
         </div>

         <div class="flex params">
            <label>Map Size</label>

            <select v-model="mapSize" class="flex" @change="setBattleSpecs()">
               <option value="big"   >Big   </option>
               <option value="medium">Medium</option>
               <option value="small" >Small </option>
            </select>
         </div>
         
      </div>

      <button @click="enterGameBtn">Enter Game</button>

   </section>
</template>


<script lang="ts">

   export default {
      name: "LobbyPage",

      data() {
      return {
         battleSpecs: {
            faction: null,
            mapSize: null,
         },

         faction:   "Orange",
         mapSize:   "small",
      }},

      mounted() {
         this.setBattleSpecs();
      },

      methods: {

         enterGameBtn() {
            this.$emit("enterGame", this.battleSpecs);
         },

         setBattleSpecs() {
            this.battleSpecs.faction = this.faction;
            this.battleSpecs.mapSize = this.mapSize;
         }
      }
   }
</script>


<style scoped lang="scss">

   section {
      width:  400px;
      height: 600px;
      border: 4px double grey;
      border-radius: 20px;
      background: linear-gradient(to bottom right,
         black,
         darkviolet,
         white,
         darkviolet,
         black
      );

      .settings {
         align-content: flex-start;
         justify-content: space-between;
         height: 430px;
         width: 95%;
         border-radius: 10px;
         background: rgba(0, 0, 0, 0.6);
      }

      .params {
         align-content: space-between;
         margin: 15px;
         height: 80px;
         width:  42%;
         color: white;
      }

      select {
         height: 40px;
         width:  100%;
      }

   }

</style>
