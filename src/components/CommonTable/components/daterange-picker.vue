<template>
  <el-date-picker
    v-if="type && typeOptions[type]"
    v-show="!hidden"
    v-model="modelVal"
    class="ncform-date-picker"
    style="width: 100%"
    :placeholder="placeholder || $nclang(typeOptions[type].placeholder)"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    :disabled="disabled"
    :readonly="readonly"
    :size="mergeConfig.size"
    :clearable="mergeConfig.clearable"
    type="datetimerange"
    :format="mergeConfig.format || $nclang(typeOptions[type].format)"
    :value-format="mergeConfig.valueFormat"
    @change="setDateRange"
  />
</template>

<style lang="scss">
  .h-layout {
    .ncform-date-picker {
      &.__ncform-control {
        clear: none;
      }
    }
  }

  .v-layout {
    .ncform-date-picker {
      &.__ncform-control {
        clear: both;
      }
    }
  }

  .ncform-date-picker {
    &.el-date-editor.el-input {
      width: 100%;
    }
  }
</style>

<script>
import ncformCommon from '@ncform/ncform-common'

const controlMixin = ncformCommon.mixins.vue.controlMixin

export default {
  mixins: [controlMixin],

  i18nData: {
    en: {
      chYear: 'Choose Year',
      chMonth: 'Choose Month',
      chDate: 'Choose Date',
      chWeek: 'Choose Week',
      chTime: 'Choose Datetime',
      weekFormat: 'Week WW of yyyy'
    },
    zh_cn: {
      chYear: '选择年份',
      chMonth: '选择月份',
      chDate: '选择日期',
      chWeek: '选择周',
      chTime: '选择时间',
      weekFormat: 'yyyy年 第WW周'
    }
  },

  props: {
    value: {
      type: String,
      default: ''
    }
  },

  data() {
    return {
      typeOptions: {
        year: {
          format: '',
          placeholder: 'chYear'
        },
        month: {
          format: '',
          placeholder: 'chMonth'
        },
        date: {
          format: '',
          placeholder: 'chDate'
        },
        week: {
          format: 'weekFormat',
          placeholder: 'chWeek'
        },
        datetime: {
          format: '',
          placeholder: 'chTime'
        }
      },
      // 组件特有的配置属性
      defaultConfig: {
        clearable: false,
        type: 'date', // year/month/date/week/datetime
        format: 'yyyy-MM-dd HH:mm:ss',
        valueFormat: 'yyyy-MM-dd HH:mm:ss',
        size: ''
      }
      // modelVal：请使用该值来绑定实际的组件的model
    }
  },

  computed: {
    // disabled / readonly / hidden / placeholder 你可以直接使用这些变量来控制组件的行为
    type() {
      if (!this.$data.typeOptions[this.mergeConfig.type]) {
        return 'date'
      } else {
        return this.mergeConfig.type
      }
    }
  },

  mounted() {
    if (this.$data.modelVal) {
      this.$data.modelVal = this.mergeConfig.valueFormat ? this.$data.modelVal : new Date(parseInt(this.$data.modelVal))
    }
  },

  methods: {
    // 你可以通过该方法在modelVal传出去之前进行加工处理，即在this.$emit('input')之前
    _processModelVal(newVal) {
      console.log(newVal, 8888)
      let r = {
        start_date: (newVal && newVal[0]) || '',
        end_date: (newVal && newVal[1]) || ''
      }
      return `${newVal ? (JSON.stringify(r)) : ''}`
    },
    setDateRange(e) {
      let r = {
        start_date: (e && e[0]) || '',
        end_date: (e && e[1]) || ''
      }
    }
  }
}
</script>
