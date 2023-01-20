<script setup lang="ts">
  import Grid, { Cell } from '@/core/grid'
  import { ElInput, ElMessage, ElTooltip } from 'element-plus'
  import { computed, reactive } from 'vue'

  const grid = reactive(new Grid(['1fr', '1fr', '1fr'], ['1fr', '1fr', '1fr']))
  const selectedCells = reactive<Set<Cell>>(new Set())
  const selectedValid = computed(() => {
    if (selectedCells.size === 0) {
      return false
    }

    let minRowStart = Math.min(...Array.from(selectedCells).map(a => a.rowStart))
    let minColumnStart = Math.min(...Array.from(selectedCells).map(a => a.columnStart))
    let maxRowEnd = Math.max(...Array.from(selectedCells).map(a => a.rowEnd))
    let maxColumnEnd = Math.max(...Array.from(selectedCells).map(a => a.columnEnd))
    let frameArea = (maxRowEnd - minRowStart) * (maxColumnEnd - minColumnStart)

    let totalArea = 0
    for (let a of selectedCells) {
      totalArea += (a.rowEnd - a.rowStart) * (a.columnEnd - a.columnStart)
      if (a.rowStart < minRowStart || a.rowEnd > maxRowEnd || a.columnStart < minColumnStart || a.columnEnd > maxColumnEnd) {
        return false
      }
    }

    return totalArea === frameArea
  })

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
   * 处理合并点击
   */
  function handleCombineCellClick() {
    grid.combineCells(Array.from(selectedCells))

    selectedCells.clear()
  }
  /**
   * 处理分离点击
   */
  function handleSeparateCellClick() {
    grid.separateCell(Array.from(selectedCells)[0])

    selectedCells.clear()
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
            <div class="f-bold t-nowrap">C-{{ i + 1 }}</div>
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
            <div class="f-bold t-nowrap">R-{{ i + 1 }}</div>
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
            :class="{ selected: selectedCells.has(a), valid: selectedValid }"
            :style="a.style"
            @click="handleCellClick(a)"
          >
            <div style="font-size: 40px">{{ a.index + 1 }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex flex-column align-items-center h-100 p-h-10 p-v-20 bg-white">
      <el-tooltip effect="dark" content="Add a row" placement="left">
        <div class="f-24 cursor-pointer" @click="grid.addDimension('r', '1fr')">+R</div>
      </el-tooltip>
      <el-tooltip effect="dark" content="Add a column" placement="left">
        <div class="m-t-15 f-24 cursor-pointer" @click="grid.addDimension('c', '1fr')">+C</div>
      </el-tooltip>
      <div class="w-100 b-t-grayE m-v-15"></div>
      <el-tooltip effect="dark" content="Combine" placement="left">
        <img
          class="cursor-pointer"
          :class="{ 'pointer-events-none opacity-4': selectedCells.size <= 1 || !selectedValid }"
          style="width: 50%"
          src="./images/combine.svg"
          @click="handleCombineCellClick"
        />
      </el-tooltip>
      <el-tooltip effect="dark" content="Separate" placement="left">
        <img
          class="m-t-20 cursor-pointer"
          :class="{ 'pointer-events-none opacity-4': selectedCells.size !== 1 || !Array.from(selectedCells)[0].combined }"
          style="width: 50%"
          src="./images/separate.svg"
          @click="handleSeparateCellClick"
        />
      </el-tooltip>
      <el-tooltip effect="dark" content="Copy CSS to clipboard" placement="left">
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
    --blue: rgb(1, 193, 218);
    --red: rgb(253, 90, 131);
    --green: rgb(0, 235, 137);

    color: var(--blue);
    border: 2px dashed currentColor;

    &.selected {
      color: white;
      border: 2px dashed var(--red);
      background-color: var(--red);

      &.valid {
        border: 2px dashed var(--green);
        background-color: var(--green);
      }
    }
  }
</style>
