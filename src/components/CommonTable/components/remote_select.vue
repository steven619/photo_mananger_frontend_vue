<template>
  <el-select
    v-show="!hidden"
    v-model="modelVal"
    :placeholder="placeholder || $nclang('selectPls')"
    :disabled="disabled || readonly"
    :clearable="mergeConfig.clearable"
    :allow-create="mergeConfig.allowCreate"
    :default-first-option="mergeConfig.defaultFirstOption"
    :multiple="mergeConfig.multiple"
    :filterable="mergeConfig.filterable"
    :remote="!isLocalSource && !mergeConfig.filterLocal"
    :remote-method="(!isLocalSource && !mergeConfig.filterLocal) ? remoteMethod : null"
    :loading="loading"
    @focus="_getDataSource"
    @change="handleChange"
  >
    <el-option
      v-for="item in optionsData"
      :key="item[mergeConfig.itemValueField]"
      :label="(mergeConfig.itemPrefixLabelField?`[${getPointValueSelf(item, mergeConfig.itemPrefixLabelField)}]`:'') + (item[mergeConfig.itemLabelField]?item[mergeConfig.itemLabelField]:'')"
      :value="item[mergeConfig.itemValueField]"
    >
      <component
        :is="itemTemplate"
        v-if="itemTemplate.template"
        :item="item"
      />
    </el-option>
  </el-select>
</template>

<style lang="scss" scoped>
</style>

<script>
import _get from 'lodash-es/get'
import _cloneDeep from 'lodash-es/cloneDeep'
import ncformCommon from '@ncform/ncform-common'
import { getToken } from '../../../utils/auth'
import { getPointValue } from '@/components/CommonTable/utils'

const controlMixin = ncformCommon.mixins.vue.controlMixin
const ncformUtils = ncformCommon.ncformUtils

