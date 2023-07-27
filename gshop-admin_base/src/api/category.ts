import request from '@/utils/request'

export interface CategoryModel{
  id: number
  name: string
  category1Id?: number // 只有在二级的数据中有
  category2Id?: number
}

export default{
  reqCategory1List(){
    return request.get<any,CategoryModel[]>(`/admin/product/getCategory1`)
  },
  reqCategory2List(category1Id:number){
    return request.get<any,CategoryModel[]>(`/admin/product/getCategory2/${category1Id}`)
  },
  reqCategory3List(category2Id:number){
    return request.get<any,CategoryModel[]>(`/admin/product/getCategory3/${category2Id}`)
  }
}