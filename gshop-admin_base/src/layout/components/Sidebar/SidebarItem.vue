<template>
  <div v-if="!item.meta || !item.meta.hidden">
    <template v-if="hasOneShowingChild(item.children, item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
        <item :icon="onlyOneChild.meta.icon || (item.meta && item.meta.icon)" 
            :title="!appStore.sidebar.opened && !isNest ? '' : onlyOneChild.meta.title" />
        </el-menu-item>
      </app-link>
    </template>

    <el-sub-menu v-else ref="subMenuRef" :index="resolvePath(item.path)" popper-append-to-body>
      <template #title>
        <item :icon="item.meta.icon || (item.meta && item.meta.icon)" 
            :title="!appStore.sidebar.opened && !isNest ? '' : item.meta.title" />
      </template>
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        is-nest
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />

      
    </el-sub-menu>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'SidebarItem'
  }
</script>

<script lang="ts" setup>
  // import path from 'path'
  import path from 'path-browserify'
  import { isExternalFn } from '@/utils/validate'
  import Item from './Item.vue'
  import AppLink from './Link.vue'
  import FixiOSBug from './FixiOSBug'
  import type { ElSubMenu } from 'element-plus'
  import { ref } from 'vue'
  import { useAppStore } from "@/stores/app";

  const appStore = useAppStore();

  const subMenuRef = ref<InstanceType<typeof ElSubMenu>>()

  FixiOSBug(subMenuRef)

  const props = defineProps({
    item: {
      type: Object,
      required: true,
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  })

  const onlyOneChild = ref<any>({})

  const hasOneShowingChild = (children = [], parent: any) => {
    const showingChildren = children.filter((item: any) => {
      if (item.meta.hidden) {
        return false
      } else {
        // Temp set(will be used if only has one showing child)
        onlyOneChild.value = item
        return true
      }
    })

    // When there is only one child router, the child router is displayed by default
    if (showingChildren.length === 1) {
      return true
    }

    // Show parent if there are no child router to display
    if (showingChildren.length === 0) {
      onlyOneChild.value = { ... parent, path: '', noShowingChildren: true }
      return true
    }

    return false
  }

  const resolvePath = (routePath: string) => {
    if (isExternalFn(routePath)) {
      return routePath
    }
    if (isExternalFn(props.basePath)) {
      return props.basePath
    }
    return path.resolve(props.basePath, routePath)
  }

</script>