export default {
  mixins: [controlMixin],

  i18nData: {
    en: {
      selectPls: 'Select Please'
    },
    zh_cn: {
      selectPls: '请选择'
    }
  },

  props: {
    value: {
      type: [String, Number, Boolean, Object, Array],
      default: ''
    }
  },

  data() {
    return {
      // modelVal：请使用该值来绑定实际的组件的model

      // 组件特有的配置属性
      defaultConfig: {
        getPointValue: null,
        multiple: false, // 是否多选
        clearable: true, // 是否出现清空选项
        filterable: false, // 是否可搜索，即可输入关键字
        filterLocal: true, // 搜索本地的还是远程的数据，当为true时，就算配了enumSourceRemote，也只会从远程取一次数据
        itemTemplate: '', // 显示项的模板
        allowCreate: false,
        defaultFirstOption: true,

        itemDataKey: '', // 选中项的数据字段，可通过 {{$temp.[key]}} 取得

        itemLabelField: 'label', // 项数据表示label的字段
        itemValueField: 'value', // 项数据表示value的字段
        enumSource: [], // 本地数据源
        enumSourceRemote: {
          // 远程数据源
          remoteUrl: '', // 如果是远程访问，则填写该url
          paramName: 'keyword', // 请求参数名，默认是keyword
          otherParams: {}, // 其它请求的参数，支持字符串表达式
          resField: '', // 响应结果的字段
          selectFirstItem: false // 默认选中第一项
        }
      },

      isLocalSource: true,
      options: [],
      itemTemplate: {
        template: '',
        props: ['item']
      },

      loading: false
    }
  },

  computed: {
    // disabled / readonly / hidden / placeholder 你可以直接使用这些变量来控制组件的行为
    optionsData() {
      return (this.$data.isLocalSource && this.mergeConfig.enumSource.length > 0) ? this.mergeConfig.enumSource : this.$data.options
    }
  },

  watch: {
    // 【使config支持字符串表达式】(2) watch在computed声明的属性，当发生变化时，执行相关的动作
    'mergeConfig.enumSourceRemote.otherParams': {
      handler: function(newVal, oldVal) {
        if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
          if (oldVal !== undefined) {
            // 非第一次
            if (Array.isArray(this.modelVal)) {
              this.modelVal = []
            } else {
              this.modelVal = null
            }
          }
          this.remoteMethod()
        }
      }
    }
  },
  created() {
    if (typeof this.value === 'boolean') {
      this.$data.valueType = 'boolean'
      this.$data.modelVal = this.$data.modelVal ? 1 : 0
    } else if (typeof this.value === 'number') {
      this.$data.modelVal = this.value
    } else if (Array.isArray(this.value)) {
      let e = this.value
      let op = []
      e.forEach((k, i) => {
        let p = {}
        p[this.mergeConfig.itemLabelField] = k[this.mergeConfig.itemLabelField]
        p[this.mergeConfig.itemValueField] = k[this.mergeConfig.itemValueField]
        op.push(p)
      })
      this.$data.options = op
      this.$data.modelVal = op.map((e) => { return e[this.mergeConfig.itemValueField] })
    } else if (typeof this.value === 'object' && this.value) {
      this.$data.modelVal = this.value.id
      this.$data.options = [this.value]
    } else {
      this._getDataSource()
    }
    this.$data.itemTemplate.template = this.mergeConfig.itemTemplate
  },

  methods: {
    getPointValueSelf(item, label) {
      let k = getPointValue(item, label)
      return k || '未设置'
    },
    loadMore(e) {
      this.mergeConfig.enumSourceRemote.otherParams.limit = this.$data.options.length + 10
      this.remoteMethod()
    },
    remoteMethod(query) {
      let vTemp = this.value
      if (!_get(this.mergeConfig, 'enumSourceRemote.remoteUrl')) {
        return
      }

      const options = {
        url: this.mergeConfig.enumSourceRemote.remoteUrl,
        params: _cloneDeep(_get(this.mergeConfig, 'enumSourceRemote.otherParams', {})),
        headers: {
          JWT: getToken()
        }
      }
      if (this.mergeConfig.enumSourceRemote.paramName) { options.params[this.mergeConfig.enumSourceRemote.paramName] = query }
      if (this.mergeConfig.enumSourceRemote.limit) {
        options.params['limit'] = this.mergeConfig.enumSourceRemote.limit
      } else {
        options.params['limit'] = 100
      }
      this.$http(options).then(res => {
        this.$data.options = this.mergeConfig.enumSourceRemote.resField
          ? _get(res.data, this.mergeConfig.enumSourceRemote.resField)
          : res.data
        if (
          this.mergeConfig.enumSourceRemote.selectFirstItem &&
            this.$data.options.length > 0
        ) {
          this.$data.modelVal =
              this.$data.modelVal ||
              this.$data.options[0][this.mergeConfig.itemValueField]
        }
        if (typeof this.value === 'string' && this.value && this.$data.options.length > 0) {
          let k = this.$data.options.filter(e => { return this.value === e[this.mergeConfig.itemLabelField] })
          if (k.length > 0) {
            this.$data.modelVal = k[0][this.mergeConfig.itemValueField]
          }
        }

        this._keepSelectedItem()
      }).then(() => {
        if (typeof vTemp === 'number') {
          this.$data.modelVal = vTemp
        }
      })
    },

    handleChange() {
      this._keepSelectedItem()
    },

    _keepSelectedItem() {
      if (this.mergeConfig.itemDataKey) {
        let selectedModelVal = Array.isArray(this.$data.modelVal)
          ? this.optionsData.filter(item => this.$data.modelVal.indexOf(item[this.mergeConfig.itemValueField]) >= 0)
          : this.optionsData.find(item => item[this.mergeConfig.itemValueField] === this.$data.modelVal)
        this._setTempData(this.mergeConfig.itemDataKey, selectedModelVal)
      }
    },

    _getDataSource() {
      if (_get(this.mergeConfig, 'enumSourceRemote.remoteUrl')) {
        this.$data.isLocalSource = false
        this.remoteMethod()
      } else {
        if (this.mergeConfig.enumSource.length === 0) {
          if (ncformUtils.getValType(this.value) === 'boolean') {
            this.$data.options = [
              {
                value: 1,
                label: 'true'
              },
              {
                value: 0,
                label: 'false'
              }
            ]
            this._keepSelectedItem()
          }
          if (ncformUtils.getValType(this.value) === 'object') {
            this.$data.options = [
              {
                value: this.value.id,
                label: this.value.name
              }
            ]
            this._keepSelectedItem()
          }
        } else {
          this.$data.options = this.mergeConfig.enumSource
          this._keepSelectedItem()
        }
      }
    },

    _processModelVal(newVal) {
      if (this.$data.valueType === 'boolean') {
        return !!newVal
      }
      return newVal
    }
  }
}
</script>
