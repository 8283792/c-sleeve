class Matrix{
  m // 二维数组
  constructor(matrix){
    this.m = matrix
  }

  // 获取行数
  get rowsNum(){
    return this.m.length
  }

  // 获取列号
  get colsNum(){
    return this.m[0].length
  }
  each(callback){
    for(let j=0;j<this.colsNum;j++){
      for(let i=0;i<this.rowsNum;i++){
        const element = this.m[i][j]
        callback(element, i, j)
      }
    }
  }

  // numpy转置
  transpose(){
    const desArr = []
    for(let j=0;j<this.colsNum;j++){
      desArr[j] = []
      for(let i=0;i<this.rowsNum;i++){
        desArr[j][i] = this.m[i][j]
      }
    }
    return desArr
  }
}

export {
  Matrix
}