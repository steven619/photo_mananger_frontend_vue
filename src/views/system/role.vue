<template>
  <div>
    <common-table
      ref="tableDao"
      :dao="tableDao"
    >
      <div
        slot="tableDefine"
        slot-scope="e"
      >
        <el-col :span="12">
        <el-tree
          :data="e.data"
          :show-checkbox="false"
          :props="{children: 'children',label: 'name'}"
          node-key="id"
          class="tree"
          style="border: 1px solid lightgray;padding: 25px;"
          default-expand-all
          :expand-on-click-node="false"
        >
          <span
            slot-scope="{node, data}"
            style="width: 100%;"
          >
            <span>{{ data.name }}</span>
            <el-tag
                    v-if="data.children_count"
              size="mini"
              style="margin-left: 10px;"
            >{{ data.children_count }}人</el-tag>
            <span
              v-if="!tableDao.checkMobile"
              style="float: right;"
            >
              <el-button
                v-waves
                class="filter-item"
                type="text"
                size="mini"
                @click="roleManager(data)"
              >
                权限管理
              </el-button>
              <el-button
                v-waves
                class="filter-item"
                type="text"
                size="mini"
                @click="$refs.tableDao.handleUpdate(data)"
              >
                编辑
              </el-button>
              <el-button
                v-waves
                class="filter-item"
                type="text"
                size="mini"
                @click="$refs.tableDao.deleteItem(data)"
              >
                删除
              </el-button>
              <el-button
                v-waves
                class="filter-item"
                type="text"
                size="mini"
                @click="addItem(data)"
              >
                添加
              </el-button>
            </span>
          </span>
        </el-tree>
        </el-col>
      </div>
      <div slot="buttonBar">
        <el-button
          v-waves
          class="filter-item"
          type="primary"
          style="margin-right: 8px"
          icon="el-icon-search"
          @click="refreshMenu"
        >
          同步菜单
        </el-button>
      </div>
      <div
        slot="pri"
        slot-scope="e"
      >
        <el-button
          v-waves
          class="filter-item"
          type="warning"
          icon="el-icon-warning"
          @click="roleManager(e.data)"
        >
          权限管理
        </el-button>
      </div>
    </common-table>
    <el-dialog
      title="权限管理"
      :close-on-click-modal="false"
      :visible.sync="dialogFormVisible"
    >
      <el-tree
        :data="treeDataSource"
        :show-checkbox="false"
        node-key="id"
        class="tree"
        default-expand-all
        :expand-on-click-node="false"
      >
        <span
          slot-scope="{node, data}"
          style="width: 100%;"
        >
          <span>{{ data.name }}</span>
          <span style="float: right;display: flex">
            <el-checkbox-group
              v-model="data.action"
              @change="setRole(data.id, data.action)"
            >
              <el-checkbox
                v-for="(item,index) in checkBoxList"
                :key="index"
                :label="item.value"
                @change="allRowSelect($event, data, item)"
              >{{ item.name }}</el-checkbox>
            </el-checkbox-group>
            <el-checkbox
              style="margin-left: 8px"
              @change="allColSelect($event, data)"
            >全选</el-checkbox>
          </span>
        </span>
      </el-tree>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button
          type="primary"
          @click="updateRole()"
        >
          更新
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { TableDao } from '@/api/system/role.ts'
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
    private treeDataSource:any[] = []
    private treeDataList:any[] = []
    private checkList: any[] = []
    private dialogFormVisible:boolean = false
    private actionObj:object = {}
    private roleObj:{'role_menu'?:object[], parent?: number} = { 'role_menu': [] }
    private roleId:number = 0
    private isRoot:boolean = false
    private checkBoxList:{name:string, value:number}[] = [
      { name: '查询', value: 1 },
      { name: '增加', value: 2 },
      { name: '修改', value: 4 },
      { name: '删除', value: 8 },
      { name: '导出', value: 16 }
    ]
    private created() {
    }

    private recursiveTraverse = (node:any, k:any) => {
      if (node.id === k.menu) {
        let p = []
        for (let i = 0; i < 5; i++) {
          p.push(k.action & (1 << i))
        }
        node.action = p
        let t = node.action.length === 0 ? 0 : node.action.reduce((a:number, b:number) => { return a + b })
        // @ts-ignore
        this.actionObj[node.id] = t
      }
      if (node.children.length > 0) {
        node.children.forEach((item:any, index:any) => {
          this.recursiveTraverse(item, k)
        })
      }
    }

    private recursiveTraverseRow = (node:any, b:boolean, id:any, v:any) => {
      if (node.id === id) {
        node.children && node.children.forEach((k:any) => {
          if (b === true) {
            if (k.action.indexOf(v) === -1) {
              k.action = [...k.action, [v]]
            }
          } else {
            if (k.action.indexOf(v) > -1) {
              k.action.remove(v)
            }
          }
        })
      }
      if (node.children.length > 0) {
        node.children.forEach((item:any, index:any) => {
          this.recursiveTraverseRow(item, b, id, v)
        })
      }
    }

    private allRowSelect(e:any, data:any, item:any) {
      // this.recursiveTraverseRow({
      //   id: 0,
      //   children: this.treeDataSource,
      //   name: '',
      //   path: ''
      // }, e, data.id, item.value)
    }

    private allColSelect(e:any, data:any) {
      if (e === true) {
        data.action = [1, 2, 4, 8, 16]
      } else {
        data.action = [0, 0, 0, 0, 0]
      }
      this.setRole(data.id, data.action)
    }

    private recursiveTraverseParent = (node:any, k:any) => {
      if (node.id === k.menu) {
        let p = []
        for (let i = 0; i < 5; i++) {
          p.push(k.action & (1 << i))
        }
        node.parent_action = p
      }
      if (node.children.length > 0) {
        node.children.forEach((item:any, index:any) => {
          this.recursiveTraverseParent(item, k)
        })
      }
    }

    private addItem(data:any) {
      // @ts-ignore
      this.$refs.tableDao.handleCreate(data)
      // @ts-ignore
      // this.$refs.tableDao.formSchemaData.parent = { name: data.name, id: data.id }
    }

    private getApis(l:any[]) {
      let p:any[] = []
      l.forEach((k:any) => {
        let o:any = { path: k.path }
        if (k.meta && k.meta.title) {
          o.title = this.$t('route.' + k.meta.title)
        }
        if (k.meta && k.meta.apis) {
          o.apis = k.meta.apis
        }
        if (k.children) {
          // @ts-ignore
          o['children'] = this.getApis(k.children)
        }
        p.push(o)
      })
      return p
    }

    private refreshMenu() {
      let m = this.getApis(asyncRoutes)
      this.tableDao.syncMenu(m).then((res:any) => {
        this.$notify({
          title: '成功',
          message: '同步成功',
          type: 'success'
        })
      })
    }

    private roleManager(e:any) {
      this.roleId = e.id
      // this.actionObj = {}
      this.tableDao.getMenu().then((res:any) => {
        this.treeDataSource = res.data
        this.tableDao.getRoleMenu(e.id).then((res:any) => {
          this.isRoot = !!res.data.parent.id
          this.roleObj = res.data
          this.roleObj && this.roleObj.role_menu && this.roleObj.role_menu.forEach((k: any, indexk:number) => {
            this.recursiveTraverse({
              id: 0,
              children: this.treeDataSource,
              name: '',
              path: ''
            }, k)
          })
          res.extra_data && res.extra_data.role_menu && res.extra_data.role_menu.forEach((k: any, indexk:number) => {
            this.recursiveTraverseParent({
              id: 0,
              children: this.treeDataSource,
              name: '',
              path: ''
            }, k)
          })
          this.dialogFormVisible = true
        })
      })
    }

    private updateRole() {
      let aList:object[] = []
      Object.keys(this.actionObj).forEach((k:any) => {
        aList.push({
          'menu': parseInt(k),
          // @ts-ignore
          'action': this.actionObj[k]
        })
      })
      this.roleObj.role_menu = aList
      // @ts-ignore
      this.roleObj.parent = this.roleObj.parent.id
      // @ts-ignore
      this.roleObj.admins = this.roleObj.admins.id
      this.tableDao.putRoleMenu(this.roleId, this.roleObj).then((res:any) => {
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success'
        })
        this.dialogFormVisible = false
      })
    }

    private setRole(e:any, action:number[]) {
      let t = action.length === 0 ? 0 : action.reduce((a:number, b:number) => { return a + b })
      // @ts-ignore
      this.actionObj[e] = t
    }
}
</script>

<style lang="scss" scoped>
  .tree {
    width: 100%;
  }
</style>
