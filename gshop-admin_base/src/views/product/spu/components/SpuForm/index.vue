<template>
  <el-form label-width="100px">
    <el-form-item label="SPU名称">
      <el-input placeholder="SPU名称" 
      v-model="spuForm.spuName"
      clearable></el-input>
    </el-form-item>

    <el-form-item label="品牌">
      <el-select v-model="spuForm.tmId">
        <el-option
        v-for="tm in tmList"
        :key="tm.id"
         :value="(tm.id as number)"
         :label="tm.tmName"></el-option>
        
      </el-select>
    </el-form-item>

    <el-form-item label="SPU描述">
      <el-input type="textarea" 
      v-model="spuForm.description"
      placeholder="SPU描述" rows="3"></el-input>
    </el-form-item>

    <el-form-item label="SPU图片">

      <el-upload
        v-model:file-list="(spuImageList as any)"
        :action="action"
        list-type="picture-card"
        :on-success="handleSuccess"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
      >
        <el-icon><Plus /></el-icon>
      </el-upload>

      <el-dialog v-model="dialogVisible">
        <img w-full :src="dialogImageUrl" alt="Preview Image" />
      </el-dialog>

    </el-form-item>


    <el-form-item label="销售属性" >
      <div class="mb-10">
        <el-select  v-model="attrIdName" :placeholder="`还有${saleAttrList.length}个未选择`" class="mr-10">
          <el-option 
          v-for="saleAttr in saleAttrList"
          :key="saleAttr.id"
          :value="`${saleAttr.id}:${saleAttr.name}`" 
          :label="saleAttr.name"></el-option>
          
        </el-select>

        <el-button @click="addSaleAttr" type="primary">添加销售属性</el-button>
      </div>
      <el-table  :data="spuForm.spuSaleAttrList" border>
        <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
        <el-table-column label="属性名" width="200"  prop="saleAttrName"></el-table-column>
        <el-table-column label="属性值列表">
          <template #default="{ row, $index }">
          
          <el-tag
            v-for="(tag, idx) in row.spuSaleAttrValueList"
            :key="idx"
            class="mr-10"
            closable
            :disable-transitions="false"
            @close="handleClose(idx,row.spuSaleAttrValueList)"
          >
            
            {{ tag.saleAttrValueName }}
          </el-tag>


          <el-input
            v-if="row.inputVisible"
            ref="InputRef"
            v-model.trim="row.inputValue"
            style="width: 100px;"
            size="small"
            @keyup.enter="handleInputConfirm(row)"
            @blur="handleInputConfirm(row)"
          />
          <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput(row)">
            新增
          </el-button>

        </template>
         
        </el-table-column>
        <el-table-column label="操作" width="80">
          <template #default="{ row, $index }">
            <el-button type="danger" size="small" :icon="Delete"
            @click="deleteSaleAttr($index)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>

    </el-form-item>


    <el-form-item>
      <el-button type="primary" @click="onSave">保存</el-button>
      <el-button @click="onCancel">取消</el-button>
    </el-form-item>

  </el-form>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, ref } from 'vue'
import { ElMessage, type InputInstance, type UploadProps, type UploadUserFile } from 'element-plus'
import { Plus, Delete } from '@element-plus/icons-vue'
import { STATUS } from '../../index.vue'
import trademarkApi, { type TMModel } from '@/api/trademark'
import spuApi, { type SaleAttrModel, type SpuImageModel, type SpuModel, type SpuSaleAttrModel, type SpuSaleAttrValueModel } from '@/api/spu'
import category from '@/api/category'
import useCategoryStore from '@/stores/category'
import {cloneDeep} from 'lodash'
const action = `${ import.meta.env.VITE_API_URL }/admin/product/upload`
const categoryStore = useCategoryStore()
const emits =  defineEmits<{
  (e: 'update:modelValue', status: number): void
  (e:'receiveSpuInfo'):void
}>()
const props=defineProps<{
  spuInfo:SpuModel
}>()
const onSave=async ()=>{
spuForm.value.category3Id=categoryStore.category3Id
let tempSpuImageList=spuImageList.value.map(item=>{
  return{
    imgName:item.name!,
    imgUrl: item.imgUrl || item.response.data
  }
})
spuForm.value.spuImageList=tempSpuImageList
let { category3Id, spuName, description, tmId, spuSaleAttrList, spuImageList: siList } = spuForm.value
if ( !(category3Id && spuName && description && tmId && spuSaleAttrList.length && siList.length) ) {
    ElMessage.warning('请输入完整内容')
    return
  }
  spuForm.value.spuSaleAttrList.forEach(item=>{
    delete item.inputValue
    delete item.inputVisible
  })
  if (spuForm.value.id) { // 有id就是编辑
    await spuApi.reqUpdateSpu(spuForm.value)
  } else { // 没有id就是新增
    await spuApi.reqSaveSpu(spuForm.value)
  }
  ElMessage.success('保存成功')
  // emits('update:modelValue',STATUS.SPULIST)
  onCancel()
}
const onCancel = () => {

emits('update:modelValue', STATUS.SPULIST) 

emits('receiveSpuInfo') 

}

 const handleClose=(index: number, spuSaleAttrValueList: SpuSaleAttrValueModel[])=>{
         spuSaleAttrValueList.splice(index,1)
}

