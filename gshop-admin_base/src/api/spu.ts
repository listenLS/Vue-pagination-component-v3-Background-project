import request from '@/utils/request'

export interface SpuSaleAttrValueModel {
  id?:number,
  isChecked?:null,
  saleAttrName?:string,
  spuId?:number
  baseSaleAttrId: number
  saleAttrValueName: string
}

export interface SpuSaleAttrModel {
  id?:number,
  spuId?:number,

  baseSaleAttrId: number
  saleAttrName: string
  spuSaleAttrValueList: SpuSaleAttrValueModel[]
  inputVisible?:boolean
  inputValue?:string
  attrIdValueId?: string
}

export interface SpuImageModel {
  id?:number,
  spuId?:number,

  imgName: string
  imgUrl: string
  name?:string
  response?:any
  url?:string
  isDefault?: string
}

export interface SpuModel {
  id?: number
  spuName: string
  description: string
  category3Id: number | undefined
  tmId: number | undefined
  spuSaleAttrList: SpuSaleAttrModel[]
  spuImageList: SpuImageModel[]
 
}

export interface SpuPageModel {
  records: SpuModel[]
  total: number
  size: number
  current: number
  searchCount: boolean
  pages: number
}

export interface SaleAttrModel { id: number, name: string }

export default {
  reqSpuPage(page: number ,limit: number, category3Id: number) {
    return request.get<any, SpuPageModel>(`/admin/product/${page}/${limit}?category3Id=${category3Id}`)
  },
  reqSaleAttrList(){
    return request.get<any,SaleAttrModel[]>(`/admin/product/baseSaleAttrList`)
  },
  reqSaveSpu(data:SpuModel){
    return request.post<any,null>(`/admin/product/saveSpuInfo`,data)
  },
  reqSpuImageListBySpuId(spuId:number){
    return request.get<any,SpuImageModel[]>(`/admin/product/spuImageList/${ spuId }`)
  },
  reqSaleAttrListBySpuId(spuId:number){
    return request.get<any,SpuSaleAttrModel[]>(`/admin/product/spuSaleAttrList/${ spuId }`)
  },
  reqUpdateSpu(data:SpuModel){
    return request.post(`/admin/product/updateSpuInfo`,data)
  },
  reqDeleteSpu(spuId:number){
    return request.delete<any,null>(`/admin/product/deleteSpu/${spuId}`)
  }
}