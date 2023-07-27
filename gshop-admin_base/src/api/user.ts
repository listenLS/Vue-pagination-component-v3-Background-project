import request from "@/utils/request";

export interface userInfoModel {
  id: string;
  gmtCreate: string;
  gmtModified: string;
  deleted: boolean;
  username: string;
  password: string;
  nickName: string;
  salt: null;
  token: null;
  roleName: string;
}
export type userModel = userInfoModel[];
export interface resUserInfoType {
  total: number;
  items: userModel;
}
export default {
  reqUserInfo(total:number,userName:string) {
    return request.get<any, resUserInfoType>(`/admin/acl/user/${total}/5?username=${userName}`);
  },
};
