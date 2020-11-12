import Vue, { DirectiveOptions } from 'vue'

import 'normalize.css'
import ElementUI from 'element-ui'
import SvgIcon from 'vue-svgicon'

import '@/styles/element-variables.scss'
import '@/styles/index.scss'

import App from '@/App.vue'
import store from '@/store'
import { AppModule } from '@/store/modules/app'
import router from '@/router'
import i18n from '@/lang'
import '@/icons/components'
import '@/permission'
import '@/utils/error-log'
import '@/pwa/register-service-worker'
import * as directives from '@/directives'
import * as filters from '@/filters'

import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
// @ts-ignore
import vueNcform from '@ncform/ncform'
import 'element-ui/lib/theme-chalk/index.css'
// @ts-ignore
import ncformStdComps from '@ncform/ncform-theme-elementui'
import wdUpload from '@/components/CommonTable/components/upload.vue'
import areaCascader from '@/components/CommonTable/components/area_cascader.vue'
import remoteSelect from '@/components/CommonTable/components/remote_select.vue'
import remoteSascader from '@/components/CommonTable/components/remote_cascader.vue'
import daterangePicker from '@/components/CommonTable/components/daterange-picker.vue'
import inputTinymce from '@/components/CommonTable/components/input-tinymce.vue'
// import MuseUI from 'muse-ui'r
import Viewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

import tools from '@/utils/tools.ts'
Vue.prototype.$tools = tools

Vue.use(Viewer)
Vue.use(MuseUI)
Vue.use(vueNcform, {
  extComponents: Object.assign(ncformStdComps,
    {
      wdUpload,
      areaCascader,
      remoteSelect,
      daterangePicker,
      remoteSascader,
      inputTinymce
    })
})
Vue.use(ElementUI, {
  size: AppModule.size, // Set element-ui default size
  i18n: (key: string, value: string) => i18n.t(key, value)
})

Vue.use(SvgIcon, {
  tagName: 'svg-icon',
  defaultWidth: '1em',
  defaultHeight: '1em'
})

// Register global directives
Object.keys(directives).forEach(key => {
  Vue.directive(key, (directives as { [key: string ]: DirectiveOptions })[key])
})

// Register global filter functions
Object.keys(filters).forEach(key => {
  Vue.filter(key, (filters as { [key: string ]: Function })[key])
})

Vue.config.productionTip = false

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App)
}).$mount('#app')
