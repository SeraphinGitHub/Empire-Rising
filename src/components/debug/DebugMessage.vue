
<template>
   <div class="flex debug-message">

      <p class="flex mess-1">{{ message_1 }}</p>
      <p class="flex mess-2">{{ message_2 }}</p>

   </div>
</template>


<script>
   export default {
      props: {
         message_1: String,
         message_2: String,
      },
   }
</script>


<style scoped>
   .debug-message {
      position: relative;
      height: 60px;
      width: 100%;
   }

   .debug-message p {
      position: relative;
      width: 100%;
      font-size: 20px;
      font-weight: 600;
   }

   .mess-1 {
      color: darkviolet;
      text-decoration: underline;
   }

   .mess-2 {
      color: black;
   }
</style>