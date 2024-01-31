
<template>
   <div class="flex debug-message">

      <p class="flex title">{{ title }}</p>
      <p class="flex message" v-for="(value, key) in message" :key="key">
         {{ value }}
      </p>

   </div>
</template>


<script>
   export default {
      props: {
         title:   String,
         message: Object,
      },
   }
</script>


<style scoped>
   .debug-message {
      position: relative;
      height: auto;
      width: 100%;
   }

   .debug-message p {
      position: relative;
      width: 100%;
      font-size: 20px;
      font-weight: 600;
   }

   .title {
      margin: 10px;
      color: darkviolet;
      text-decoration: underline;
   }

   .message {
      color: black;
   }
</style>