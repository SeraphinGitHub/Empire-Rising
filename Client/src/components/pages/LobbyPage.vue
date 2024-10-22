
<template>
   <section class="flex">
      
      <div class="flex settings">

         <div class="flex params">
            <label>Faction</label>

            <select v-model="faction" class="flex" @change="setMapSettings()">
               <option value="Orange">Orange</option>
               <option value="Red"   >Red   </option>
               <option value="Blue"  >Blue  </option>
               <option value="Purple">Purple</option>
            </select>
         </div>

         <div class="flex params">
            <label>Map Size</label>

            <select v-model="mapSize" class="flex" @change="setMapSettings()">
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
         mapSettings: {
            faction: null,
            mapSize: null,
         },
      }},

      mounted() {
         this.setMapSettings();
      },

      methods: {

         enterGameBtn() {
            this.$emit("enterGame", this.mapSettings);
         },

         setMapSettings() {
            this.mapSettings.faction = this.faction;
            this.mapSettings.mapSize = this.mapSize;
         }
      }
   }
</script>


<style scoped lang="scss">

   section {
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
