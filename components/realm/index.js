// components/realm/index.js
import { FenceGroup } from '../models/fence-group'
import { Judger } from '../models/judger'
import { Spu } from '../../models/spu'
import { Cell } from '../models/cell'
import { Cart } from '../../models/cart'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    spu: Object,
    orderWay: String
  },

  observers: {
    spu(spu){
      if(!spu) return
      // 无规格
      if(Spu.isNoSpec(spu)){
        this.processNoSpec(spu)
      }else{
        this.processHasSpec(spu)
      }
      this.triggerSpecEvent()
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    fences: Array,
    judger: Object,
    previewImg: String,
    title: String,
    price: Number,
    discountPrice: Number,
    noSpec: Boolean, // 无规格
    skuIntact: Boolean, // 是否完整Sku
    outStock: Boolean, // 是否超出库存
    currentSkuCount: Cart.SKU_MIN_COUNT,
    missingKeys: String,
    currentValues: String
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindFenceGroupData(fenceGroup){
      this.setData({
        fences: fenceGroup.fences
      })
    },
    bindSpuData(){
      const spu = this.properties.spu
      this.setData({
        previewImg: spu.img,
        title: spu.title,
        price: spu.price,
        discountPrice: spu.discount_price
      })
    },
    bindSkuData(sku){
      this.setData({
        previewImg: sku.img,
        title: sku.title,
        price: sku.price,
        discountPrice: sku.discount_price,
        stock: sku.stock
      })
    },
    // 判断是否是选择的完整sku
    bindTipData(){
      const judger = this.data.judger
      this.setData({
        skuIntact: judger.isSkuIntact(),
        currentValues: judger.getCurrentValues(),
        missingKeys: judger.getMissingKeys()
      })
    },
    // 无规格情况
    processNoSpec(spu){
      // const defaultSku = spu.sku_list[0]
      // const fenceGroup = new FenceGroup(defaultSku)
      // fenceGroup.initFences()

      this.setData({
        noSpec: true
      })
      this.bindSkuData(spu.sku_list[0])
      this.setStockStatus(spu.sku_list[0].stock)
    },
  
    // 有规格情况
    processHasSpec(spu){
      const fenceGroup = new FenceGroup(spu)
      fenceGroup.initFences()
      // fenceGroup.initFences1()
      this.data.judger = new Judger(fenceGroup)
  
      const defaultSku = fenceGroup.getDefaultSku()
      if(defaultSku){
        this.bindSkuData(defaultSku)
        this.setStockStatus(defaultSku.stock)
      }
      else {
        this.bindSpuData()
      }
      this.bindTipData()
      this.bindFenceGroupData(fenceGroup)
    },

    // 选择多少件
    onSelectCount(event){
      const currentCount = event.detail.count
      this.data.currentSkuCount = currentCount
      const judger = this.data.judger
      if(judger.isSkuIntact()){
        const sku = judger.getDeterminateSku()
        this.setStockStatus(sku.stock)
      }
    },
    // 设置是否超出库存
    setStockStatus(stock){
      this.setData({
        outStock: this.isOutOfStock(stock, this.data.currentSkuCount)
      })
    },
    // 判断是否超出库存
    isOutOfStock(stock, currentCount){
      return stock < currentCount
    },
    onCellTap(event){
      const x = event.detail.x
      const y = event.detail.y
      const data = event.detail.cell

      const cell = new Cell(data.spec)
      // 因为新建了Cell，要把Cell正确的状态赋值
      cell.status = data.status
      const judger = this.data.judger
      judger.judge(cell, x, y)
      const skuIntact = judger.isSkuIntact()
      if(skuIntact){
        // 当前完整的sku
        const currentSku = judger.getDeterminateSku()
        this.bindSkuData(currentSku)
        this.setStockStatus(currentSku.stock)
      }

      this.bindTipData()
      this.bindFenceGroupData(judger.fenceGroup)

      this.triggerSpecEvent()
    },
    // 抛出数据
    triggerSpecEvent(){
      console.log(this.data.judger)
      const noSpec = Spu.isNoSpec(this.properties.spu)
      if(noSpec){
        this.triggerEvent('specchange', {
          noSpec
        })
      } else {
        this.triggerEvent('specchange', {
          noSpec,
          skuIntact: this.data.skuIntact,
          missingKeys: this.data.missingKeys,
          currentValues: this.data.currentValues
        })
      }
    }
  }
})
