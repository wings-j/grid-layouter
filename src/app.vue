<script setup lang="ts">
  import Grid, { Cell } from '@/core/grid'
  import { ElInput, ElMessage, ElTooltip } from 'element-plus'
  import { reactive } from 'vue'

  const grid = reactive(new Grid(['1fr', '1fr', '1fr'], ['1fr', '1fr', '1fr']))
  const selectedCells = reactive<Set<Cell>>(new Set())

  /**
   * 处理单元格点击
   * @param cell 单元格
   */
  function handleCellClick(cell: Cell) {
    if (selectedCells.has(cell)) {
      selectedCells.delete(cell)
    } else {
      selectedCells.add(cell)
    }
  }

  /**
   * 处理输出点击
   */
  function handleOutputClick() {
    navigator.clipboard.writeText(grid.css)
    ElMessage.success('CSS copied to clipboard')
  }
</script>

<template>
  <div class="d-grid h-100vh column-gap-10" style="grid-template-columns: 1fr 60px; background-color: #f9f9f9">
    <div class="d-grid h-100 p-20 bg-white" style="grid-template-columns: 200px 1fr; grid-template-rows: 60px 1fr">
      <div></div>
      <div class="d-grid justify-items-center align-items-center" :style="{ gridTemplateColumns: grid.columns.join(' ') }">
        <div v-for="(a, i) of grid.columns" :key="i">
          <div class="input">
            <div class="f-bold">C-{{ i + 1 }}</div>
            <div class="m-l-10" style="width: 80px"><el-input v-model="grid.columns[i]" /></div>
            <img class="m-l-10 cursor-pointer" style="height: 16px" src="./images/cross.svg" @click="grid.removeDimension('c', i)" />
          </div>
        </div>
      </div>
      <div
        class="d-grid justify-items-center align-items-center"
        :style="{
          gridTemplateRows: grid.rows.join(' ')
        }"
      >
        <div v-for="(a, i) of grid.rows" :key="i">
          <div class="input">
            <div class="f-bold">R-{{ i + 1 }}</div>
            <div class="m-l-10" style="width: 80px"><el-input v-model="grid.rows[i]" /></div>
            <img class="m-l-10 cursor-pointer" style="height: 16px" src="./images/cross.svg" @click="grid.removeDimension('r', i)" />
          </div>
        </div>
      </div>
      <div>
        <div
          class="d-grid w-100 h-100"
          :style="{
            gridTemplateColumns: grid.columns.join(' '),
            gridTemplateRows: grid.rows.join(' ')
          }"
        >
          <div
            v-for="a of grid.cells"
            :key="a.index"
            class="cell d-flex flex-column justify-content-center align-items-center cursor-pointer"
            :class="{ selected: selectedCells.has(a) }"
            style="color: hsl(160.55, 98.8%, 43.03%); border: 2px dashed currentColor"
            :style="a.style"
            @click="handleCellClick(a)"
          >
            <div style="font-size: 40px">{{ a.index + 1 }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex flex-column align-items-center h-100 p-h-10 p-v-20 bg-white">
      <div class="f-28 cursor-pointer" @click="grid.addDimension('r', '1fr')">+R</div>
      <div class="m-t-15 f-28 cursor-pointer" @click="grid.addDimension('c', '1fr')">+C</div>
      <div class="w-100 b-t-grayE m-v-15"></div>
      <el-tooltip effect="dark" content="Copy CSS to clipboard" placement="top-start">
        <img class="m-t-auto cursor-pointer" style="width: 50%" src="./images/sharp.svg" @click="handleOutputClick" />
      </el-tooltip>
    </div>
  </div>
</template>

<style scoped lang="scss">
  .input {
    display: inline-flex;
    align-items: center;
    padding: 0 10px;
    border-left: 2px solid #eee;
    border-right: 2px solid #eee;
  }
  .cell {
    &.selected {
      background-color: hsla(160.55, 98.8%, 43.03%, 0.3);
    }
  }
</style>
