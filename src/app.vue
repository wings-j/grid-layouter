<script setup lang="ts">
  import Grid from '@/core/grid'
  import { ElMessage, ElTooltip } from 'element-plus'
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
    navigator.clipboard.writeText(grid.css)
    ElMessage.success('CSS copied to clipboard')
  }
</script>

<template>
  <div class="d-flex h-100vh column-gap-10" style="background-color: #f9f9f9">
    <div class="flex-grow-1 h-100 p-20 bg-white">
      <div
        style="display: grid; grid-auto-flow: row dense; width: 100%; height: 100%"
        :style="{
          gridTemplateColumns: `100px ${grid.columns.map(a => a.token).join(' ')}`,
          gridTemplateRows: `100px ${grid.rows.map(a => a.token).join(' ')}`
        }"
      >
        <div style="grid-area: 1/1/2/2"></div>
        <div v-for="(a, i) of grid.columns" :style="{ gridArea: `1 / ${i + 2} / 2 / ${i + 3}` }"></div>
        <div v-for="(a, i) of grid.rows" :style="{ gridArea: `${i + 2} / 1 / ${i + 3} / 2` }"></div>
        <div v-for="i of grid.rows.length * grid.columns.length" :key="i" class="item">{{ i }}</div>
      </div>
    </div>
    <div class="d-flex flex-column align-items-center h-100 p-v-20 bg-white" style="width: 60px">
      <el-tooltip effect="dark" content="Copy CSS to clipboard" placement="top-start">
        <img class="m-t-auto cursor-pointer" style="width: 50%" src="./images/sharp.svg" @click="handleOutputClick" />
      </el-tooltip>
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
