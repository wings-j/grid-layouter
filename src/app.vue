<script setup lang="ts">
  import Grid from '@/core/grid'
  import { ElMessage } from 'element-plus'
  import { reactive } from 'vue'

  const grid = reactive(new Grid())
  grid.addDimension('row', 'fr', 1)
  grid.addDimension('row', 'fr', 1)
  grid.addDimension('column', 'fr', 1)
  grid.addDimension('column', 'fr', 1)

  /**
   * 处理输出点击
   */
  function handleOutputClick() {
    navigator.clipboard.writeText(grid.style)
    ElMessage.success('CSS 代码已复制到剪贴板')
  }
</script>

<template>
  <div class="d-flex h-100vh column-gap-10" style="background-color: #f9f9f9">
    <div class="flex-grow-1 h-100 p-20 bg-white">
      <div style="width: 100%; height: 100%" :style="grid.style">
        <div v-for="i of grid.rows.length * grid.columns.length" :key="i" class="item">{{ i }}</div>
      </div>
    </div>
    <div class="h-100 p-v-20 bg-white t-center" style="width: 60px">
      <img style="width: 50%" src="./images/sharp.svg" @click="handleOutputClick" />
    </div>
  </div>
</template>

<style scoped lang="scss">
  .item {
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px dashed currentColor;
    color: hsl(160.55, 98.8%, 43.03%);
    font-size: 40px;
  }
</style>
