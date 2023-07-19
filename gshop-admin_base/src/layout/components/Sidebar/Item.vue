<template #title>
  <svg-icon v-if="icon" :name="icon" />
  <span v-if="title">{{title}}</span>
</template>

<script lang="ts">
  export default {
    name: 'MenuItem'
  }
</script>

<script lang="ts" setup>
defineProps({
  icon: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  }
})
</script>

<style scoped>
.sub-el-icon {
  color: currentColor;
  width: 1em;
  height: 1em;
}
</style>
