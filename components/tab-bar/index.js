// components/tab-bar/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    onGoHome(){
      this.triggerEvent('gotohome')
    },
    onGoCart(){
      this.triggerEvent('gocart')
    },
    onAddToCart(){
      this.triggerEvent('addtocart')
    },
    onBuy(){
      this.triggerEvent('buy')
    }
  }
})
