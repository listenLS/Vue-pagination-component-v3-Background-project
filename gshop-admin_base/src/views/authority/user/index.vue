<template>
  <div>
    <el-card>
      <el-form inline>
        <el-form-item>
          <el-input size="small" v-model="queryInfo">
         </el-input>
          </el-form-item>
        <el-form-item
          ><el-button type="primary" :icon="Search" 
          @click="chaXun"
          >查询</el-button>
          <el-button @click="qingKong">清空</el-button></el-form-item
        >
      </el-form>
      <el-button type="primary" @click="open">添加</el-button>
      <el-button type="danger" disabled>批量删除</el-button>
      <el-table :data="userInfo" border width="100%" style="margin-top: 20px">
        <el-table-column type="selection" />
        <el-table-column
          type="index"
          label="序号"
          width="80"
          align="center"
        ></el-table-column>
        <el-table-column
          label="用户名"
          prop="username"
          width="120"
        ></el-table-column>
        <el-table-column
          label="用户昵称"
          prop="nickName"
          width="120"
        ></el-table-column>
        <el-table-column
          label="角色列表"
          prop="roleName"
          width="200"
        ></el-table-column>
        <el-table-column
          label="创建时间"
          prop="gmtCreate"
          width="200"
        ></el-table-column>
        <el-table-column
          label="更新时间"
          prop="gmtModified"
          width="200"
        ></el-table-column>
        <el-table-column label="操作" fixed="right" width="200" align="center">
          <el-button title="分配角色" :icon="User" type="info" size="small"></el-button>
          <el-button title="修改用户" :icon="Edit" type="primary"  size="small"></el-button>
          <el-button title="删除用户" :icon="Delete" type="danger"  size="small"></el-button>
        </el-table-column>
      
      </el-table>
      <el-pagination
      style="margin-top: 20px;"
      v-model:current-page="page"
      v-model:page-size="limit"
      :page-sizes="[3,6,9]"
      :total="total"
      layout=" prev, pager, next, jumper,->,total, sizes,"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { Search, User, Delete, Edit } from "@element-plus/icons-vue";
import userApi, { type userModel, type userInfoModel } from "@/api/user";
import { ElMessage, ElMessageBox } from 'element-plus'
import { onMounted, ref } from "vue";
const page=ref(1)
const limit=ref(5)
const total=ref(0)
const queryInfo=ref('')
const handleCurrentChange=(val:number)=>{
  page.value=val
  getUserInfo()
}
const handleSizeChange=(val:number)=>{
limit.value=val
getUserInfo()
 
}

const chaXun=()=>{
  getUserInfo()
}
const qingKong=()=>{
  queryInfo.value=''
  getUserInfo()
}


const open = () => {
  ElMessageBox.prompt('', '添加用户', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    inputErrorMessage: 'Invalid Email',
    message:'dssdsds'
  })
    .then(({ value }) => {
      ElMessage({
        type: 'success',
        message: `Your email is:${value}`,
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Input canceled',
      })
    })
}



const userInfo = ref<userInfoModel[]>([]);
const getUserInfo = async () => {
  let result = await userApi.reqUserInfo(page.value,queryInfo.value);
  console.log(result);
  userInfo.value = result.items;
  total.value = result.total
};

onMounted(() => {
  getUserInfo();
});
</script>

<style scoped></style>
