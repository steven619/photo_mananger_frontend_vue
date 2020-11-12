<template>
  <div>
    <common-table
      ref="commonTable"
      :prop-query="listQuery"
      :dao="tableDao"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { TableDao } from '@/api/system/login_log.ts'
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
    // private dialogFormVisible:boolean = false
    // private list:Array<Object> = []
    private dateRange:string[] = []
    // private listLoading = true
    // private action:string = ''
    // private pagination:PaginationType = {
    //   page: 1,
    //   start: 0,
    //   limit: 10
    // }
    private listQuery:any = {
      user_type: 2,
      daterange: {
        start_date: '',
        end_date: ''
      }
    }
    //
    // private operating = [
    //   {
    //     label: '修改',
    //     value: 3
    //   },
    //   {
    //     label: '删除',
    //     value: 2
    //   },
    //   {
    //     label: '增加',
    //     value: 1
    //   }
    // ]
    //
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
        daterange: {
          start_date: e[0],
          end_date: e[1]
        }
      }
    }
}
</script>
