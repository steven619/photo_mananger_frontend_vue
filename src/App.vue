<template>
  <div id="app">
    <router-view />
    <service-worker-update-popup />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ServiceWorkerUpdatePopup from '@/pwa/components/ServiceWorkerUpdatePopup.vue'

@Component({
  name: 'App',
  components: {
    ServiceWorkerUpdatePopup
  }
})

export default class extends Vue {
  mounted() {
    console.log('app start')
    // if (window.location.pathname !== '/custom/') {
    //   window.location.href = 'https://www.woody.vip/custom/'
    // }
  }
}
</script>
<style>

  html, body, #app, .wx-pages {
    padding: 0;
    margin: 0;
    height: 100%;
    overflow: hidden;
    -webkit-overflow-scrolling: touch;
  }
  @font-face {
    font-family: 'Material Icons';
    font-style: normal;
    font-weight: 400;
    src: url(./assets/material-design-icons/iconfont/MaterialIcons-Regular.eot); /* For IE6-8 */
    src: local('Material Icons'),
    local('MaterialIcons-Regular'),
    url(./assets/material-design-icons/iconfont/MaterialIcons-Regular.woff2) format('woff2'),
    url(./assets/material-design-icons/iconfont/MaterialIcons-Regular.woff) format('woff'),
    url(./assets/material-design-icons/iconfont/MaterialIcons-Regular.ttf) format('truetype');
  }

  .material-icons {
    font-family: 'Material Icons';
    font-weight: normal;
    font-style: normal;
    font-size: 24px;  /* Preferred icon size */
    display: inline-block;
    line-height: 1;
    text-transform: none;
    letter-spacing: normal;
    word-wrap: normal;
    white-space: nowrap;
    direction: ltr;

    /* Support for all WebKit browsers. */
    -webkit-font-smoothing: antialiased;
    /* Support for Safari and Chrome. */
    text-rendering: optimizeLegibility;

    /* Support for Firefox. */
    -moz-osx-font-smoothing: grayscale;

    /* Support for IE. */
    font-feature-settings: 'liga';
  }
  .mobile-dialog{
    width: 100%;
  }
</style>
