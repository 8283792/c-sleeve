// pages/search/search.js
import { HistoryKeyWord } from '../../models/history-keyword'
import { Tag } from '../../models/tag'
import { Search } from '../../models/search'
import { showToast } from '../../utils/ui'

const history = new HistoryKeyWord()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    historyTags: Array,
    hotTags: Array,
    items: Array
  },

  async onSearch(event){
    this.setData({
      search: true,
      items: []
    })
    const keywords = event.detail.value || event.detail.name
    if(!keywords) {
      showToast('请输入关键字')
      return
    }
    history.save(keywords)
    this.setData({
      historyTags: history.get()
    })

    const paging = Search.search(keywords)
    wx.lin.showLoading({
      color: '#157658',
      type: 'flash',
      fullScreen: true
    })
    const data = await paging.getMoreData()
    wx.lin.hideLoading()
    this.bindItems(data)
  },

  onCancel(){
    this.setData({
      search: false
    })
  },

  bindItems(data){
    if(data.accumulator !== 0){
      this.setData({
        items: data.accumulator
      })
    }
  },
  onDeleteHistory(event){
    wx.lin.showDialog({
      type: 'confirm',     
      title: '确认',
      content: '确认清空？',
      success: (res) => {
        if (res.confirm) {
          history.clear()
          this.setData({
            historyTags: history.get()
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: async function (options) {
    const historyTags = history.get()
    const hotTags = await Tag.getSearchTags()
    this.setData({
      historyTags,
      hotTags: hotTags.data
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  }
})