import request from '@/utils/request'
import type { SpuImageModel } from './spu'

export interface SkuAttrValueModel {
  attrId: string
  valueId: string
}
export interface SkuSaleAttrValueModel {
  saleAttrId: string
  saleAttrValueId: string
}

export interface SkuModel {
  id?: number
  spuId: number | undefined
  tmId: number| undefined
  category3Id: number| undefined
  price: number | string
  skuName: string
  skuDesc: string
  weight: string
  skuDefaultImg: string
  isSale?: number
  createTime: string
  skuImageList: SpuImageModel[] // 收集到的图片列表
  skuAttrValueList: SkuAttrValueModel[] // 收集到的平台属性
  skuSaleAttrValueList: SkuSaleAttrValueModel[] // 收集到的销售属性
}

export default {
  // 根据spuid获取sku列表
  reqSkuListBySpuId(spuId: number) {
    return request.get<any, SkuModel[]>(`/admin/product/findBySpuId/${ spuId }`)
  },
  // 保存sku
  reqSave(data: SkuModel) {
    return request.post<any, null>(`/admin/product/saveSkuInfo`, data)
  }
}