
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

      methods: {

         loginBtn() {
            this.$emit("userLogin", {
               account: this.$refs.account.value,
            });
         },

         createBattleBtn() {
            this.$emit("createBattle", {

               channel:    "createBattle",
               name:       "Illidan",
               team:       "1",
               teamColor:  "Orange",

               mapSettings: {
                  maxPop:  "_500",
                  mapSize: "small",
               },
            });
         },

         joinBattleBtn() {
            this.$emit("joinBattle", {

               channel:   "joinBattle",
               name:      "Malfurion",
               team:      "2",
               teamColor: "Purple",

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
