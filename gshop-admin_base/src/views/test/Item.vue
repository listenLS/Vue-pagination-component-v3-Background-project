<template>
  <div class="item">
    <span>{{ item.content }}</span>

    <Item
      v-for="child in item.children"
      :key="child.id"
      :item="child"
    ></Item>
  </div>
</template>

<script lang="ts">
export default {
  name: 'Item'
}
</script>

<script setup lang="ts">
defineProps(['item'])
</script>

<style scoped>
.item {
  margin-left: 20px;
}
</style>