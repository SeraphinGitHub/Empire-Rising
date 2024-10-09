
<template>
   <span class="flex">

      <p class="flex">{{ coordType.name }}</p>
      <p :class="'flex '+ coordType.classID" v-if="coordType.id !== undefined">{{ coordType.id }}</p>
      <p :class="'flex '+ coordType.classX"  v-if="coordType.x  !== undefined">{{ coordType.x }}</p>
      <p :class="'flex '+ coordType.classY"  v-if="coordType.y  !== undefined">{{ coordType.y }}</p>
   
   </span>
</template>


<script>
   export default {
      props: {
         coordType: Object,
      },
   }
</script>


<style scoped>
   span {
      position: relative;
      align-content: flex-start;
      height: 15%;
      width: 14%;
      margin: 10px;
   }

   span p {
      position: relative;
      justify-content: flex-start;
      width: 100%;
      color: white;
      text-shadow: black 2px 2px 4px;
   }
</style>