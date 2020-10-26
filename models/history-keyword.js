class HistoryKeyWord{
  static MAX_ITEM_COUNT = 20
  static KEY = 'keywords'
  keywords = []

  constructor(){
    // 单例模式：判断是否实例化过
    if(typeof HistoryKeyWord.instance === 'object'){
      return this
    }
    this.keywords = this._getLocalKeywords()
    // 把实例化的对象赋给标示
    HistoryKeyWord.instance = this
    return this
  }

  save(keyword){
    const items = this.keywords.filter(k => k === keyword)
    if (items.length !== 0) return
    if (this.keywords.length >= HistoryKeyWord.MAX_ITEM_COUNT) {
      this.keywords.pop()
    }
    this.keywords.unshift(keyword)

    this._refreshLocal()
  }

  get(){
    return this.keywords
  }

  clear(){
    this.keywords = []
    this._refreshLocal()
  }

  _refreshLocal(){
    wx.setStorageSync(HistoryKeyWord.KEY, this.keywords)
  }

  _getLocalKeywords(){
    const keywords = wx.getStorageSync(HistoryKeyWord.KEY)
    if(!keywords){
      wx.setStorageSync(HistoryKeyWord.KEY, [])
      return []
    }
    return keywords
  }
}

export {
  HistoryKeyWord
}