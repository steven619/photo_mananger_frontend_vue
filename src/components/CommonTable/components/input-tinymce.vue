<template>
  <Tinymce
    v-show="!hidden"
    v-model="inputVal"
    style="width:100%"
    :disabled="disabled"
    :readonly="readonly"
    :placeholder="placeholder"
    type="textarea"
    :rows="mergeConfig.rows"
    :autosize="mergeConfig.autoSize"
    :height="mergeConfig.height || 700"
    @blur="onBlur"
  />
</template>

<style lang="scss" scoped>
</style>

<script>

import ncformCommon from '@ncform/ncform-common'
import Tinymce from '@/components/Tinymce/index.vue'
const controlMixin = ncformCommon.mixins.vue.controlMixin

export default {
  components: {
    Tinymce
  },
  mixins: [controlMixin],

  props: {
    value: {
      type: String,
      default: '',
      updateOn: 'change' // change or blur
    }
  },

  data() {
    return {
      inputVal: '',
      // 组件特有的配置属性
      defaultConfig: {
        rows: 2,
        autoSize: false
      }
      // modelVal：请使用该值来绑定实际的组件的model
    }
  },

  computed: {
    // disabled / readonly / hidden / placeholder 你可以直接使用这些变量来控制组件的行为
  },

  watch: {
    inputVal(newVal, oldVal) {
      if ((!newVal && !oldVal) || this.mergeConfig.updateOn === 'blur') return
      this.$data.modelVal = newVal
    }
  },

  created() {
    this.$data.inputVal = this.$data.modelVal
  },

  methods: {
    onBlur() {
      if (this.mergeConfig.updateOn === 'blur') {
        this.$data.modelVal = this.$data.inputVal
      }
    }
  }

}
</script>
