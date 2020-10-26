import { Http } from "./http"

class Paging {
  req
  start
  count
  // 数据锁 ture：锁住 false：打开
  locker = false
  url
  moreData = true
  accumulator = []

  constructor(req, count=10, start=0){
    this.req = req
    this.start = start
    this.count = count
    this.url = req.url
  }

  // 获取更多数据
  async getMoreData(){
    if(!this.moreData) return
    if(!this._getLocker) return
    const data = await this._actualGetData()
    this._releaseLocker()
    return data
  }

  // 获取数据
  async _actualGetData(){
    const req = this._getCurrentReq()
    const data = await Http.request(req)
    const paging = data.data
    if (!paging) return null
    /**
     * empty: 数据为空
     * moreData: 更多数据
     * items: 当前请求数据
     * accumulator: 累加的数据
     */
    if (paging.total === 0) {
      return {
        empty: true,
        moreData: false,
        items: [],
        accumulator: []
      }
    }
    this.moreData = Paging._moreData(paging.total_page, paging.page)
    if (this.moreData) {
      this.start += this.count
    }
    this._accumulator(paging.items)
    return {
      empty: false,
      moreData: this.moreData,
      items: paging.items,
      accumulator: this.accumulator
    }
  }

  // 获取累加数据
  _accumulator(items){
    this.accumulator = this.accumulator.concat(items)  
  }

  // 判断是否有更多数据
  static _moreData(pageTotal, pageNum){
    return pageNum < pageTotal - 1
  }

  // 获取目标请求
  _getCurrentReq(){
    let url = this.url
    const params = `start=${this.start}&count=${this.count}`
    if (url.includes('?')) {
      url += '&' + params
    } else {
      url += '?' + params
    }
    this.req.url = url
    return this.req
  }

  // 获取数据锁
  _getLocker(){
    if (this.locker) {
      return false
    }
    this.locker = true
    return true
  }

  // 释放数据锁
  _releaseLocker(){
    this.locker = false
  }
}

export {
  Paging
}