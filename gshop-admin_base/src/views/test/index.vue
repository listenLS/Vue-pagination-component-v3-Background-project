<template>
  <div>
    <h2>递归组件</h2>
    <br>
    <hr>
    <br>

    <Item
      v-for="item in list"
      :key="item.id"
      :item="item"
    ></Item>

  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Item from './Item.vue'

// 递归组件的数据来源,一般是嵌套的
const list = ref([
  {
    id: 1010,
    content: '财务部',
    children: [
      {
        id: 101010,
        content: '财务总监',
        children: [
          {
            id: 10101001,
            content: '方圆'
          },
          {
            id: 10101002,
            content: '李涛'
          }
        ]
      },
      {
        id: 101020,
        content: '会计',
        children: [
          {
            id: 10102001,
            content: '张慧'
          },
          {
            id: 10102002,
            content: '永康'
          }
        ]
      }
    ]
  },
  {
    id: 1020,
    content: '法务部'
  },
  {
    id: 1030,
    content: '安保部'
  },
  {
    id: 1040,
    content: '其他部'
  },
])

</script>

<style scoped>

</style>