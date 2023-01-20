import { pull, sortBy } from 'lodash-es'

/**
 * 网格
 */
class Grid {
  rows: string[] = []
  columns: string[] = []
  cells: Cell[] = []

  get style() {
    return `grid-template-rows: ${this.rows.join(' ')}; grid-template-columns: ${this.columns.join(' ')};`
  }
  get css() {
    return [`.grid { display: grid; ${this.style} }`, ...this.cells.map(a => a.css)].join('\n')
  }

  /**
   * 构造方法
   * @param rows 行
   * @param columns 列
   */
  constructor(rows: string[], columns: string[]) {
    this.rows = rows
    this.columns = columns

    for (let i = 0; i < this.rows.length; i++) {
      for (let j = 0; j < this.columns.length; j++) {
        this.cells.push(new Cell(i + 1, i + 2, j + 1, j + 2))
      }
    }

    this.arrange()
  }

  /**
   * 添加维度
   * @param dimension 维度
   * @param value 值
   */
  addDimension(dimension: GridDimension, value: string) {
    if (dimension == 'r') {
      this.rows.push(value)

      for (let i = 0; i < this.columns.length; i++) {
        this.cells.push(new Cell(this.rows.length, this.rows.length + 1, i + 1, i + 2))
      }
    } else if (dimension == 'c') {
      this.columns.push(value)

      for (let i = 0; i < this.rows.length; i++) {
        this.cells.push(new Cell(i + 1, i + 2, this.columns.length, this.columns.length + 1))
      }
    }

    this.arrange()
  }
  /**
   * 删除维度
   * @param dimension 维度
   * @param index 索引
   */
  removeDimension(dimension: GridDimension, index: number) {
    let start = index + 1
    let end = index + 2
    let deleting = []

    if (dimension == 'r') {
      this.rows.splice(index, 1)

      for (let a of this.cells) {
        if (a.rowStart === start && a.rowEnd === end) {
          deleting.push(a)
        } else {
          if (a.rowStart > start) {
            a.rowStart--
          }
          if (a.rowEnd >= end) {
            a.rowEnd--
          }
        }
      }
    } else if (dimension == 'c') {
      this.columns.splice(index, 1)

      for (let a of this.cells) {
        if (a.columnStart === start && a.columnEnd === end) {
          deleting.push(a)
        } else {
          if (a.columnStart > start) {
            a.columnStart--
          }
          if (a.columnEnd >= end) {
            a.columnEnd--
          }
        }
      }
    }

    for (let a of deleting) {
      this.cells.splice(this.cells.indexOf(a), 1)
    }

    this.arrange()
  }
  /**
   * 合并单元格
   * @param cells 单元格
   */
  combineCells(cells: Cell[]) {
    let minRowStart = Math.min(...Array.from(cells).map(a => a.rowStart))
    let minColumnStart = Math.min(...Array.from(cells).map(a => a.columnStart))
    let maxRowEnd = Math.max(...Array.from(cells).map(a => a.rowEnd))
    let maxColumnEnd = Math.max(...Array.from(cells).map(a => a.columnEnd))

    let origin = this.cells.find(a => a.rowStart == minRowStart && a.columnStart == minColumnStart)
    if (origin) {
      this.cells.splice(this.cells.indexOf(origin), 1, new Cell(minRowStart, maxRowEnd, minColumnStart, maxColumnEnd))
    }
    for (let a of cells) {
      pull(this.cells, a)
    }

    this.arrange()
  }
  /**
   * 分解单元格
   * @param cell 单元格
   */
  separateCell(cell: Cell) {
    let array: Cell[] = []
    for (let i = cell.rowStart; i < cell.rowEnd; i++) {
      for (let j = cell.columnStart; j < cell.columnEnd; j++) {
        array.push(new Cell(i, i + 1, j, j + 1))
      }
    }

    this.cells.splice(this.cells.indexOf(cell), 1, ...array)

    this.arrange()
  }

  /**
   * 安排
   */
  private arrange() {
    this.cells = sortBy(this.cells, ['rowStart', 'columnStart'])
    for (let i = 0; i < this.cells.length; i++) {
      this.cells[i].index = i
    }
  }
}

type GridDimension = 'r' | 'c'

/**
 * 单元
 */
class Cell {
  index: number
  rowStart: number
  rowEnd: number
  columnStart: number
  columnEnd: number

  get combined() {
    return this.rowEnd - this.rowStart > 1 || this.columnEnd - this.columnStart > 1
  }

  get style() {
    return `grid-area: ${this.rowStart} / ${this.columnStart} / ${this.rowEnd} / ${this.columnEnd};`
  }
  get css() {
    return `.cell-${this.index} { ${this.style} }`
  }

  /**
   * 构造方法
   * @param rowStart 行起始
   * @param rowEnd 行结束
   * @param columnStart 列起始
   * @param columnEnd 列结束
   * @param index 索引
   */
  constructor(rowStart: number, rowEnd: number, columnStart: number, columnEnd: number, index?: number) {
    this.rowStart = rowStart
    this.rowEnd = rowEnd
    this.columnStart = columnStart
    this.columnEnd = columnEnd
    this.index = index ?? 0
  }
}

export { Grid as default, Cell }
export type { GridDimension }
