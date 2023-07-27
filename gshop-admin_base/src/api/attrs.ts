import request from '@/utils/request'

export interface AttrsValueModel{
  id?:number
  valueName:string
  attrId?:number
  inputVisible?: boolean
}

export interface AttrsModel{
  id?: number
  attrName: string
  categoryId: number|undefined
  categoryLevel: number|undefined
  attrValueList: AttrsValueModel[]
  attrIdValueId?: string 
}
export type AttrsModelList = AttrsModel[]

export default {
  reqAttrsList(category1Id: number, category2Id: number, category3Id: number) {
    return request.get<any, AttrsModelList>(`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`)
  },
  reqSaveAttrInfo(data:AttrsModel){
    return request.post<any,null>(`/admin/product/saveAttrInfo`,data)
  },
  reqDeleteAttr(attrId:number){
    return request.delete<any,null>(`/admin/product/deleteAttr/${attrId}`)
  }
}