import { Http } from "../utils/http"

class Banner {
  static locationB = 'b-1'
  static locationG = 'b-2'
  static async getHomeLocationB(){
    const data = await Http.request({
      url: `/banner/name/${Banner.locationB}`
    })
    return data.data
  }

  static async getHomeLocationG(){
    const data = await Http.request({
      url: `/banner/name/${Banner.locationG}`
    })
    return data.data
  }
}

export {
  Banner
}