<template>
  <div>
    <el-amap vid="amapDemo" class="amap-demo"></el-amap>
  </div>
</template>

<script>
  import VueAMap from 'vue-amap';
  export default {
    name: "detect",
    components: {
      VueAMap,
    },
  }
</script>

<style scoped>
  .amap-demo {
    height: 100px;
  }
</style>
