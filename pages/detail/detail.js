import { Spu } from "../../models/spu"
import { ShoppingWay } from "../../core/enum"
import { SaleExplain } from "../../models/sale-explain"
import { getWindowHeightRpx } from '../../utils/system'

// pages/detail/detail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showReaml: false,
    orderWay: null,
    specs: Object,
    explain: Array
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const pid = options.pid
    const spu = await Spu.getDetail(pid)
    const explain = await SaleExplain.getFixed()

    this.setData({
      spu: spu.data,
      explain
    })
    this.getContainerH()
  },

  onGotoHome(){
    wx.switchTab({
      url: '/pages/home/home'
    })
      
  },
  onGotoCart(){
    wx.switchTab({
      url: '/pages/cart/cart'
    })
  },
  onAddToCart(event){
    this.setData({
      showReaml: true,
      orderWay: ShoppingWay.CART
    })
  },
  onBuy(event){
    this.setData({
      showReaml: true,
      orderWay: ShoppingWay.BUY
    })
  },
  onSpecChange(event){
    this.setData({
      specs: event.detail
    })
  },
  async getContainerH(){
    const h = await getWindowHeightRpx() - 100
    this.setData({
      h
    })
    console.log(h)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})