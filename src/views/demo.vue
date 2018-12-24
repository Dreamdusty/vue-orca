<template>
  <div>
    <picker :data="years" v-model="picker" @on-change="change"></picker>
  </div>
</template>

<script>
  import { Picker } from 'vux'
  export default {
    name: "demo",
    data() {
      return {
        picker: ['请选择船只'],
        years: ['请选择船只', '灞桥', '浐河', '丰庆'],
      }
    },
    methods: {
      change (value) {
        console.log(value);
      }
    },
    components: {
      Picker,
    },
  }
</script>

<style scoped>

</style>
