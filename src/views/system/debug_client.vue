<template>
  <div>
    <common-table
      ref="t"
      :dao="tableDao"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { TableDao } from '@/api/system/debug_client.ts'
import CommonTable from '@/components/CommonTable/common_table.vue'

  @Component({
    name: 'GoodsCategory',
    components: {
      CommonTable
    }
  })
export default class extends Vue {
    private tableDao:TableDao = new TableDao()
}
</script>

<style scoped>

</style>
