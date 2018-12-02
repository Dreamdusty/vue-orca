<template>
  <div>
    <XHeader></XHeader>

    <XFooter></XFooter>
  </div>
</template>

<script>
  import XHeader from '/common/header'
  import XFooter from '/common/footer'
  export default {
    name: "home",
    components: {
      XHeader,
      XFooter,
    },
  }
</script>

<style scoped>

</style>
