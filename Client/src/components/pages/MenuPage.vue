
<template>
   <section class="flex">

      <button @click="multiBtn">Multiplayer</button>
      
   </section>
</template>


<script lang="ts">

   export default {
      name: "MenuPage",

      methods: {
         
         multiBtn() {
            this.$emit("accessMulti");
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
         orangered,
         darkorange,
         white,
         darkorange,
         orangered,
         black
      );
   }

</style>
