import { Http } from "../utils/http"

class CateGories{
  roots = []
  subs = []

  async getAll(){
    const categories = await Http.request({
      url: `/category/all`
    })

    this.roots = categories.data.roots
    this.subs = categories.data.subs
  }

  getRoots(){
    return this.roots
  }

  getRoot(rootId){
    return this.roots.find(r => r.id === rootId)
  }

  getSubs(parentId){
    return this.subs.filter(s => s.parent_id === parentId)
  }
}

export {
  CateGories
}