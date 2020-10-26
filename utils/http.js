import {config} from '../config/config'
import {promisic} from '../utils/utils'

class Http {
  static async request({url, data, method='GET'}){
    return await promisic(wx.request)({
      url: config.apiBaseUrl+url,
      data,
      method,
      header: {
        'appkey': config.appkey,
        'clientkey': config.clientkey
      }
    })
  }
}

export {
  Http
}