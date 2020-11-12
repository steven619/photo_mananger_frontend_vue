<template>
  <div class="UploadImage upload-container">
    <el-upload
      :on-success="UploadSuccess"
      :before-upload="beforeUpload"
      :action="url"
      :headers="headers"
      class="upload-demo"
      drag
    >
      <i class="el-icon-upload" />
      <div class="el-upload__text">
        将文件拖到此处，或<em>点击上传</em>
      </div>
    </el-upload>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
const BASE_URL = process.env.BASE_API

export default {
  name: 'SingleImageUpload',
  props: {
    value: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      tempImg: '',
      url: BASE_URL + '/tools/upload/',
      headers: {}
    }
  },
  computed: {
    imageUrl() {
      return this.value
    }
  },
  watch: {
    value(url) {
      this.tempImg = url
    }
  },
  destroyed() {
    this.tempImg = null
  },
  methods: {
    UploadSuccess(res, file) {
      this.tempImg = res.data.url
      this.emitInput(this.tempImg)
    },
    rmImage() {
      this.emitInput('')
    },
    emitInput(val) {
      this.$emit('input', val)
    },
    beforeUpload() {
      this.headers['JWT'] = getToken()
      console.log(this.headers)
      return true
    }
  }
}
</script>
