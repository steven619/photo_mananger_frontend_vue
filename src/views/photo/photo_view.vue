<template>
  <div>ffff</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Photo from '@/api/photo/photo.ts'

@Component({
  name: 'PhotoManager',
  components: {
  }
})
export default class extends Vue {
  photo = new Photo()

}
</script>

<style scoped>

</style>
