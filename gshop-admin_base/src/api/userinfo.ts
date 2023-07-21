import request from '@/utils/request'

interface LoginModel{
  username:string,
  password:string,
}

export interface TokenModel{
  token:string
}
export interface UserInfoModel {
  avatar: string, // 头像
  name: string, // 名称
  buttons: string[], // 权限用
  roles: string[], // 权限用
  routes: string[] // 权限用
}
export default{
  reqLogin(data:LoginModel){
    return request.post<any,TokenModel>('/admin/acl/index/login',data)
  },
  reqGetInfo(){
    return request.get<any,UserInfoModel>(`/admin/acl/index/info`) 
  },
  reqLogout(){
    return request.post<any,null>(`/admin/acl/index/logout`)
  }
}