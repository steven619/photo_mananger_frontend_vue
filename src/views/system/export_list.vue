<template>
  <div>
    <common-table
      ref="t"
      :auto-refresh="true"
      :dao="tableDao"
    >
      <div
        slot="progress"
        slot-scope="e"
      >
        {{ e.data.progress }}%
      </div>
      <div
        slot="action"
        slot-scope="e"
      >
        <el-button
          v-if="e.actionData.url"
          style="margin-left: 10px;"
          size="small"
          type="success"
          @click="downloadExcel(e.actionData.url)"
        >
          下载
        </el-button>
      </div>
    </common-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { TableDao } from '@/api/system/export_list'
import CommonTable from '@/components/CommonTable/common_table.vue'

@Component({
  name: 'ExportList',
  components: {
    CommonTable
  }
})
export default class extends Vue {
  private tableDao:TableDao = new TableDao()

  public downloadExcel(url:string) {
    this.tableDao.downloadFile(url)
  }
}
</script>

<style scoped>

</style>
