<template>
  <el-row style="margin: 25px">
    <el-button @click="searchPhoto">
      搜索
    </el-button>
    <el-row>
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

  mounted() {
    this.searchPhoto()
  }

  dialogImageUrl:string = ''
  dialogVisible:boolean = false

  handleRemove(file, fileList) {
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

  onError(err:any, file:any, fileList:any) {
    console.log('error')
  }

  handlePictureCardPreview(file) {
    this.dialogImageUrl = file.url
    this.dialogVisible = true
  }
}
</script>

<style scoped>

</style>
