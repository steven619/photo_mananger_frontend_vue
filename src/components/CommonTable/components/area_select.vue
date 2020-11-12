<template>
  <el-cascader
    v-model="selectedOptions"
    :options="options"
    :placeholder="placeholder"
    :clearable="clearable"
    :style="'width: ' + width + 'px'"
    :props="{value: 'id',label: 'title',checkStrictly: checkStrictly}"
    :disabled="disabled"
    change-on-select
    @change="onChange"
  />
</template>
<script>

export default {
  props: {
    value: {
      type: [Number, String],
      default: 0
    },
    area: {
      type: Array,
      required: true,
      default: () => {
        return []
      }
    },
    type: {
      type: String,
      default: 'area'
    },
    checkStrictly: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    clearable: {
      type: Boolean,
      default: true
    },
    placeholder: {
      type: String,
      default: '请选择区县'
    },
    width: {
      type: Number,
      default: 100
    }

  },
  data() {
    return {
      options: [],
      selectedOptions: []
    }
  },
  watch: {
    value(id) {
      if (id) {
        if (this.type === 'area') {
          this.setArea(id)
        }
      }
    }
  },

  created() {
    if (this.type === 'area') {
      this.setArea(this.value)
    }
  },

  destroyed() {
    this.selectedOptions = []
  },

  methods: {
    setArea(value) {
      this.options = this.area
      this.selectedOptions = this.getAreaName(value, this.options)
      console.log(4444, value, this.selectedOptions)
    },
    getAreaName(id, dict) {
      for (const i in dict) {
        if (dict[i].id === id) {
          return [dict[i].id]
        }
        if (dict[i].children) {
          const rr = this.getAreaName(id, dict[i].children)
          if (rr) { return [dict[i].id].concat(rr) }
        }
      }
    },
    onChange(id) {
      if (id[id.length - 1] >= 0) {
        this.$emit('input', id[id.length - 1])
      } else {
        this.$emit('input', '')
      }
    }
  }
}
</script>

<style scoped>
</style>
