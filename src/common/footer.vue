<template>
  <div>
    <Tabbar>
      <TabbarItem show-dot>
        <img slot="icon" src=""/>
        <span slot="label">自主巡航</span>
      </TabbarItem>
      <TabbarItem selected link="/component/demo">
        <img slot="icon" src=""/>
        <span slot="label">智慧清洁</span>
      </TabbarItem>
      <TabbarItem badge="2">
        <img slot="icon" src=""/>
        <span slot="label">水质监测</span>
      </TabbarItem>
    </Tabbar>
  </div>
</template>

<script>
  import { Tabbar, TabbarItem } from 'vux'
  export default {
    name: "footer",
    components: {
      Tabbar,
      TabbarItem,
    },
  }
</script>

<style scoped>

</style>
