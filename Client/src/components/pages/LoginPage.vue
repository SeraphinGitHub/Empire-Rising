
<template>
   <section class="flex">

      <input ref="account"  name="account"  type="text"    placeholder="Account name" value="Illidan"/>
      <input ref="password" name="password" type="pasword" placeholder="Password"/>
      
      <button @click="enterGame()">Enter</button>

   </section>
</template>

<script lang="ts">
   export default {
      methods: {

         enterGame() {
            this.$emit("enterGame", {
               account: this.$refs.account.value,
            });
         },
      },
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
         dodgerblue,
         white,
         dodgerblue,
         black
      );

      input,
      button {
         margin: 20px;
         height: 50px;
         border: 4px double black;
         border-radius: 8px;
         background: silver;
         color: white;
         text-shadow: black 2px 2px 4px;
      }
      
      input {
         text-align: left;
         width: 80%;
         padding-left: 20px;
      }

      button {
         margin: 50px;
         width: 60%;
         background: linear-gradient(to bottom,
            green,
            lime,
            white,
            lime,
            green
         );
      }

      button:active {
         margin: 55px;
         width:  55%;
         height: 40px;
      }
   }
   
</style>
