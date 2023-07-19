import defaultSettings from '@/settings'
import { defineStore } from 'pinia'

const { fixedHeader, sidebarLogo } = defaultSettings


export const useSettingsStore = defineStore({
  id: 'settings',
  
  state: () => ({
    fixedHeader,
    sidebarLogo
  }),
  
  actions: {

    setFixedHeader (val: boolean) {
      this.fixedHeader = val
    },

    setSidebarLogo (val: boolean) {
      this.sidebarLogo = val
    }
  }
})
