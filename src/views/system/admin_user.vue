<template>
  <common-table
    :dao="tableDao"
    :prop-query="listQuery"
  >
    <div
      slot="roles"
      slot-scope="e"
      style="display: inline-flex;"
    >
      <el-tag
        v-for="(item,index) in e.data.roles"
        :key="'role'+index"
        style="margin-right: 3px"
      >
        {{ item.name }}
      </el-tag>
    </div>
    <div
      slot="super"
      slot-scope="scope"
      :style="{color: scope.data.super === true ? 'green' : 'red'}"
    >
      {{ scope.data.super === true ? '是' : '否' }}
    </div>
    <div
      slot="machines"
      slot-scope="scope"
    >
      <el-popover
        placement="left"
        title="设备列表"
        trigger="click"
      >
        <el-row>
          <el-table
            :data="scope.data.machines"
          >
            <el-table-column
              property="id"
              width="50"
              label="ID"
            />
            <el-table-column
              property="name"
              width="200"
              label="数量"
            />
          </el-table>
        </el-row>
        <el-button
          slot="reference"
          type="text"
          icon-class="device"
          size="mini"
        >
          {{ `${scope.data.machines.length}台` }}
        </el-button>
      </el-popover>
    </div>
    <div
      slot="action"
      slot-scope="scope"
    >
      <el-button
        v-if="isEngineer"
        type="success"
        size="small"
        style="margin-right: 8px"
        @click="showCamera(scope.actionData)"
      >
        设备
      </el-button>
    </div>
  </common-table>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { TableDao } from '@/api/system/admin_user.ts'
import CommonTable from '@/components/CommonTable/common_table.vue'
import { asyncRoutes } from '@/router'
  @Component({
    name: 'Custom',
    components: {
      CommonTable
    }
  })
export default class extends Vue {
    private tableDao:TableDao = new TableDao()
    private pathName:string = ''
    private listQuery:any = {}
    created() {
      this.pathName = this.$route.path
      if (this.pathName === '/system/engineer') {
        this.listQuery.role = 4
      }
      this.tableDao.tableColumn.forEach((k:any, i:number) => {
        console.log(this.pathName, 444)
        if (this.pathName === '/system/engineer' && k.value === 'machines') {
          this.tableDao.tableColumn[i].type = 'remoteselect'
          this.tableDao.tableColumn[i].hide = false
        }
        if (this.pathName === '/system/engineer' && k.value === 'roles') {
          this.tableDao.tableColumn[i].type = 'slot'
        }

        if (!this.isAdmin && k.value === 'organization') {
          this.tableDao.tableColumn[i].type = 'slot'
        }
      })
    }
    // remoteselect

    get isAdmin() {
      return this.$store.state.user.roles.indexOf('超级管理员') > -1
    }

    get isEngineer() {
      return this.$store.state.user.roles.indexOf('工程师') > -1
    }
}
</script>

<style scoped>

</style>
