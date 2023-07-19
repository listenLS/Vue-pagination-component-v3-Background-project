import {watch, onMounted, onBeforeMount, onBeforeUnmount} from 'vue'
import {useRoute} from 'vue-router'
import { useAppStore } from '@/stores/app'

const { body } = document
const WIDTH = 992 // refer to Bootstrap's responsive design

export function useResize() {
  const route = useRoute()
  const appStore = useAppStore()

  watch(route, () => {
    if (appStore.device === 'mobile' && appStore.sidebar.opened) {
      appStore.closeSidebar(false)
    }
  })

  const isMobile = () => {
    const rect = body.getBoundingClientRect()
    return rect.width - 1 < WIDTH
  }

  const resizeHandler = () => {
    if (!document.hidden) {
      const mobile = isMobile()
      appStore.toggleDevice(mobile ? 'mobile' : 'desktop')
      if (mobile) {
        appStore.closeSidebar(true)
      }
    }
  }

  onBeforeMount(() => {
    window.addEventListener('resize', resizeHandler)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('resize', resizeHandler)
  })

  onMounted(() => {
    const mobile = isMobile()
    if (mobile) {
      appStore.toggleDevice('mobile')
      appStore.closeSidebar(true)
    }
  })
}