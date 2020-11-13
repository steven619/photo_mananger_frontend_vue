<template>
  <el-row style="margin: 25px">
    <el-row>
      <el-button
        style="margin-left: 50%"
        type="success"
        @click="searchPhoto"
      >
        刷新
      </el-button>
    </el-row>
    <el-row style="margin-top: 10px">
      <el-upload
        action="/api/v1/features/photo_up"
        list-type="picture-card"
        :headers="headers"
        :on-success="onSuccess"
        :file-list="fileList"
        :on-error="onError"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
      >
        <i class="el-icon-plus" />
      </el-upload>
    </el-row>

    <el-dialog :visible.sync="dialogVisible">
      <span style="size: B4">照片名称:{{ dialogImageName }}</span>
      <span style="size: B4;margin-left: 15px">照片上传时间:{{ dialogImageDate }}</span>
      <span style="size: B4 ;margin-left: 15px">照片上传IP:{{ dialogImageIp }}</span>
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
  name: 'PhotoManager',
  components: {
  }
})

export default class extends Vue {
  photo = new Photo()
  headers:any = {
    jwt: getToken()
  }
  fileList:any[] = []
  keywords:string = ''

  mounted() {
    this.searchPhoto()
  }

  dialogImageUrl:string = ''
  dialogImageName:string = ''
  dialogVisible:boolean = false

  handleRemove(file:any, fileList:any) {
    console.log('remove', file)
    this.photo.deletePhoto(file.ID).then((res:any) => {
      this.$message.success('删除成功')
    })
  }

  searchPhoto() {
    this.photo.getMyPhoto().then((res:any) => {
      this.fileList = res
    })
  }

  onSuccess(response:any, file:any, fileList:any) {
    console.log(11111, response, file, fileList)
  }

  onError(ERR:any, file:any, fileList:any) {
    console.log('error')
  }

  dialogImageDate:string = ''
  dialogImageIp:string = ''
  handlePictureCardPreview(file:any) {
    this.dialogImageUrl = file.url
    this.dialogImageName = file.name
    this.dialogVisible = true
    this.dialogImageIp = file.ip
    this.dialogImageDate = file.date
  }
}
</script>

<style scoped>

</style>
