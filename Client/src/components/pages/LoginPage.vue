
<template>
   <section class="flex">

      <input ref="account"  name="account"  type="text"    placeholder="Account name" value="Illidan"/>
      <input ref="password" name="password" type="pasword" placeholder="Password"/>
      
      <!-- <button @click="loginBtn()">Log in</button> -->

      <!-- Tempory -->
      <div class="flex" style="justify-content: space-between">
         <button style="width: 40%"  @click="createBattleBtn()">Create Battle</button>
         <button style="width: 40%"  @click="joinBattleBtn  ()">Join Battle  </button>
         <button style="width: 100%" @click="startBattleBtn ()">Start Battle </button>
      </div>
      <!-- Tempory -->

   </section>
</template>


<script lang="ts">

   export default {
      name: "LoginPage",

      // teamColor:
      // Blue
      // Green
      // Orange
      // Pink
      // Purple
      // Red
      // Yellow

      methods: {

         loginBtn() {
            this.$emit("userLogin", {
               account: this.$refs.account.value,
            });
         },

         createBattleBtn() {
            this.$emit("createBattle", {

               playerProps: {
                  name:       "Illidan",
                  teamID:      1,
                  teamColor:   2,
               },

               mapSettings: {
                  maxPop:  "_200",
                  mapSize: "small",
               },
            });
         },

         joinBattleBtn() {
            this.$emit("joinBattle", {

               playerProps: {
                  name:      "Malfurion",
                  teamID:     2,
                  teamColor:  4,
               },

               battleID: "47",
            });
         },

         startBattleBtn() {
            this.$emit("loadBattle", { battleID: "47" });
         }
      },
   }
</script>


<style scoped lang="scss">

   section {
      background: linear-gradient(to bottom right,
         black,
         dodgerblue,
         white,
         dodgerblue,
         black
      );
   }
   
</style>
