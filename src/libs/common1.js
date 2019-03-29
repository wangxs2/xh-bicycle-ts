export default {
  install(Vue) {
    /**
     * @method 返回功能
     */
    Vue.prototype.getBack = function() {
      this.$router.go(-1)
    }

    /**
     * @method 获取前/后几天
     * @param {Number}
     * @return {Date}
     */
    Vue.prototype.getfrontOrBackDate = function(day) {
      return new Date(Date.now() + 1000 * 60 * 60 * 24 * day)
    }

    /**
     * @method 获取前/后几个月
     * @param {Number}
     * @return {Date}
     */
    Vue.prototype.getfrontOrBackMonth = function(month) {
      let now = new Date()
      now.setDate(1)
      now.setMonth(now.getMonth() + month)
      return now
    }

    /**
     * @method 格式化数字（每三位加逗号）
     * @param {Number,Str}
     * @return {Str}
     */
    Vue.prototype.toThousands = function(n) {
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
    Vue.prototype.arrGroup = function(array, subGroupLength) {
      let index = 0
      let newArray = []
      while (index < array.length) {
        newArray.push(array.slice(index, (index += subGroupLength)))
      }
      return newArray
    }

    /**
     *@method 删除文件的时间戳
     *@param {Str} 文件名
     *@return {Str} 删除时间戳后的文件名
     * */
    Vue.prototype.deletetimestamp = function(name) {
      let str = ''
      let oldname = name.lastIndexOf('.')
      let fileName = name.substring(0, oldname)
      let fileType = name.substring(oldname, oldname.length)
      fileName = fileName.substring(0, fileName.length - 13)
      str = fileName + fileType
      return str
    }

    /**
     * @method 获取cookie
     * @param {String} 获取coolie的key
     * @return {String} 获取coolie的value
     */
    Vue.prototype.getCookie = function(name) {
      var arr,
        reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
      if ((arr = document.cookie.match(reg))) {
        return unescape(arr[2])
      } else {
        return null
      }
    }

    /**
     * @method 深拷贝
     * @param {Obj} 需要拷贝的 对象 数组
     * @return {Obj}
     */
    Vue.prototype.cloneObj = function(obj) {
      let _this = this
      let str,
        newobj = obj.constructor === Array ? [] : {}
      if (typeof obj !== 'object') {
        return
      } else if (window.JSON) {
        str = JSON.stringify(obj)
        newobj = JSON.parse(str)
      } else {
        for (var i in obj) {
          newobj[i] =
            typeof obj[i] === 'object' ? _this.cloneObj(obj[i]) : obj[i]
        }
      }
      return newobj
    }

    /**
     * @method 全局过滤 时间
     */
    Vue.filter('FormatTime', (value, arg) => {
      if (value) {
        return new Date(value).Format(arg)
      }
    })
  }
}
