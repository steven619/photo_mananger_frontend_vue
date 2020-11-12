<template>
  <span>
    {{ area }}
  </span>
</template>
<script>
import { getDict } from '@/utils/tools'
export default {
  props: {
    value: {
      type: Number,
      default: null
    },
    type: {
      type: String,
      default: 'area'
    }
  },
  data() {
    return {
      p_list: [],
      province: '',
      city: '',
      district: '',
      area: ''
    }
  },
  watch: {
    value(val) {
      this.setArea(val)
    }
  },
  created() {
    if (this.type === 'area') {
      this.p_list = getDict()['area']
      this.setArea(this.value)
    } else if (this.type === 'department') {
      this.setDepartment(this.value)
    }
  },
  destroyed() {
    this.dictionary = []
    this.name = null
  },
  methods: {
    setArea: function(id) {
      if (!id) return
      this.area = this.$tool.getDictName(id, 'area')
    },
    setDepartment(value) {
      this.department_dao.fetchList(this.pagination, this.query).then(response => {
        this.options = response.data
        this.selectedOptions = this.getAreaName(value, this.options)
      })
    }
  }
}
</script>
