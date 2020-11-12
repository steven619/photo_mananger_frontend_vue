<template>
  <div>
    <common-table
      ref="t"
      :dao="tableDao"
    >
      <div
        slot="public"
        slot-scope="e"
      >
        <span>{{ e.data.public?'是':'否' }}</span>
      </div>
    </common-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { TableDao } from '@/api/system/config.ts'
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
