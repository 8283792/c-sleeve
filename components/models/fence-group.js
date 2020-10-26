import { Matrix } from "./matrix"
import { Fence } from './fence'

class FenceGroup{
  spu
  skuList = []
  fences = []

  constructor(spu){
    this.spu = spu
    this.skuList = spu.sku_list
  }

  getSku(skuCode){
    const fullskuCode = `${this.spu.id}$${skuCode}`
    const sku = this.skuList.find(sku => {
      return sku.code === fullskuCode
    })
    return sku ? sku : null
  }

  setCellStatusById(cellId, status){
    this.eachCells((cell) => {
      if(cell.id === cellId) {
        cell.status = status
      }
    })
  }

  setCellStatusByXY(x,y,status){
    this.fences[x].cells[y].status = status
  }

  getDefaultSku(){
    const defaultSkuId = this.spu.default_sku_id
    if(!defaultSkuId) return
    return this.skuList.find(s => s.id === defaultSkuId)
  }

  initFences(){
    if(!this.skuList) return
    const matrix = this._createMatrix(this.skuList)
    const fences = []
    const AT = matrix.transpose()
    AT.forEach(r => {
      const fence = new Fence(r)
      fence.init()
      if (this._hasSketchFence() && this._isSketchFence(fence.id)) {
        fence.setFenceSketch(this.skuList)
      }
      fences.push(fence)
    })
    this.fences = fences
    // console.log(fences)
  }

  eachCells(callback){
    for(let i=0;i<this.fences.length;i++){
      for(let j=0;j<this.fences[i].cells.length;j++){
        const cell = this.fences[i].cells[j]
        callback(cell, i, j)
      }
    }
  }

  // 判断是否有可视规格
  // 通过‘sketch_spec_id’是否有值，来判断是否有可视规格
  _hasSketchFence(){
    return this.spu.sketch_spec_id ? true : false
  }

  // 判断是否是可视规格
  _isSketchFence(fenceId){
    return this.spu.sketch_spec_id === fenceId ? true : false
  }

  // initFences1(){
  //   const matrix = this._createMatrix(this.skuList)
  //   // matrix.transpose()
  //   const fences = []
  //   let currentJ = -1 // 区分类型改变分界点
  //   matrix.each((element, i, j) => {
  //     if(currentJ !== j) {
  //       // 开启新列
  //       currentJ = j
  //       fences[currentJ] = this._createFence(element)
  //     }
  //     fences[currentJ].pushValueTitle(element.value)
  //   })
  //   // console.log(fences)
  // }

  // _createFence(element){
  //   const fence = new Fence()
  //   return fence
  // }

  _createMatrix(skuList){
    const m = []
    skuList.forEach(sku => {
      m.push(sku.specs)
    })
    return new Matrix(m)
  }
}

export {
  FenceGroup
}