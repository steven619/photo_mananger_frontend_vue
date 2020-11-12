<template>
  <div class="dashboard-container">
    <h3>你好{{username}}!</h3>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import AdminDashboard from './admin/index.vue'
import request from '@/utils/request'

  @Component({
    name: 'Dashboard',
    components: {
    }
  })
export default class extends Vue {

  username:string = ''
  mounted() {
    this.getUerInfo()
  }
  getUerInfo() {
    request.get('/user/info').then((res:any) => {
      console.log(res, 8888)
      this.username = res.data.username
    })
  }
}
</script>

<style lang="scss" scoped>
  .dashboard {
    &-container {
      /*margin: 30px;*/
    }
    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }
</style>
