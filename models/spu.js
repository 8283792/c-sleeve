import { Http } from "../utils/http";

class Spu {
  static isNoSpec(spu){
    const skuList = spu.sku_list
    // 判断是否是无规格sku
    if(skuList.length === 1 && skuList[0].specs.length === 0){
      return true
    }
    return false
  }

  static getDetail(id){
    return Http.request({
      url: `/spu/id/${id}/detail`
    })
  }
}

export {
  Spu
}