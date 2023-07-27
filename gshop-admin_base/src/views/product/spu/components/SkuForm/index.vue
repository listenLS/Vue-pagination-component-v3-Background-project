<template>
  <div>
    <el-form label-width="100px">
      <el-form-item label="SPU名称">
        <div>{{ spuInfo.spuName }}</div></el-form-item
      >

      <el-form-item label="SKU名称">
        <el-input placeholder="SKU名称" v-model="skuForm.skuName"></el-input>
      </el-form-item>

      <el-form-item label="价格(元)">
        <el-input placeholder="价格(元)" v-model="skuForm.price"></el-input>
      </el-form-item>

      <el-form-item label="重量(千克)">
        <el-input placeholder="重量(千克)" v-model="skuForm.weight"></el-input>
      </el-form-item>

      <el-form-item label="规格描述">
        <el-input
          type="textarea"
          placeholder="规格描述"
          v-model="skuForm.skuDesc"
        ></el-input>
      </el-form-item>

      <el-form-item label="平台属性">
        <el-form inline>
          <el-form-item
            v-for="attr in attrList"
            :label="attr.attrName"
            :key="attr.id"
          >
            <el-select v-model="attr.attrIdValueId">
              <el-option
                v-for="attrVal in attr.attrValueList"
                :key="attrVal.id"
                :value="`${attr.id}:${attrVal.id}`"
                :label="attrVal.valueName"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-form inline>
          <el-form-item
            v-for="saleAttr in saleAttrList"
            :key="saleAttr.id"
            :label="saleAttr.saleAttrName"
          >
            <el-select v-model="saleAttr.attrIdValueId">
              <el-option
                v-for="saleAttrVal in saleAttr.spuSaleAttrValueList"
                :key="saleAttrVal.id"
                :value="`${saleAttr.id}:${saleAttrVal.id}`"
                :label="saleAttrVal.saleAttrValueName"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>

      <el-form-item label="图片列表">
        <el-table :data="imageList" border @select="selectChange">
          <el-table-column
            type="selection"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column label="图片">
            <template #default="{ row, $index }">
              <img :src="row.imgUrl" style="width: 60px; height: 60px" />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称"></el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="{ row, $index }">
              <el-tag v-if="row.isDefault == '1'" type="success" size="small"
                >默认</el-tag
              >
              <el-button
                v-else
                type="primary"
                size="small"
                @click="setDefaultImage(row)"
                >设为默认</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" @click="onSave">保存</el-button>
        <el-button @click="onCancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { STATUS } from "../../index.vue";
import spuApi, { type SpuModel, type SpuSaleAttrModel, type SpuImageModel } from "@/api/spu";
import attrsApi, { type AttrsModelList } from "@/api/attrs";
import skuApi from '@/api/sku'
import useCategoryStore from "@/stores/category";
import type { SkuModel } from "@/api/sku";
import { ElMessage } from "element-plus";
const categoryStore = useCategoryStore()
const emits =  defineEmits<{
  (e: 'update:modelValue', status: number): void,
  (e: 'receiveSpuInfo'): void
}>()
const props = defineProps<{
  spuInfo: SpuModel
}>()


const onSave=async ()=>{
  skuForm.value.spuId = props.spuInfo.id
  skuForm.value.tmId = props.spuInfo.tmId
  skuForm.value.category3Id = categoryStore.category3Id

  skuForm.value.skuDefaultImg=imageList.value.find(item=>item.isDefault=='1')?.imgUrl!

  skuForm.value.skuAttrValueList=attrList.value.filter(item=>item.attrIdValueId).map(item=>{
    const [attrId,valueId]=item.attrIdValueId?.split(':')!
    return {
      attrId,
      valueId
    }
  })
  skuForm.value.skuSaleAttrValueList = saleAttrList.value.filter(item => item.attrIdValueId).map(item => {

const [saleAttrId, saleAttrValueId] = item.attrIdValueId?.split(":")!

return {
  saleAttrId,
  saleAttrValueId
}

})
await skuApi.reqSave(skuForm.value)
ElMessage.success('保存成功')
onCancel()
}
const onCancel=()=>{
  emits('update:modelValue',STATUS.SPULIST)
  emits('receiveSpuInfo')
}

const selectChange=(imgList:SpuImageModel[])=>{
  skuForm.value.skuImageList=imgList
}

const setDefaultImage=(row:SpuImageModel)=>{
  imageList.value.forEach(item=>item.isDefault='0')
  row.isDefault='1'
}

const initSkuForm = () => ({
  spuId: undefined,
  tmId: undefined,
  category3Id: undefined,
  skuName: "",
  price: "",
  skuDesc: "",
  weight: "",
  skuDefaultImg: "",
  createTime: "",
  skuImageList: [],
  skuAttrValueList: [],
  skuSaleAttrValueList: [],
});
const skuForm = ref<SkuModel>(initSkuForm());

const attrList = ref<AttrsModelList>([]);
const getAttrList = async () => {
  const { category1Id, category2Id, category3Id } = categoryStore;
  let result = await attrsApi.reqAttrsList(
    category1Id!,
    category2Id!,
    category3Id!
  );
  attrList.value = result;
  console.log("平台属性", attrList.value);
};

const saleAttrList = ref<SpuSaleAttrModel[]>([]);
const getSaleAttrList = async () => {
  let result = await spuApi.reqSaleAttrListBySpuId(props.spuInfo.id!);
  saleAttrList.value = result;
  console.log("销售属性", saleAttrList.value);
};

const imageList = ref<SpuImageModel[]>([]);
const getImageList = async () => {
  let result = await spuApi.reqSpuImageListBySpuId(props.spuInfo.id!);
  imageList.value = result;
};

onMounted(() => {
  getAttrList();
  getSaleAttrList();
  getImageList();
});
</script>

<style scoped></style>
