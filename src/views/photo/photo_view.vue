<template>
  <el-row style="margin: 25px">
    <el-button @click="searchPhoto">
      搜索
    </el-button>
    <el-row>
      <el-row style="display: flex;flex-wrap: wrap;">
        <el-card
          v-for="(item,index) in fileList"
          :key="index"
          style="width: 300px;margin: 8px"
          class="box-card"
        >
          <div
            slot="header"
            class="clearfix"
          >
            <span>{{ item.name }}</span>
            <el-button
              style="float: right; padding: 3px 0"
              type="primary"
              @click="getComment"
            >
              查看评价
            </el-button>
            <el-dialog title="评论详情" :visible.sync="outerVisible">
              <el-table :data="gridData">
                <el-table-column property="username" label="用户名" width="80"></el-table-column>
                <el-table-column property="date" label="时间" width="100"></el-table-column>
                <el-table-column property="ip" label="ip地址"></el-table-column>
                <el-table-column property="txt" label="评论内容"></el-table-column>
              </el-table>
              <el-dialog
                width="30%"
                title="评论详情"
                :visible.sync="innerVisible"
                append-to-body>
                <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="请输入评论内容内容"
                  v-model="txt">
                </el-input>
                <el-button @click="innerVisible = false">取 消</el-button>
                <el-button type="primary" @click="addComment">添加评论</el-button>
              </el-dialog>
              <div slot="footer" class="dialog-footer">
                <el-button @click="outerVisible = false">取 消</el-button>
                <el-button type="primary" @click="innerVisible = true">添加评论</el-button>
              </div>
            </el-dialog>
            <el-button
              type="danger"
              style="float: right; padding: 3px 0;margin-right: 3px;"
              @click="sharePic"
            >
              分享
            </el-button>
          </div>
          <el-image
            style="width: 280px; max-height: 280px"
            :src="item.url"
            :preview-src-list="fileList.map((e) => {
              return e.url
            })"
          />
        </el-card>
      </el-row>
    </el-row>

    <el-dialog :visible.sync="dialogVisible">
      <img
        width="100%"
        :src="dialogImageUrl"
        alt=""
      >
    </el-dialog>
  </el-row>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Photo from '@/api/photo/photo.ts'
import { getToken } from '@/utils/auth'

@Component({
  name: 'PhotoView',
  components: {
  }
})

export default class extends Vue {
  outerVisible:boolean=false
  innerVisible:boolean=false
  gridData:[] = []
  txt:string=''
  photo = new Photo()
  headers:any = {
    jwt: getToken()
  }
  fileList:any[] = []

  mounted() {
    this.searchPhoto()
  }
  addComment(file:any) {
    this.innerVisible = false
    this.comment.addComment(file.ID).then((res:any) => {
      console.log(666666, res)
    })
  }
  getComment(file:any) {
    this.outerVisible = true
    this.comment.getComment(file.ID).then((res:any) => {
      console.log(4444, res)
      res = this.gridData
    })
  }
  sharePic(file:any) {
    this.photo.getOnePhont(file.ID).then((res:any) => {
      console.log(res)
      this.$prompt('请复制链接,时效一分钟', '提示', {
        confirmButtonText: '复制成功',
        inputValue: res,
        cancelButtonText: '取消'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '去分享吧'
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消复制'
        })
      })
    })
  }

  dialogImageUrl:string = ''
  dialogVisible:boolean = false

  handleRemove(file:any, fileList:any) {
    console.log('remove', file)
    this.photo.deletePhoto(file.ID).then((res:any) => {
      this.$message.success('删除成功')
    })
  }

  searchPhoto() {
    this.photo.getAllPhoto().then((res:any) => {
      console.log(3333, res)
      this.fileList = res
    })
  }

  onSuccess(response:any, file:any, fileList:any) {
    console.log(11111, response, file, fileList)
  }

  onError(ERR:any, file:any, fileList:any) {
    console.log('error')
  }

  handlePictureCardPreview(file:any) {
    this.dialogImageUrl = file.url
    this.dialogVisible = true
  }
}
</script>

<style scoped>

</style>
