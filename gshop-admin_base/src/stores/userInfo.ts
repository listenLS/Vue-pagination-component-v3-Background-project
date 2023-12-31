import { defineStore } from 'pinia';
import { getToken, removeToken, setToken } from '../utils/token-utils';
// import type { UserInfoState } from './interface';
import type { RouteRecordRaw } from "vue-router";
import {ElMessage} from 'element-plus'
import {staticRoutes} from '@/router/routes'
import userinfoApi ,{type UserInfoModel}from '@/api/userinfo';

export interface UserInfoState{
  token: string;
  userInfo: UserInfoModel,
  menuRoutes: RouteRecordRaw[]
}
const initUserinfo=():UserInfoModel=>({
  avatar: '',
name: '',
buttons: [],
roles: [],
routes: []
})

/**
 * 用户信息
 * @methods setUserInfos 设置用户信息
 */
export const useUserInfoStore = defineStore('userInfo', {

	state: (): UserInfoState => ({
    token: getToken() as string,
    userInfo: initUserinfo(),
    menuRoutes: []
  }),
  

	actions: {
     
    async login(username:string,password:string){
      try {
        let result=await userinfoApi.reqLogin({username,password})
        setToken(result.token)
        this.token=result.token
      } catch (error) {
        console.error(error);
        return Promise.reject(error)
        
      }
    },

    async getInfo(){
      try {
        let result=await userinfoApi.reqGetInfo()

        this.userInfo=result
        this.menuRoutes=staticRoutes
      } catch (error) {
        console.error(error);
        return Promise.reject(error)
        
      }
    },
    async reset () {

      try {
        await userinfoApi.reqLogout()
      } catch (error) {
        console.error(error);
        
      }finally{
      // 删除local中保存的token
      removeToken()
      // 提交重置用户信息的mutation
      this.token = ''
      this.userInfo=initUserinfo()
      }
      
    },

    // login (username: string, password: string) {
    //   return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //       if (username==='admin' && password==='111111') {
    //         const token = 'token-atguigu'
    //         setToken(token)
    //         this.token = token
    //         resolve(token)
    //       } else {
    //         reject(new Error('用户名或密码错误!'))
    //         ElMessage.error('用户名或密码错误!')
    //       }
    //     }, 1000)
    //   })
    // },

    // getInfo () {
    //   return new Promise((resolve, reject) => {
    //     setTimeout(() => {
    //       this.name = 'admin'
    //       this.avatar = 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif'
    //       this.menuRoutes = staticRoutes
    //       resolve({name: this.name, avatar: this.avatar, token: this.token})
    //     }, 1000)
    //   })
    // },

    // reset () {
    //   // 删除local中保存的token
    //   removeToken()
    //   // 提交重置用户信息的mutation
    //   this.token = ''
    //   this.name = ''
    //   this.avatar = ''
    // },
	},
});
