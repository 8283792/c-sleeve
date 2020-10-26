import { Theme } from "../../models/theme"
import { Banner } from "../../models/banner"
import { Category } from "../../models/category"
import { Activity } from "../../models/activity"
import { SpuPaging } from "../../models/spu-paging"

// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    themeA: null,
    bannerB: null,
    gridC: [],
    activityD: null,
    themeE: null,
    themeF: null,
    themeH: null,
    bannerG: null,
    themeESpu: [],
    spuPaging: null,
    loadingType: 'loading'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.initAllData()
    this.initBottomSpuList()
  },

  /**
   * 初始化底部SPU列表数据
   */
  async initBottomSpuList() {
    const paging = SpuPaging.getLatestPaging()
    this.data.spuPaging = paging
    const data = await paging.getMoreData()
    if(!data) return
    wx.lin.renderWaterFlow(data.items)
  },

  /**
   * 初始化所有数据
   */
  async initAllData() {
    const theme = new Theme()
    await theme.getThemes()
    const themeA = theme.getHomeLocationA()
    const themeE = theme.getHomeLocationE()
    const themeF = theme.getHomeLocationF()
    const themeH = theme.getHomeLocationH()
    
    let themeESpu = []
    if (themeE.online) {
      const data = await Theme.getHomeLocationESpu()
      if (data) {
        themeESpu = data.spu_list.slice(0, 8)
      }
    }
    

    const bannerB = await Banner.getHomeLocationB()
    const bannerG = await Banner.getHomeLocationG()

    const categoryC = await Category.getHomeLocationC()
    const activityD = await Activity.getHomeLocationD()

    this.setData({
      themeA,
      bannerB,
      gridC: categoryC,
      activityD,
      themeE,
      themeF,
      themeH,
      bannerG,
      themeESpu
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: async function () {
    const data = await this.data.spuPaging.getMoreData()
    if(!data) return
    wx.lin.renderWaterFlow(data.items)
    if(!data.moreData){
      this.setData({
        loadingType: 'end'
      })
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})