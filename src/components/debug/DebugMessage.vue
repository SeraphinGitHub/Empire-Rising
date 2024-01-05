
<template>
   <div class="flex debug-message">

      <p class="flex">{{ message }}</p>

   </div>
</template>


<script>
   export default {
      props: {
         message: String,
      },
   }
</script>


<style scoped>
   .debug-message {
      position: relative;
      height: 100%;
      width: 25%;
   }

   .debug-message p {
      position: relative;
      width: 100%;
      color: darkviolet;
      font-size: 22px;
      font-weight: 600;
   }
</style>