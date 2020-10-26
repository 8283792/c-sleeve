import { Http } from "../utils/http";

class Category {
  static async getHomeLocationC() {
    const data = await Http.request({
      url: '/category/grid/all'
    })
    return data.data
  }
}

export {
  Category
}