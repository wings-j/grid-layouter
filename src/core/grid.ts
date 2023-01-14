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
    return `.grid { display: grid; ${this.style} }`
  }

  /**
   * 构造方法
   * @param rows 行
   * @param columns 列
   */
  constructor(rows: string[], columns: string[]) {
    this.rows = rows
    this.columns = columns

    let index = 0
    for (let i = 0; i < this.rows.length; i++) {
      for (let j = 0; j < this.columns.length; j++) {
        this.cells.push(new Cell(index++, i + 1, i + 2, j + 1, j + 2))
      }
    }
  }

  /**
   * 添加
   * @param dimension 维度
   * @param value 值
   */
  addDimension(dimension: GridDimension, value: string) {
    if (dimension == 'r') {
      this.rows.push(value)
    } else if (dimension == 'c') {
      this.columns.push(value)
    }

    this.arrange()
  }
  /**
   * 删除
   * @param dimension 维度
   * @param index 索引
   */
  removeDimension(dimension: GridDimension, index: number) {
    if (dimension == 'r') {
      this.rows.splice(index, 1)
    } else if (dimension == 'c') {
      this.columns.splice(index, 1)
    }

    this.arrange()
  }
  /**
   * 合并单元格
   * @param cells 单元格
   */
  combineCells(cells: Cell[]) {}
  /**
   * 合并单元格
   * @param cell 单元格
   */
  separateCells(cell: Cell) {}

  /**
   * 安排
   */
  private arrange() {}
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

  get style() {
    return `grid-area: ${this.rowStart} / ${this.columnStart} / ${this.rowEnd} / ${this.columnEnd}`
  }
  get css() {
    return `.cell-${this.index} { ${this.style} }`
  }

  /**
   * 构造方法
   * @param index 索引
   * @param rowStart 行起始
   * @param rowEnd 行结束
   * @param columnStart 列起始
   * @param columnEnd 列结束
   */
  constructor(index: number, rowStart: number, rowEnd: number, columnStart: number, columnEnd: number) {
    this.index = index
    this.rowStart = rowStart
    this.rowEnd = rowEnd
    this.columnStart = columnStart
    this.columnEnd = columnEnd
  }
}

export { Grid as default, Cell }
