<template>
  <div class="attrs">
    <el-card class="mb-10">
      <CategorySelector :disabled="isEdit"></CategorySelector>
    </el-card>
    <el-card>
      <div v-if="isEdit">
      <el-form inline>
        <el-form-item label="属性名">
          <el-input placeholder="输入属性名"  v-model="attrsForm.attrName"></el-input>
        </el-form-item>
       <div class="mb-10">
      <el-button type="primary" @click="addAttrVal" :disabled="!attrsForm.attrName">添加属性值</el-button>
       <el-button @click="onCancel">取消</el-button>
       </div>
       <el-table :data="attrsForm.attrValueList" border class="mb-10">
      <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>

      <el-table-column label="属性值名称" prop="valueName">
        <template #default="{row,$index}">
   <el-input 
      v-if="row.inputVisible"
      v-model.trim="row.valueName"
      size="small"
      @blur="hideInput(row,$index)"
      ref="inputRef"
   ></el-input>
     <div
       v-else
       @click="showInput(row)"
     >{{ row.valueName }}</div>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="80">
        <template #default="{row,$index}">
        <el-button type="danger" :icon="Delete" size="small" @click="deleteAttrValue($index)"></el-button>
        </template>
      </el-table-column>
      </el-table>
      <div>
        <el-button type="primary" @click="onSave" :disabled="!(attrsForm.attrName && attrsForm.attrValueList.length)">保存</el-button>
        <el-button @click="onCancel">取消</el-button>
      </div>

      </el-form>
      </div>
      <div v-else>
        <el-button type="primary" :icon="Plus" class="mb-10" @click="isEdit=true" :disabled="!categoryStore.category3Id">添加属性</el-button>
     <el-table :data="attrs" border>
        <el-table-column label="序号" type="index" width="80" align="center"></el-table-column>
         <el-table-column label="属性名" prop="attrName" width="160"></el-table-column>
         <el-table-column label="属性值列表" >
          <template #default="{row,$index}">
          <el-tag class="mr-20" type="success"  v-for="attrVal in row.attrValueList" :key="attrVal.id">{{ attrVal.valueName }}</el-tag>
          </template>

         </el-table-column>
         <el-table-column label="操作" width="140">
        <template #default="{row,$index}"
        >
      <el-button type="warning" :icon="Edit" size="small" @click="editAttr(row)"     ></el-button>
      <el-popconfirm :title="`确认要删除[${ row.attrName }]吗?`" @confirm="deleteAttr(row)">
                <template #reference>
                  <el-button type="danger" :icon="Delete" size="small"></el-button>
                </template>
              </el-popconfirm>
      </template>

         </el-table-column>
     </el-table>

      </div>
    
    </el-card>
  </div>
</template>

<script setup lang="ts">
import attrsApi, { type AttrsModel } from '@/api/attrs'
import { Delete, Edit, Plus } from '@element-plus/icons-vue'
import useCategoryStore from '@/stores/category'
import { watch, ref ,nextTick} from 'vue';
import {ElMessage} from 'element-plus'
import {cloneDeep} from 'lodash'
import type { AttrsValueModel } from '@/api/attrs';
const categoryStore=useCategoryStore()
const inputRef=ref<HTMLInputElement>()

const showInput=(row:AttrsValueModel)=>{
  row.inputVisible=true
  nextTick(()=>{
    inputRef.value?.focus()
  })
}

const hideInput=(row:AttrsValueModel,index:number)=>{
  row.inputVisible=false

  if(!row.valueName){
    attrsForm.value.attrValueList.splice(index,1)
    return
  }

  let isRepeat=attrsForm.value.attrValueList.some((item,idx)=>{
    if(index==idx){
      return false
    }else{
      return row.valueName==item.valueName
    }
  })
  if(isRepeat){
    ElMessage.error('输入的属性值不能重复,请重试')
    attrsForm.value.attrValueList.splice(index,1)
    return 
  }
}

const onSave=async ()=>{
  attrsForm.value.categoryId=categoryStore.category3Id
  await attrsApi.reqSaveAttrInfo(attrsForm.value)
  ElMessage.success('保存成功')
  onCancel()
  getList()
}
const onCancel=()=>{
  isEdit.value=false
  attrsForm.value=initAttrsForm()
}
const addAttrVal=()=>{
  attrsForm.value.attrValueList.push({
    valueName:'',
    inputVisible:true
  })

  nextTick(()=>{
    inputRef.value?.focus()
  })
  
}

const isEdit=ref(false)
const initAttrsForm=()=>({
  attrName:'',
  attrValueList:[],
  categoryId:undefined,
  categoryLevel:3,
})
const attrsForm=ref<AttrsModel>(
  initAttrsForm()
)

const attrs=ref<AttrsModel[]>([])
const getList=async ()=>{
  const { category1Id, category2Id, category3Id } = categoryStore
  let result=await attrsApi.reqAttrsList(category1Id as number, category2Id as number, category3Id as number)
  attrs.value=result
}
const deleteAttrValue=(index:number)=>{
  attrsForm.value.attrValueList.splice(index, 1)
}
const editAttr=(row:AttrsModel)=>{
  isEdit.value=true
  attrsForm.value=cloneDeep(row)
}
const deleteAttr=async (row:AttrsModel)=>{
  await attrsApi.reqDeleteAttr(row.id as number)
  ElMessage.success('删除成功')
  getList()
}
watch(()=>categoryStore.category3Id,(nval)=>{
  if(nval){
    getList()
  }else{
    attrs.value=[]
  }
})
</script>

<style scoped>

</style>