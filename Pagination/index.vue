<template>
  <div class="pagination">
    <button @click="$emit('change',pageNo-1)"
    :disabled="pageNo==1"
    >上一页</button>
    <button
    v-if="startEnd.start>1"
    @click="$emit('change',1)"
    >1</button>
    <button
    v-if="startEnd.start>2"
    >...</button>
    <button 
    :class="{
      active:pageNo==item
    }"
    v-for="item in startEnd.end"
    v-if="item>=startEnd.start"
    :key="item"
    @click="$emit('change',item)"
    >{{item}}</button>
    <button v-if="startEnd.end<pageTotal-1">...</button>
    <button v-if="startEnd.end<pageTotal" @click="$emit('change',pageTotal)">{{pageTotal}}</button>
    <button
    @click="$emit('change',pageNo+1)"
    :disabled="pageNo==pageTotal"
    >下一页</button>

    <button style="margin-left: 30px">共 {{total}} 条</button>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  props:{
    pageNo:{
      type:Number,
      required:true
    },
    pageSize:{
      type:Number,
      required:true
    },
    total:{
      type:Number,
      required:true,
    },
    count:{
      type:Number,
      default:5
    },
  },
  computed:{
    pageTotal(){
      return Math.ceil(this.total/this.pageSize)
    },
    startEnd(){
      let {pageNo,pageSize,total,count,pageTotal}=this
      let start=0;
      let end=0;
      if(pageTotal<count){
        start=1
        end=pageTotal
      }else{
        start=pageNo-(count-1)/2
        end=pageNo+(count-1)/2
        if(start<1){
          start=1
          end=count
        }
        if(end>pageTotal){
          end=pageTotal
          start=pageTotal-count+1
        }
      }
      return{
        start,end
      }
    }
  }
};
</script>

<style lang="less" scoped>
.pagination {
  button {
    margin: 0 5px;
    background-color: #f4f4f5;
    color: #606266;
    outline: none;
    border-radius: 2px;
    padding: 0 4px;
    vertical-align: top;
    display: inline-block;
    font-size: 13px;
    min-width: 35.5px;
    height: 28px;
    line-height: 28px;
    cursor: pointer;
    box-sizing: border-box;
    text-align: center;
    border: 0;

    &[disabled] {
      color: #c0c4cc;
      cursor: not-allowed;
    }

    &.active {
      cursor: not-allowed;
      background-color: #409eff;
      color: #fff;
    }
  }
}
</style>
