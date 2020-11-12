<template>
  <div :class="{'app-container': !checkMobile}">
    <el-page-header
      v-if="tableDao.parent && parentInfo"
      style="margin: 10px;"
      :content="parentInfo.name"
      @back="subFilter({id: parentInfo.parent && parentInfo.parent.id})"
    />
    <slot
      v-if="tableDao.mobileSearchBar"
      name="mobileSearchBar"
    />
    <div v-else-if="checkMobile">
      <mu-appbar
        color="#fff"
        :z-depth="1"
      >
        <el-input
          slot="default"
          v-model="listQuery.keywords"
          placeholder="搜索关键字"
          clearable
          class="filter-item"
          @keyup.enter.native="handleFilter"
        />
        <mu-button
          slot="right"
          icon
          @click="handleFilter"
        >
          <mu-icon
            value="search"
            color="blue"
          />
        </mu-button>
      </mu-appbar>
    </div>
    <div
      v-else-if="tableDao.searchBar && !checkMobile"
      class="filter-container"
    >
      <el-input
        v-model="listQuery.keywords"
        :placeholder="$t('table.title')"
        style="width: 200px;margin-right: 8px;"
        clearable
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <slot name="buttonBar" />
      <el-date-picker
        v-if="tableDao.dateRange === true"
        v-model="dateRange"
        type="datetimerange"
        style="margin-right: 8px;margin-bottom: 10px;"
        :picker-options="pickerOptions"
        value-format="yyyy-MM-dd HH:mm:ss"
        format="yyyy-MM-dd HH:mm:ss"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
        @change="setDateRange"
      />
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        {{ $t('table.search') }}
      </el-button>
      <el-button
        v-if="tableDao.addButton !== false"
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        {{ $t('table.add') }}
      </el-button>
      <el-button
        v-if="tableDao.exportButton === true"
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-download"
        @click="tableDao.exportList(pagination, listQuery)"
      >
        {{ $t('table.export') }}
      </el-button>
      <el-button
        v-if="tableDao.importButton === true"
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-upload2"
        @click="startImport"
      >
        导入
      </el-button>
      <slot name="buttonBarRight" />
    </div>

    <slot
      v-if="!checkMobile"
      name="otherBar"
    />
    <slot
      v-if="tableDao.tableDefine === true"
      :data="list"
      name="tableDefine"
    />
    <div v-else-if="checkMobile">
      <mu-paper :z-depth="1">
        <mu-container
          ref="container"
        >
          <mu-load-more
            :refreshing="refreshing"
            :loading="loading"
            @refresh="refresh"
            @load="load"
          >
            <mu-list>
              <template v-for="(item,listIndex) in list">
                <el-card
                  :key="'elcard'+listIndex"
                  shadow="hover"
                  :body-style="{padding: '0px'}"
                  style="margin-bottom: 15px;"
                >
                  <div
                    slot="header"
                    style="display: flex;align-items: center;justify-content: space-between;"
                  >
                    <mu-button
                      flat
                      color="primary"
                    >
                      详情信息
                    </mu-button>
                    <mu-menu
                      v-if="tableDao.actionBar"
                      :open.sync="item && item.mobileMenuOpen"
                      placement="bottom-end"
                      style="float: right; padding: 3px 0"
                      type="text"
                    >
                      <el-button
                        size="mini"
                        color="primary"
                      >
                        操作
                      </el-button>
                      <mu-list slot="content">
                        <mu-list-item
                          v-if="tableDao.addButton !== false"
                          button
                          @click="handleCreate(item)"
                        >
                          <mu-list-item-title>{{ $t('table.add') }}</mu-list-item-title>
                        </mu-list-item>
                        <mu-list-item
                          v-if="tableDao.parent===true"
                          button
                          @click="subFilter(item)"
                        >
                          <mu-list-item-title>{{ tableDao.subItem }}</mu-list-item-title>
                        </mu-list-item>
                        <mu-list-item
                          v-if="tableDao.editButton !== false"
                          button
                          @click="handleUpdate(item)"
                        >
                          <mu-list-item-title>{{ $t('table.edit') }}</mu-list-item-title>
                        </mu-list-item>
                        <mu-list-item
                          v-if="tableDao.deleteButton !== false"
                          button
                          @click="deleteItem(item)"
                        >
                          <mu-list-item-title>{{ $t('table.delete') }}</mu-list-item-title>
                        </mu-list-item>
                      </mu-list>
                    </mu-menu>
                  </div>
                  <template
                    v-for="(row,index1) in tableDao.tableColumn.filter(k => {
                      return !k.hide===true && k.value !== 'id'
                    })"
                  >
                    <mu-divider
                      v-if="index1!==0"
                      :key="'divider'+index1"
                      :shallow-inset="true"
                    />
                    <mu-list-item
                      :key="index1"
                      button
                      :ripple="false"
                    >
                      <mu-list-item-title>{{ row.name }}</mu-list-item-title>
                      <mu-list-item-action class="ps-item-action">
                        <slot
                          v-if="row.columnDefine === true"
                          :data="item"
                          :name="row.value"
                        />
                        <span v-else-if="row.type === 'select'">{{ tableDao.getDictEnumValueBySelf(row.enumName, 'value', item[row.value], 'title') }}</span>
                        <viewer
                          v-else-if="row.type === 'img'"
                          :images="[tableDao.getPointValue(item, row.value, 'img')]"
                        >
                          <img
                            style="height: 32px;"
                            :src="tableDao.getPointValue(item, row.value, 'img')"
                            @error.once="moveErrorImg($event)"
                          >
                        </viewer>
                        <span v-else-if="row.type === 'area'">
                          {{ tableDao.getDictName(item.area, 'area') }}
                        </span>
                        <slot
                          v-else-if="row.type === 'column'"
                          :data="item"
                          :name="row.value"
                        />
                        <span v-else-if="row.columnDict">{{ tableDao.getPointValue(item, row.columnDict) }}</span>
                        <span v-else>{{ tableDao.getPointValue(item, row.value) }}</span>
                      </mu-list-item-action>
                    </mu-list-item>
                  </template>
                </el-card>
              </template>
            </mu-list>
          </mu-load-more>
        </mu-container>
      </mu-paper>
    </div>
    <el-table
      v-else
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      :height="tableHeight"
      :row-class-name="tableRowClassName"
      border
      fit
      highlight-current-row
      style="width: 100%;display: flex;flex-direction: column"
    >
      <el-table-column
        v-if="tableDao.index !== false"
        :label="$t('table.id')"
        prop="id"
        :index="indexMethod"
        :fixed="tableDao.indexFixed?dao.indexFixed:false"
        type="index"
        sortable="custom"
        align="center"
        width="100px"
        min-width="80px"
      />
      <el-table-column
        v-for="(item,index) in tableDao.tableColumn.filter(k => {
          return !k.hide===true
        })"
        :key="index"
        :label="item.name"
        :fixed="item.columnFixed?item.columnFixed:false"
        style="background-color: lightcyan"
        :width="item.width>0?`${item.width}px`:(tableDao.tableColumnWidth? tableDao.tableColumnWidth:'')"
        align="center"
      >
        <template
          slot-scope="scope"
          :style="{'background-color': scope.row[item.value]?'unset':'lightblue'}"
        >
          <div>
            <slot
              v-if="item.columnDefine === true"
              :data="scope.row"
              :name="item.value"
            />
            <span v-else-if="item.type === 'select'">{{ tableDao.getDictEnumValueBySelf(item.enumName, 'value', scope.row[item.value], 'title') }}</span>
            <viewer
              v-else-if="item.type === 'img' && ( typeof tableDao.getPointValue(scope.row, item.value, 'img') === 'string')"
              :images="[tableDao.getPointValue(scope.row, item.value)]"
            >
              <img
                style="height: 64px;"
                :src="tableDao.getPointValue(scope.row, item.value, 'img')"
                @error.once="moveErrorImg($event)"
              >
            </viewer>
            <viewer
              v-else-if="item.type === 'img' && ( typeof tableDao.getPointValue(scope.row, item.value, item.type) === 'object')"
              :images="tableDao.getPointValue(scope.row, item.value)"
            >
              <img
                v-for="(url, indexurl) in tableDao.getPointValue(scope.row, item.value, 'img')"
                :key="indexurl"
                style="height: 64px;"
                :src="$tools.getImgUrl(url)"
                @error.once="moveErrorImg($event)"
              >
            </viewer>
            <slot
              v-else-if="item.type === 'column'"
              :data="scope.row"
              :name="item.value"
            />
            <span v-else-if="item.columnDict">{{ tableDao.getPointValue(scope.row, item.columnDict) }}</span>
            <span v-else>{{ tableDao.getPointValue(scope.row, item.value) }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        v-if="tableDao.actionBar"
        :label="$t('table.actions')"
        align="center"
        :fixed="tableDao.actionFixed?tableDao.actionFixed:false"
        :width="tableDao.actionWidth"
        class-name="fixed-width"
      >
        <template slot-scope="{row}">
          <div style="display: flex;justify-content: space-around;">
            <slot
              name="action"
              :actionData="row"
            />
            <el-button
              v-if="tableDao.parent===true"
              type="warning"
              size="small"
              @click="subFilter(row)"
            >
              {{ tableDao.subItem }}
            </el-button>
            <el-button
              v-if="tableDao.editButton !== false"
              type="primary"
              size="small"
              @click="handleUpdate(row)"
            >
              {{ $t('table.edit') }}
            </el-button>
            <el-button
              v-if="tableDao.deleteButton !== false"
              size="small"
              type="danger"
              @click="deleteItem(row)"
            >
              {{ $t('table.delete') }}
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-if="!checkMobile"
      v-show="pagination.count>pagination.limit"
      :total="pagination.count"
      :page.sync="pagination.page"
      :limit.sync="pagination.limit"
      @pagination="getList"
    />

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :modal-append-to-body="false"
      :top="tableDao.dialogTop"
      :width="checkMobile?'100%':tableDao.dialogWidth"
    >
      <slot name="form" />
      <ncform
        v-if="tableDao.formSchema"
        v-model.lazy="tableDao.formSchemaData"
        :form-schema="tableDao.formSchema"
        form-name="baseSchema"
      />
      <div
        slot="footer"
        class="dialog-footer"
      >
        <slot name="footer" />
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button
          type="primary"
          @click="submitData()"
        >
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>
    <el-dialog
      v-loading="importLoading"
      :close-on-click-modal="false"
      title="上传信息"
      :visible.sync="dialogUploadVisible"
      width="50%"
      :element-loading-text="importLoadingText"
      element-loading-spinner="el-icon-loading"
    >
      <el-upload
        ref="upload"
        class="upload-demo"
        :action="importUrl"
        :headers="headers"
        :on-success="onSuccess"
        :limit="1"
        :auto-upload="false"
        :on-exceed="handleExceed"
      >
        <el-button
          slot="trigger"
          size="small"
          type="primary"
          class="filter-item"
          style="margin-left: 10px;"
          icon="el-icon-upload2"
        >
          选择文件
        </el-button>
        <el-button
          style="margin-left: 10px;"
          size="small"
          type="success"
          @click="submitUpload"
        >
          上传到服务器
        </el-button>
        <div
          slot="tip"
          class="el-upload__tip"
        >
          只能上传xlsx/xls文件
        </div>
      </el-upload>
      <div style="display: flex;flex-direction: column;">
        <h3 style="margin:25px;">
          {{ importLoadingText }}
        </h3>
        <el-button
          v-if="failfileuuid"
          type="primary"
          @click="downFailfile"
        >
          点我下载导入失败的数据列表文件
        </el-button>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogUploadVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { cloneDeep } from 'lodash'
import { exportJson2Excel } from '@/utils/excel'
import Pagination from './components/pagination.vue'
import BaseDao from './utils/base_dao'
import { ApiResponse, PaginationType } from './utils/types'
import { SettingsModule } from '@/store/modules/settings'
import { isMobile } from '@/utils'
import { getToken } from '@/utils/auth'

@Component({
  name: 'CommonTable',
  components: {
    Pagination
  }
})
export default class extends Vue {
  @Prop({ default: () => { return {} } }) formSlotData!: Object
  @Prop({ default: 650 }) tableHeight!: number
  @Prop({ default: false }) autoRefresh!: boolean
  @Prop({ default: () => { return null } }) formSlotDataValidate!: Array<{name:any, required:Boolean, message:any}>
  @Prop({ default: new BaseDao(), required: true }) dao!: BaseDao
  @Prop({ default: null }) propQuery!:any
  private tableDao:BaseDao = this.dao
  private parentInfo:any = null
  private formSchemaId:Number = 1
  private tableKey = 0
  private list: Object[] = []
  private listLoading = true
  private dateRange:string[] = []
  private listQuery:any = {
    keywords: '',
    parent: ''
  }
  private pagination:PaginationType = {
    page: 1,
    start: 0,
    limit: 10
  }
  private dialogFormVisible = false
  public refreshInterval:any = null
  private dialogStatus = ''
  private textMap = {
    update: '编辑',
    create: '添加'
  }
  private downloadLoading = false
  // mobile
  private refreshing:boolean = false
  private loading:boolean = false
  $tools: any
  public setAutoRefresh() {
    if (this.autoRefresh) {
      this.refreshInterval = setInterval(() => {
        this.handleFilter()
      }, 2000)
    }
  }

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

  created() {
    if (this.tableDao.dateRange) {
      this.listQuery.daterange = {
        start_date: '',
        end_date: ''
      }
    }
    if (this.propQuery) {
      this.listQuery = this.propQuery
    }
    this.getList(this.pagination)
    this.tableDao.formSchema = this.tableDao.getFormSchema()
    console.log('schema')
    this.setAutoRefresh()
    this.importUrl = '/api/v1' + this.tableDao.url + '/import'
  }

  private refresh() {
    this.refreshing = true
    this.pagination.start = 0
    this.getList(this.pagination)
  }
  private load() {
    this.loading = true
    this.pagination.start = this.list.length
    this.getList(this.pagination)
  }
  private setDateRange(e:any) {
    this.listQuery.daterange.start_date = (e && e[0]) || ''
    this.listQuery.daterange.end_date = (e && e[1]) || ''
  }

  private indexMethod(index:number) {
    // @ts-ignore
    return index + (this.pagination.page * this.pagination.limit) - this.pagination.limit + 1
  }
  private destroyed() {
    console.log('destroyed')
    clearInterval(this.refreshInterval)
  }

  private async getList(e:PaginationType) {
    this.pagination.start = e.start
    this.pagination.limit = e.limit
    if (!this.checkMobile) {
    // @ts-ignore
      this.pagination.start = (e.page - 1) * e.limit
    }
    this.pagination.limit = e.limit
    this.listLoading = true
    if (this.propQuery) {
      this.listQuery = this.tableDao.deepAssign(this.propQuery, this.listQuery)
    }

    this.tableDao.fetchList(this.pagination, this.listQuery).then((res:any) => {
      if (this.checkMobile && this.pagination.start !== 0) {
        this.list = [...this.list, ...res.data]
      } else {
        this.list = res.data
      }
      this.parentInfo = res.extra_data
      this.$emit('listData', res)
      this.pagination.count = res.count
      this.pagination.start = res.start
      // this.pagination.limit = res.limit
      this.listLoading = false
      this.loading = false
      this.refreshing = false
    }).finally(() => {
      this.listLoading = false
    })
  }

  private tableRowClassName({ row, rowIndex }:any) {
    if (this.tableDao.highLight && row[this.tableDao.highLight]) {
      return 'warning-row'
    }
    return ''
  }
  get checkMobile():boolean {
    return isMobile()
    // return /micromessenger|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }
  private subFilter(row:any) {
    if (row) { row.mobileMenuOpen = false }
    this.listQuery.parent = row.id
    this.pagination = {
      page: 1,
      start: 0,
      limit: 10
    }
    this.getList(this.pagination)
  }

  private handleFilter() {
    console.log('handleFilter')
    this.$emit('handleFilter')
    this.getList(this.pagination)
  }
  private moveErrorImg(event:any) {
    event.currentTarget.src = this.$tools.getImgUrl('/logo.png')
  }

  private deleteItem(row: any) {
    if (row) { row.mobileMenuOpen = false }
    this.$confirm('此操作将永久删除, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      customClass: this.tableDao.checkMobile ? 'mobile-dialog' : '',
      center: this.tableDao.checkMobile,
      type: 'warning'
    }).then(() => {
      this.tableDao.deleteObject(row.id).then(response => {
        this.getList(this.pagination)
        this.$message({
          type: 'success',
          message: '删除成功!'
        })
      })
    }).catch(() => {
      this.$message({
        type: 'info',
        message: '已取消删除'
      })
    })
  }
  @Watch('tableDao.formSchemaData', { immediate: true, deep: true })
  onFormSchemaChange(val: any, oldVal: any) {
    if (val && val !== oldVal) {
      this.$emit('onFormSchemaChange', { val: val, oldVal: oldVal })
    }
  }
  @Watch('propQuery', { immediate: true, deep: true })
  onPropsQueryChange(val: any, oldVal: any) {
    if (val && val !== oldVal) {
      this.listQuery = val
    }
  }
  private resetTempArticleData() {
    this.tableDao.formSchemaData = cloneDeep(this.tableDao.defaultTableData)
  }

  private handleCreate(item?:any) {
    if (item) { item.mobileMenuOpen = false }
    this.resetTempArticleData()
    if (this.parentInfo) {
      this.tableDao.formSchemaData.parent = this.parentInfo
    } else if (item) {
      this.tableDao.formSchemaData.parent = item
    }
    this.dialogStatus = 'create'
    this.dialogFormVisible = true
  }

  private submitData() {
    this.$ncformValidate('baseSchema').then((baseData: { result: any; }) => {
      if (baseData.result) {
        if (this.formSlotData) {
          this.tableDao.formSchemaData = Object.assign(this.formSlotData, this.tableDao.formSchemaData)
        }
        let r = false
        if (this.formSlotDataValidate) {
          this.formSlotDataValidate.forEach((k, i) => {
            if (k.required && !this.tableDao.formSchemaData[k.name]) {
              this.$message.error(k.message)
              r = true
            }
          })
        }
        if (r) return
        Object.keys(this.tableDao.formSchemaData).forEach((k:any) => {
          if (this.tableDao.formSchemaData[k] === '') {
            delete this.tableDao.formSchemaData[k]
          }
        })
        if (this.dialogStatus === 'update') {
          this.tableDao.updateObject(this.formSchemaId, this.tableDao.formSchemaData).then(() => {
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
            this.dialogFormVisible = false
            this.getList(this.pagination)
          })
        } else {
          this.tableDao.createObject(this.tableDao.formSchemaData).then(() => {
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
            this.dialogFormVisible = false
            this.getList(this.pagination)
          })
        }
      } else {
        this.$message.warning('请检查表单')
      }
    })
  }

  private handleUpdate(row: any) {
    if (row) { row.mobileMenuOpen = false }
    this.tableDao.fetchObject(row.id).then((res) => {
      this.tableDao.formSchemaData = res.data
      this.formSchemaId = row.id
      this.$emit('formSchemaData', this.tableDao.formSchemaData)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
    })
  }

  private handleDownload() {
    this.downloadLoading = true
    const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
    const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
    const data = this.tableDao.formatJson(filterVal, this.list)
    exportJson2Excel(tHeader, data, 'table-list')
    this.downloadLoading = false
  }
  // 导入组件
  private dialogUploadVisible:boolean = false
  private importLoading:boolean = false
  private importLoadingText:string = ''
  private uploadInterval:any = null
  private failfileuuid:string = ''
  private importUrl:string = ''
  public $refs!:any
  public $ncformValidate!:any
  private headers = {
    'JWT': getToken()
  }
  public downFailfile() {
    console.log(2222)
  }
  public startImport() {
    this.dialogUploadVisible = true
    this.importLoadingText = ''
    this.$refs.upload && this.$refs.upload.clearFiles()
  }
  public onSuccess(response:any, file:any, fileList:any) {
    if (response.code < 400) {
      this.importLoading = false
      this.handleFilter()
      this.$message.success('上传成功')
      this.importLoadingText = '上传成功'
      this.dialogUploadVisible = false
    } else {
      this.importLoading = false
      this.$message.warning('上传失败:' + response.message)
      this.importLoadingText = response.message
    }
  }
  handleExceed(files:any, fileList:any) {
    this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
  }
  submitUpload() {
    this.importLoading = true
    this.failfileuuid = ''
    this.importLoadingText = ''
    this.$refs.upload.submit()
  }
}
</script>
<style>
  .mobile-dialog{
  width: 100%;
  }
</style>
<style lang="scss" scoped>
  .dialog-footer{
    display: flex;
    justify-content: flex-end;
  }
  .ps-item-action{
    min-width: 150px;
    span{
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>
