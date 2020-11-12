<template>
  <div class="UploadImage upload-container">
    <el-upload
      :show-file-list="false"
      :on-success="UploadSuccess"
      :before-upload="beforeUpload"
      :action="url"
      :disabled="disabled"
      :headers="headers"
    >
      <img
        v-if="tempImg"
        :src="$tools.getImgUrl(tempImg)"
        class="avatar"
      >
      <i
        v-else
        class="el-icon-plus avatar-uploader-icon"
      />
    </el-upload>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { getToken } from '@/utils/auth'
import { computed } from 'mobx'
const BASE_URL = process.env.VUE_APP_BASE_API

@Component({
  name: 'SingleImageUpload',
  components: {
  }
})
export default class extends Vue {
  @Prop({ default: '' }) private value!: String
  @Prop({ default: 0 }) private id!: Number
  @Prop({ default: false }) private disabled!: Boolean

  private tempImg:String = ''
  private url:String = BASE_URL + '/tools/upload'
  private headers:any = {}

  @computed get getValue() {
    return this.value
  }

  @Watch('value')
  private onTempImg(url:String) {
    this.tempImg = url
  }

  UploadSuccess(res:any, file:any) {
    // console.log(res, this.id)
    this.tempImg = res.data.url
    this.emitInput(this.tempImg)
    if (res.code === 200 && this.id) {
      res.data.id = this.id
      this.$emit('upload-success', res.data)
    }
  }
  rmImage() {
    this.emitInput('')
  }
  emitInput(val:String) {
    this.$emit('input', val)
  }
  beforeUpload() {
    this.headers['JWT'] = getToken()
    return true
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    overflow: hidden;
    position: relative;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 48px;
    height: 48px;
    line-height: 48px;
    text-align: center;
    border: 1px dashed #d9d9d9;
  }
  .avatar {
    width: 60px;
    height: 60px;
    display: block;
  }
  .upload-container{
    width: 48px;
    height: 48px;
    display: block;
  }
  .cell{
    display: flex;
    justify-content: center;
  }
</style>
