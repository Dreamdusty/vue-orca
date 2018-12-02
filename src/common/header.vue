<template>
  <div>
    <XHeader>
      <x-icon slot="overwrite-left" type="navicon" size="35" style="fill:#fff;position:relative;top:-8px;left:-3px;"></x-icon>
    </XHeader>
  </div>
</template>

<script>
  import { XHeader } from 'vux'
  export default {
    name: "header",
    components: {
      XHeader,
    },
  }
</script>

<style scoped>

</style>
