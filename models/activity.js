import { Http } from "../utils/http"

class Activity {
  static param = "a-2"
  static async getHomeLocationD() {
    const data = await Http.request({
      url: "/activity/name/"+this.param
    })
    return data.data
  }
}

export {
  Activity
}