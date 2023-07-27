import request from '@/utils/request'


export interface TMModel{
  id?:number,
  tmName:string,
  logoUrl:string,
}

export interface TMPageModel{
  records: TMModel[],
  total: number,
  size: number,
  current: number,
  searchCount: boolean,
  pages: number,
}

export default {
  reqPage(page:number,limit:number){
    return request.get<any,TMPageModel>(`/admin/product/baseTrademark/${page}/${limit}`)
  },
  reqSave(data:TMModel){
    return request.post<any,null>(`/admin/product/baseTrademark/save`,data)
  },
  reqUpdate(data:TMModel){
    return request.put<any,null>(`/admin/product/baseTrademark/update`,data)
  },
  reqDelete(id:number){
    return request.delete<any,null>(`/admin/product/baseTrademark/remove/${id}`)
  },
  reqTrademarkList(){
    return request.get<any,TMModel[]>(`/admin/product/baseTrademark/getTrademarkList`)
  }
}