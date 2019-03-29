export default {
  install(Vue: any): void {
    /**
     * @method 格式化数字（每三位加逗号）
     * @param {Number,Str}
     * @return {Str}
     */
    Vue.prototype.$toThousands = (n: number): string => {
      let num = (n || 0).toString(),
        result = ''
      while (num.length > 3) {
        result = ',' + num.slice(-3) + result
        num = num.slice(0, num.length - 3)
      }
      if (num) {
        result = num + result
      }
      return result
    }

    /**
     * @method 数组等分
     * @param {Array} 原数组
     * @param {Number} 每份个数
     * @return {Array}
     */
    Vue.prototype.arrGroup = (
      array: Array<any>,
      subGroupLength: number
    ): Array<any> => {
      let index: number = 0
      let newArray: Array<any> = []
      while (index < array.length) {
        newArray.push(array.slice(index, (index += subGroupLength)))
      }
      return newArray
    }
  }
}
