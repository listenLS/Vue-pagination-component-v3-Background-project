<template>
  <el-card class="box-card">
    <template #header>
      <el-button type="primary" :icon="Plus"
      @click="addTrademark"
      >添加</el-button>
    </template>

  <el-table border :data="tmList" class="mb-10">
    <el-table-column label="序号" width="80"
    type="index" align="center"></el-table-column>
    
    <el-table-column label="品牌名称" prop="tmName"></el-table-column>

    <el-table-column label="品牌LOGO">
      <template #default="{ row, $index }">
          <img :src="row.logoUrl" style="width: 80px;height: 60px;">
        </template>
    </el-table-column>

    <el-table-column label="操作">

      <template #default="{ row, $index }">
          <el-button type="warning" :icon="Edit"
          @click="editTm(row)"
          >编辑</el-button>
          <el-button type="danger" :icon="Delete" @click="deleteTm(row)">删除</el-button>
        </template>
    </el-table-column>
  
  </el-table>
    <el-pagination
      v-model:current-page="page"
      v-model:page-size="limit"
      :page-sizes="[3,6,9]"
      :total="total"
      layout=" prev, pager, next, jumper,->,total, sizes,"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />

    <el-dialog
    v-model="dialogVisible"
    title="添加品牌"
    width="50%"
    >
    <el-form label-width="100px" class="cusform" :model="tmData" :rules="rules" ref="ruleFormRef">
        <el-form-item label="品牌名称" prop="tmName">
          <el-input placeholder="请输入品牌名称" v-model="tmData.tmName" ></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" prop="logoUrl">

          <el-upload
            class="avatar-uploader"
            :action="action"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmData.logoUrl" :src="tmData.logoUrl" class="avatar" />
            <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
            <template #tip>
              <div class="el-upload__tip">
                上传图片必须是jpg且不能大于2M
              </div>
            </template>
          </el-upload>

        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="onCancel">取消</el-button>
          <el-button type="primary" @click="onSave(ruleFormRef)">
            确认
          </el-button>
        </span>
      </template>
  </el-dialog>
</el-card>
</template>

<script setup lang="ts">
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import { ref ,onMounted ,reactive} from 'vue'
import trademarkApi,{type TMModel} from '@/api/trademark'
import type { FormInstance, UploadProps ,FormRules} from 'element-plus'
import { ElMessage ,ElMessageBox} from 'element-plus'
import {cloneDeep} from 'lodash'
const action = `${ import.meta.env.VITE_API_URL }/admin/product/upload`

const ruleFormRef=ref<FormInstance>()

const rules = reactive<FormRules<TMModel>>({
  tmName: [
    { required: true, message: '请输入品牌名称', trigger: 'blur' }, 
    { min: 2, max: 10, message: '品牌名称为2到10个字符', trigger: 'blur' },
  ],
  logoUrl: [
    { required: true, message: '请上传品牌LOGO', trigger: 'change' },
  ],
})

const deleteTm = (row: TMModel) => {

// 双重校验
ElMessageBox.confirm(
  `确认要删除[${ row.tmName }]吗`,
  '警告',
  {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }
)
.then(async () => {
  await trademarkApi.reqDelete(row.id as number)
  ElMessage.success('删除成功')
  getTMPage()
})
}

const editTm=(row:TMModel)=>{
  tmData.value=cloneDeep(row)
  dialogVisible.value=true
}

const onSave=async (formEl:FormInstance|undefined)=>{
if(!formEl)return
 await formEl.validate(async (vaild,fields)=>{
  if(vaild){
    if (tmData.value.id) { // 编辑保存
    await trademarkApi.reqUpdate(tmData.value)
  } else { // 新增保存
    await trademarkApi.reqSave(tmData.value)
  }
  ElMessage.success('保存成功')
  onCancel()
  getTMPage()
  }
 })
 
}
const onCancel=()=>{
  dialogVisible.value=false
  tmData.value=initTmData()
}
const initTmData = () => ({
  tmName: '',
  logoUrl: ''
})
let tmData = ref<TMModel>( initTmData() ) // 收集表单数据

const limit=ref(3)
const page=ref(1)
const total=ref(0)
const dialogVisible=ref(false)
const addTrademark=()=>{
  dialogVisible.value=true
}

const handleAvatarSuccess:UploadProps['onSuccess']=(response,uploadFile)=>{
  tmData.value.logoUrl = response.data;
  (ruleFormRef.value as FormInstance).validateField('logoUrl')
}
const beforeAvatarUpload:UploadProps['beforeUpload']=(rawFile)=>{
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 5) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}

const handleCurrentChange=(val:number)=>{
  page.value=val
 getTMPage()
}
const handleSizeChange=(val:number)=>{
limit.value=val
getTMPage()
 
}

const tmList=ref<TMModel[]>([])
const getTMPage=async ()=>{
  try {
    let result = await trademarkApi.reqPage(page.value, limit.value)
    tmList.value = result.records
    total.value = result.total

  } catch (error) {
    console.error(error);
    
  }
}
onMounted(()=>{
  getTMPage()
})
</script>


<style scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.cusform {
  width: 500px;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>