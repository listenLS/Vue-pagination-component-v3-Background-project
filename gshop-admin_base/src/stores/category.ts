import { defineStore } from 'pinia'
import categoryApi, { type CategoryModel } from '@/api/category'

// state的类型
interface CategoryStateModel {
  category1List: CategoryModel[],
  category2List: CategoryModel[],
  category3List: CategoryModel[],
  category1Id: undefined | number
  category2Id: undefined | number
  category3Id: undefined | number
}

const useCategoryStore = defineStore('category', {
  state: (): CategoryStateModel => ({ // 给箭头函数定义了返回值的类型,此时state就有类型了
    category1List: [],
    category2List: [],
    category3List: [],
    category1Id: undefined, // 一级id
    category2Id: undefined, // 二级id
    category3Id: undefined, // 三级id
  }),
  actions: {
    // 获取一级数据
    async getCategory1List() {
      let result = await categoryApi.reqCategory1List()
      this.category1List = result
    },
    // 获取二级数据(一级分类id改变的时候,调用获取二级数据)
    async getCategory2List() {
      // 重置二级id和三级id和三级下拉
      this.category2List = [] // 重置二级下拉
      this.category3List = [] // 重置三级下拉
      this.category2Id = undefined // 重置二级id
      this.category3Id = undefined // 重置三级id
      if (!this.category1Id) { // 一级id清空(点击清空按钮),此时把二级和三级相关数据清除即可,二级下拉无法获取,因为没有一级id
        return
      }
      // 重新获取二级下拉数据
      let result = await categoryApi.reqCategory2List(this.category1Id as number)
      this.category2List = result
    },
    // 获取三级数据
    async getCategory3List() {
      // 重置三级id和三级下拉
      this.category3List = []
      this.category3Id = undefined
      if (!this.category2Id) {
        return
      }
      // 重新获取三级下拉数据
      let result = await categoryApi.reqCategory3List(this.category2Id as number)
      this.category3List = result
    },
  },
  getters: {}
})

export default useCategoryStore