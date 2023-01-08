/**
 * 网格
 */
class Grid {
  rows: Dimension[] = []
  columns: Dimension[] = []

  get style() {
    return `display: grid;
grid-template-rows: ${this.rows
      .map(a => {
        switch (a.type) {
          case 'px':
            return `${a.value}px`
          case 'fr':
            return `${a.value}fr`
          default:
            return 'auto'
        }
      })
      .join(' ')};
grid-template-columns: ${this.columns
      .map(a => {
        switch (a.type) {
          case 'px':
            return `${a.value}px`
          case 'fr':
            return `${a.value}fr`
          default:
            return 'auto'
        }
      })
      .join(' ')};`
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

type DimensionType = 'px' | 'fr' | 'auto'

export { Grid as default, Dimension }
