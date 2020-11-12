<template>
  <el-cascader
    v-model="selectedOptions"
    :options="options"
    :placeholder="placeholder"
    :clearable="clearable"
    :style="'width: ' + width + 'px'"
    :props="{value: 'id',label: 'title'}"
    :disabled="disabled"
    change-on-select
    @change="onChange"
  />
</template>
<script lang="ts">
import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
// @ts-ignore
import { area } from '@/utils/area.ts'
let win:any = window.localStorage

@Component({
  name: 'DeviceTable',
  components: {
  }
})

export default class extends Vue {
  @Prop({ default: 0 }) private value!: any
  @Prop({ default: 'area' }) private type!: String
  @Prop({ default: false }) private disabled!: Boolean
  @Prop({ default: false }) private clearable!: Boolean
  @Prop({ default: '' }) private placeholder!: String
  @Prop({ default: 100 }) private width!: Number

  private options:any = []
  private selectedOptions:any = []
  private departmentDao:any = {}

  private setArea(value:String) {
    this.options = area
    if (value) {
      this.selectedOptions = this.getAreaName(value, this.options)
    } else {
      this.selectedOptions = []
    }
  }
  private setDepartment(value:String) {
    this.departmentDao.fetchList().then((response:any) => {
      this.options = response.data
      this.selectedOptions = this.getAreaName(value, this.options)
    })
  }
  private getAreaName(id:String, dict:any) {
    for (const i in dict) {
      if (dict[i].id === id) {
        return [dict[i].id]
      }
      if (dict[i].children) {
        const rr:any = this.getAreaName(id, dict[i].children)
        if (rr) { return [dict[i].id].concat(rr) }
      }
    }
  }

  onChange(id:String) {
    this.$emit('input', id[id.length - 1])
  }

  @Watch('value')
  private onValueChange(id:String) {
    if (id) {
      if (this.type === 'area') {
        this.setArea(id)
      } else if (this.type === 'department') {
        this.setDepartment(id)
      }
    } else {
      this.selectedOptions = []
    }
  }

  created() {
    if (this.type === 'area') {
      this.setArea(this.value)
    }
  }
  destroyed() {
    this.selectedOptions = []
  }
}
</script>

<style scoped>
</style>
