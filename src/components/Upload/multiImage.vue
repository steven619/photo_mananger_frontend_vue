<template>
  <div class="UploadImage upload-container">
    <el-upload
      :on-success="UploadSuccess"
      :before-upload="beforeUpload"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :action="url"
      :headers="headers"
      list-type="picture-card"
      class="el-upload-s"
    >
      <i class="el-icon-plus el-upload-s" />
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img
        :src="dialogImageUrl"
        alt=""
      >
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
const BASE_URL = process.env.BASE_API

export default {
  name: 'SingleImageUpload',
  props: {
    value: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      fileList: [],
      url: BASE_URL + '/tools/upload/',
      headers: {},
      dialogImageUrl: '',
      dialogVisible: false
    }
  },
  computed: {
    imageUrl() {
      return this.value
    }
  },
  watch: {
    value(url) {
      this.fileList = url
    }
  },
  destroyed() {
    this.fileList = null
  },
  methods: {
    getImg(fileList) {
      const _l = []
      for (let i = 0; i < fileList.length; i++) {
        _l.push({ image: fileList[i].response.data.url })
      }
      return _l
    },
    UploadSuccess(res, file, fileList) {
      this.imgList = this.getImg(fileList)
      this.emitInput(this.imgList)
    },
    OnRemove(file, fileList) {
      this.imgList = this.getImg(fileList)
      this.emitInput(this.imgList)
    },
    rmImage() {
      this.emitInput('')
    },
    emitInput(val) {
      this.$emit('input', val)
    },
    beforeUpload() {
      this.headers['JWT'] = getToken()
      return true
    },
    handleRemove(file, fileList) {
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    }
  }
}
</script>

<style scoped>
    .upload-container .el-upload {
        width: 148px;
    }
    .el-upload--picture-card {
        width: 148px;
    }
</style>
