import { Cell } from "./cell";
import { Joiner } from "../../utils/joiner";

class SkuPending{
  pending = []
  size

  constructor(size){
    this.size = size
  }

  init(sku){
    this.size = sku.specs.length
    for (let i = 0; i < sku.specs.length; i++) {
      const cell = new Cell(sku.specs[i])
      this.insertCell(cell, i)
    }
  }

  // 获取当前规格值
  getCurrentSpecValue(){
    const value = this.pending.map(cell => {
      return cell ? cell.spec.value : null
    })

    return value
  }

  // 获取未选规格名
  getMissingSpecKeysIndex(){
    const keysIndex = []
    for (let i = 0; i < this.size; i++) {
      if(!this.pending[i]){
        keysIndex.push(i)
      }
    }
    return keysIndex
  }

  // 判断是否已选择完整sku
  isIntact(){
    if(this.size !== this.pending.length){
      return false
    }
    for (let i = 0; i < this.size; i++) {
      if(this._isEmptyPart(i)){
        return false
      }
    }
    return true
  }

  getSkuCode(){
    const joiner = new Joiner('#')
    this.pending.forEach(cell => {
      const cellCode = cell.getCellCode()
      joiner.join(cellCode)
    })
    return joiner.getStr()
  }

  _isEmptyPart(idx){
    return this.pending[idx] ? false : true
  }

  insertCell(cell, x){
    this.pending[x] = cell
  }

  removeCell(x){
    this.pending[x] = null
  }

  findSelectedCellByX(x){
    return this.pending[x]
  }

  isSelected(cell, x){
    const pendingCell = this.pending[x]
    if (!pendingCell) return false
    return pendingCell.id === cell.id
  }
}

export {
  SkuPending
}