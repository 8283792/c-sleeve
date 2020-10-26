// pages/category/category.js
import { getWindowHeightRpx } from '../../utils/system'
import { CateGories } from '../../models/categories'
import { SpuListType } from '../../core/enum'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    segHeight: Number,
    defaultRootId: 2,
    roots: Array,
    currentSubs: Array,
    currentBannerImg: String
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setDynamicSegmentHeight()
    this.initCategoriesData()
  },

  getDefaultRoot(roots){
    let defaultRoot = roots.find(r => r.id === this.data.defaultRootId) || roots[0]
    return defaultRoot
  },

  // 初始化分类
  async initCategoriesData(){
    const categories = new CateGories()
    await categories.getAll()

    this.data.categories = categories
    const roots = categories.getRoots()
    const defaultRoot = this.getDefaultRoot(roots)
    const currentSubs = categories.getSubs(defaultRoot.id)

    this.setData({
      roots,
      currentSubs,
      currentBannerImg: defaultRoot.img
    })
  },

  // 动态设置内容高度
  async setDynamicSegmentHeight(){
    const h = await getWindowHeightRpx() - 60 - 20 -2
    this.setData({
      segHeight: h
    })
  },

  onSegChange(event){
    const rootId = Number(event.detail.activeKey)
    const currentSubs = this.data.categories.getSubs(rootId)
    const currentRoot = this.data.categories.getRoot(rootId)

    this.setData({
      currentSubs,
      currentBannerImg: currentRoot.img
    })
  },

  onJumpToSpuList(event){
    const cid = event.detail.id
    wx.navigateTo({
      url: `/pages/spu-list/spu-list?cid=${cid}&type=${SpuListType.SUB_CATEGORY}`
    })
  },

  onGotoSearch(){
    wx.navigateTo({
      url: '/pages/search/search'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  }
})