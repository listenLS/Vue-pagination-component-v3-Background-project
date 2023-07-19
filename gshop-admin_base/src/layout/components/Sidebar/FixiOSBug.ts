import { useAppStore } from "@/stores/app"
import { computed, onMounted } from "vue"

export default function fixiOSBug (subMenuRef: any) {
  const appStore = useAppStore()  
  const device = computed(() => appStore.device)

  const fixBugIniOS = () => {
    if (subMenuRef) {
      const handleMouseleave = subMenuRef.handleMouseleave
      subMenuRef.handleMouseleave = (e: Event) => {
        if (device.value === 'mobile') {
          return
        }
        handleMouseleave(e)
      }
    }
  }

  onMounted(() => {
    fixBugIniOS()
  })

  return {
    device
  }
}
