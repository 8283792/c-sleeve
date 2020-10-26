import { SkuCode } from "./sku-code"
import { CellStatus } from "../../core/enum"
import { SkuPending } from "./sku-pending"
import { Joiner } from "../../utils/joiner"

class Judger {
  fenceGroup
  pathDict = []
  skuPending

  constructor(fenceGroup){
    this.fenceGroup = fenceGroup
    this.initPathDict()
    this._initSkuPending()
  }

  // 获取选中的sku值
  getCurrentValues(){
    return this.skuPending.getCurrentSpecValue()
  }

  // 获取未选中的sku名
  getMissingKeys(){
    const missingKeysIndex = this.skuPending.getMissingSpecKeysIndex()
    return missingKeysIndex.map(i => {
      return this.fenceGroup.fences[i].title
    })
  }

  // 是否是完整的sku
  isSkuIntact(){
    return this.skuPending.isIntact()
  }

  // 获取完整的Sku
  getDeterminateSku(){
    const code = this.skuPending.getSkuCode()
    const sku = this.fenceGroup.getSku(code)
    return sku
  }

  _initSkuPending(){
    const specsLength = this.fenceGroup.fences.length
    this.skuPending = new SkuPending(specsLength)
    const defaultSku = this.fenceGroup.getDefaultSku()
    if(!defaultSku) return
    this.skuPending.init(defaultSku)
    this.judge(null, null, null, true)
    
    this._initSelectedCell()
  }

  _initSelectedCell(){
    this.skuPending.pending.forEach(p => {
      this.fenceGroup.setCellStatusById(p.id, CellStatus.SELECTED)
    })
  }

  // 初始化路径字典
  initPathDict(){
    this.fenceGroup.spu.sku_list.forEach(s => {
      const skuCode = new SkuCode(s.code)
      this.pathDict = this.pathDict.concat(skuCode.totalSegments)
    })
  }

  judge(cell, x, y, isInit=false){
    if(!isInit){
      this._changeCurrentCellStatus(cell, x, y)
    }
    
    this.fenceGroup.eachCells((cell, x, y) => {
      const path = this._findPotentialPath(cell, x, y)
      // 判断如果cell选中，不更改状态
      if (this.skuPending.isSelected(cell, x)) return
      const isIn = this._isInDict(path)
      if(isIn){
        cell.status = CellStatus.WAITING
      } else {
        cell.status = CellStatus.FORBIDDEN
      }
    })
  }

  _getCellCode(spec){
    return `${spec.key_id}-${spec.value_id}`
  }

  // 字典是否包含可选路径
  _isInDict(path){
    return this.pathDict.includes(path)
  }

  // 查找所有cell的可选路径
  // * 判断依据：当前cell与其他行选中cell的路径就是可选路径
  _findPotentialPath(cell, x, y){
    const joiner = new Joiner('#')

    for (let i = 0; i < this.fenceGroup.fences.length; i++) {
      const selected = this.skuPending.findSelectedCellByX(i)

      // 判断是否为当前行
      if(x === i){
        // 判断当前行的选中cell，那就不放入可选路径数组，直接返回
        if (this.skuPending.isSelected(cell, x)) return
        const cellCode = this._getCellCode(cell.spec)
        joiner.join(cellCode)
      } else {
        // 其他行选中cell
        if (selected) {
          const selectedCellCode = this._getCellCode(selected.spec)
          joiner.join(selectedCellCode)
        }
      }
    }
    return joiner.getStr()
  }

  // 改变选中cell的状态
  _changeCurrentCellStatus(cell, x, y){
    if (cell.status === CellStatus.WAITING) {
      this.fenceGroup.setCellStatusByXY(x,y,CellStatus.SELECTED)
      this.skuPending.insertCell(cell, x)
    } else if (cell.status === CellStatus.SELECTED) {
      this.fenceGroup.setCellStatusByXY(x,y,CellStatus.WAITING)
      this.skuPending.removeCell(x)
    }
  }
}

export {
  Judger
}