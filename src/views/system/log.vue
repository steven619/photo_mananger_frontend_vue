<template>
  <div>
    <common-table
      ref="commonTable"
      :prop-query="listQuery"
      :dao="tableDao"
    >
      <div
        slot="buttonBar"
        style="display: flex;margin-bottom: 10px;"
      >
        <el-select
          v-model="listQuery.action"
          clearable
          style="margin-right: 8px"
          placeholder="操作选择"
        >
          <el-option
            v-for="item in operating"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <div
        slot="action"
        slot-scope="scope"
      >
        <el-button
          size="small"
          type="info"
          @click="showLogContent(scope.actionData)"
        >
          {{ $t('table.detail') }}
        </el-button>
      </div>
    </common-table>
    <el-dialog
      title="详情"
      :visible.sync="dialogFormVisible"
      width="70%"
    >
      <el-table
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        align="center"
        :row-class-name="tableRowClassName"
      >
        <el-table-column
          label="KEY"
          align="center"
          width="150"
          height="150"
        >
          <template slot-scope="scope">
            <div class="table_hide">
              {{ scope.row.key }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="名称"
          align="center"
          width="120"
        >
          <template slot-scope="scope">
            <div class="table_hide">
              {{ scope.row.comment }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="修改前"
          align="center"
        >
          <template slot-scope="scope">
            <div class="table_hide">
              {{ scope.row.last_value }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="修改后"
          align="center"
        >
          <template slot-scope="scope">
            <div class="table_hide">
              {{ scope.row.current_value }}
            </div>
          </template>
        </el-table-column>
      </el-table>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { TableDao } from '@/api/system/log.ts'
import CommonTable from '@/components/CommonTable/common_table.vue'
import { PaginationType } from '@/components/CommonTable/utils/types'
  @Component({
    name: 'Log',
    components: {
      CommonTable
    }
  })
export default class extends Vue {
    private tableDao:TableDao = new TableDao()
    private dialogFormVisible:boolean = false
    private list:Array<Object> = []
    private dateRange:string[] = []
    private listLoading = true
    private action:string = ''
    private pagination:PaginationType = {
      page: 1,
      start: 0,
      limit: 10
    }
    private listQuery:any = {
      action: '',
      daterange: {
        start_date: '',
        end_date: ''
      }
    }

    private operating = [
      {
        label: '修改',
        value: 3
      },
      {
        label: '删除',
        value: 2
      },
      {
        label: '增加',
        value: 1
      }
    ]

    private pickerOptions:Object = {
      shortcuts: [{
        text: '最近一周',
        // @ts-ignore
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
          picker.$emit('pick', [start, end])
        }
      },
      {
        text: '最近一个月',
        // @ts-ignore
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
          picker.$emit('pick', [start, end])
        }
      },
      {
        text: '最近三个月',
        // @ts-ignore
        onClick(picker) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
          picker.$emit('pick', [start, end])
        }
      }]
    }
    private setDataRange(e:any) {
      this.listQuery = {
        action: this.action,
        daterange: {
          start_date: e[0],
          end_date: e[1]
        }
      }
    }

    private showLogContent(e:any) {
      this.dialogFormVisible = true
      this.list = e.logs
    }
    // @ts-ignore
    private tableRowClassName({ row, rowIndex }) {
      if (row.current_value !== row.last_value) {
        return 'warning-row'
      }
    }
}
</script>

<style>

  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }

  .filter-container{
    display: flex;
  }
</style>

<style scoped>
  .box {
    width: 900px;
    display: flex;
    margin-top: 20px;
    margin-left: 20px;
    justify-content: space-between;
  }
  .table_hide{
    height: 30px;
    line-height: 30px;
    overflow: hidden;
  }
</style>