const InputRef=ref<InputInstance>()
const showInput=(row:SpuSaleAttrModel)=>{
  row.inputVisible=true
  nextTick(()=>{
    InputRef.value?.focus()
  })
}
const handleInputConfirm=(row:SpuSaleAttrModel)=>{
  if(!row.inputValue){
    row.inputVisible=false
    return
  }
  if(row.spuSaleAttrValueList.map(item=>item.saleAttrValueName).includes(row.inputValue)){
    ElMessage.error('输入销售属性值重复,请重试')
    row.inputVisible=false
    row.inputValue=''
    return
  }
  row.spuSaleAttrValueList.push({
    baseSaleAttrId:row.baseSaleAttrId,
    saleAttrValueName:row.inputValue
  })
  row.inputVisible=false
  row.inputValue=''

}
const attrIdName=ref('')
const addSaleAttr=()=>{
  if(!attrIdName.value){
    return
  }
 const [baseSaleAttrId,saleAttrName]=attrIdName.value.split(':')
  spuForm.value.spuSaleAttrList.push({
    baseSaleAttrId:Number(baseSaleAttrId),
    saleAttrName,
    spuSaleAttrValueList:[]
  })
  attrIdName.value=''
}

const deleteSaleAttr=(index:number)=>{
  spuForm.value.spuSaleAttrList.splice(index,1)
}

const spuImageList=ref<SpuImageModel[]>([])

const dialogImageUrl=ref('')
const dialogVisible=ref(false)
const handleSuccess:UploadProps['onSuccess']=(response,uploadFile,uploadFiles)=>{
  spuImageList.value=uploadFiles as any
}
const handleRemove:UploadProps['onRemove']=(uploadFile,uploadFiles)=>{
  spuImageList.value=uploadFiles as any 
  
}
const handlePictureCardPreview:UploadProps['onPreview']=(uploadFile)=>{
  dialogImageUrl.value=uploadFile.url!
  dialogVisible.value=true
}

const initSpuForm=():SpuModel=>({
  category3Id:undefined,
  spuName:'',
  description:'',
  tmId:undefined,
  spuSaleAttrList:[],
  spuImageList:[]
})
const spuForm=ref<SpuModel>(initSpuForm())
const tmList=ref<TMModel[]>([])
const getTrademarkList=async ()=>{
  let result=await trademarkApi.reqTrademarkList()
  tmList.value=result
}
const baseSaleAttrList = ref<SaleAttrModel[]>([])
  const getSaleAttrList = async () => {
  baseSaleAttrList.value = await spuApi.reqSaleAttrList()
}

const saleAttrList=computed(()=>{
  let newArr=baseSaleAttrList.value.filter(saleAttr=>{
    let isExist=spuForm.value.spuSaleAttrList?.some(item=>{
      return item.baseSaleAttrId==saleAttr.id
    })
    return !isExist
  })
  return newArr
})
const getSpuImageList=async ()=>{
  let result=await spuApi.reqSpuImageListBySpuId(spuForm.value.id!)
  spuImageList.value=result.map(item=>{
    return{
      ...item,
      name:item.imgName,
      url:item.imgUrl || item.response.data
    }
  })
}
const getSpuSaleAttrList=async ()=>{
  let result=await spuApi.reqSaleAttrListBySpuId(spuForm.value.id!)
  spuForm.value.spuSaleAttrList=result
}
// 初始化数据展示
onMounted(() => {
  getTrademarkList()
  getSaleAttrList()
  if(props.spuInfo.id){
    spuForm.value=cloneDeep(props.spuInfo)
    getSpuImageList()
    getSpuSaleAttrList()
  }
})
</script>

<style scoped>

</style>