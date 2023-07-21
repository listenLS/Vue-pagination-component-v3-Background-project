<template>
  <div class="home">
    Hello, {{userInfoStore.userInfo.name}}
  </div>
</template>

<script lang="ts">
export default {
  name: 'Home',
}
</script>
<script lang="ts" setup>
import { useUserInfoStore } from '@/stores/userInfo';

const userInfoStore = useUserInfoStore()

</script>

<style scoped>
  .home {
    width: 100%;
    height: 100%;
    padding: 20px;
    font-size: 30px;
  }
</style>
