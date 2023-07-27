<template>
  <div class="spu">
    <el-card class="mb-10">
      <CategorySelector :disabled="status != STATUS.SPULIST"></CategorySelector>
    </el-card>
    <el-card>
      <SpuList v-if="status == STATUS.SPULIST" v-model="status"
      @receiveSpuInfo="receiveSpuInfo"
      ></SpuList>
      <SpuForm v-if="status == STATUS.SPUFORM" v-model="status"
      :spuInfo="spuInfo"   @receiveSpuInfo="receiveSpuInfo"
      ></SpuForm>
      <SkuForm v-if="status == STATUS.SKUFORM" v-model="status" :spuInfo="spuInfo" @receiveSpuInfo="receiveSpuInfo"></SkuForm>
    </el-card>
  </div>
</template>
<script lang="ts">
 export enum STATUS{
  SPULIST=1000,
  SPUFORM=2000,
  SKUFORM=3000
 }
</script>
<script setup lang="ts">
import SpuList from './components/SpuList/index.vue'
import SpuForm from './components/SpuForm/index.vue'
import SkuForm from './components/SkuForm/index.vue'
import { ref } from 'vue';
import type {SpuModel} from '@/api/spu';
const status=ref(STATUS.SPULIST)

const initSpuInfo=()=>({
  spuName:'',
  description:'',
  category3Id:undefined,
  tmId:undefined,
  spuSaleAttrList:[],
  spuImageList:[]
})
const spuInfo=ref<SpuModel>(initSpuInfo())
const receiveSpuInfo=(row:SpuModel|undefined )=>{
 if(row){
  spuInfo.value=row
 }else{
  spuInfo.value=initSpuInfo()
 }
}
</script>

<style scoped>

</style>