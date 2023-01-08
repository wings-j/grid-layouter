/**
 * 网格
 */
class Grid {
  rows: Dimension[] = []
  columns: Dimension[] = []

  get css() {
    return `.container {
  display: grid;
  grid-template-rows: ${this.rows.map(a => a.token).join(' ')};
  grid-template-columns: ${this.columns.map(a => a.token).join(' ')};
}`
  }

  /**
   * 添加
   * @param dimension 维度
   * @param type 类型
   * @param value 值
   */
  addDimension(dimension: GridDimension, type: DimensionType, value?: number) {
    let d = new Dimension(type, value)
    if (dimension == 'row') {
      this.rows.push(d)
    } else if (dimension == 'column') {
      this.columns.push(d)
    }
  }
}

type GridDimension = 'row' | 'column'

/**
 * 维度
 */
class Dimension {
  type: DimensionType
  value?: number

  get token() {
    switch (this.type) {
      case 'px':
        return `${this.value}px`
      case 'fr':
        return `${this.value}fr`
      default:
        return 'auto'
    }
  }

  /**
   * 构造方法
   * @param type 类型
   * @param value 值
   */
  constructor(type: DimensionType, value?: number) {
    this.type = type
    this.value = value
  }
}

type DimensionType = 'fr' | 'px' | 'auto'

export { Grid as default, Dimension }
