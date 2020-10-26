// components/hot-list/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    banner: Object
  },

  observers: {
    'banner': function (n, o){
      if(!n || !n.items.length) return
      const items = n.items

      const leftItem = items.find(i => i.name === 'left')
      const rightTopItem = items.find(i => i.name === 'right-top')
      const rightBottomItem = items.find(i => i.name === 'right-bottom')

      this.setData({
        leftItem,
        rightTopItem,
        rightBottomItem
      })
    }
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

  }
})
