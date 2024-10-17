
<template>
   <section class="flex">

      <input ref="account"  name="account"  type="text"    placeholder="Account name" value="Illidan"/>
      <input ref="password" name="password" type="pasword" placeholder="Password"/>
      
      <button @click="loginBtn()">Log in</button>

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
   }
   
</style>
