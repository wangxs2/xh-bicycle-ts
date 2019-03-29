export default class Util {
  /**
   *@method 加
   */
  numAdd(num1, num2) {
    var baseNum, baseNum1, baseNum2
    try {
      baseNum1 = num1.toString().split('.')[1].length
    } catch (e) {
      baseNum1 = 0
    }
    try {
      baseNum2 = num2.toString().split('.')[1].length
    } catch (e) {
      baseNum2 = 0
    }
    baseNum = Math.pow(10, Math.max(baseNum1, baseNum2))
    return (num1 * baseNum + num2 * baseNum) / baseNum
  }

  /**
   *@method 减
   */
  numSub(num1, num2) {
    var baseNum, baseNum1, baseNum2
    var precision // 精度
    try {
      baseNum1 = num1.toString().split('.')[1].length
    } catch (e) {
      baseNum1 = 0
    }
    try {
      baseNum2 = num2.toString().split('.')[1].length
    } catch (e) {
      baseNum2 = 0
    }
    baseNum = Math.pow(10, Math.max(baseNum1, baseNum2))
    precision = baseNum1 >= baseNum2 ? baseNum1 : baseNum2
    return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision)
  }

  /**
   *@method 乘
   */
  numMulti(num1, num2) {
    var baseNum = 0
    try {
      baseNum += num1.toString().split('.')[1].length
    } catch (e) {}
    try {
      baseNum += num2.toString().split('.')[1].length
    } catch (e) {}
    return (
      (Number(num1.toString().replace('.', '')) *
        Number(num2.toString().replace('.', ''))) /
      Math.pow(10, baseNum)
    )
  }

  /**
   *@method 除
   */
  numDiv(num1, num2) {
    var baseNum1 = 0,
      baseNum2 = 0
    var baseNum3, baseNum4
    try {
      baseNum1 = num1.toString().split('.')[1].length
    } catch (e) {
      baseNum1 = 0
    }
    try {
      baseNum2 = num2.toString().split('.')[1].length
    } catch (e) {
      baseNum2 = 0
    }
    baseNum3 = Number(num1.toString().replace('.', ''))
    baseNum4 = Number(num2.toString().replace('.', ''))
    return (baseNum3 / baseNum4) * Math.pow(10, baseNum2 - baseNum1)
  }

  /**
   *@method 获取cookie
   */
  getCookie(name) {
    var arr,
      reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
    if ((arr = document.cookie.match(reg))) {
      return unescape(arr[2])
    } else {
      return null
    }
  }

  /**
   *@method 删除cookie
   */
  delCookie(name) {
    var exp = new Date()
    exp.setTime(exp.getTime() - 1)
    var cval = this.getCookie(name)
    if (cval != null)
      document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString()
  }
}



     // 创建区点标记
  //#6a82c8
  createPoint(
    color,
    lng,
    lat,
    orgName,
    bicycleNum,
    activeRate,
    polygonGeom,
    row
  ) {
    let marker = new AMap.Marker({
      position: new AMap.LngLat(lng, lat),
      offset: new AMap.Pixel(-40, -40),
      content: this.setContent(color, row),
      extData: { polygonGeom, row }
    })
    return marker
  }
  //改变图标的样式
  //6a82c8 db36f5
  setContent(color, row) {
    return `<div style="background-color: ${color};opacity: 0.8;color:#ffffff; height: 110px; width: 110px; border-radius: 55px;">
        <div style="padding-top:20px">
          <p style="margin:0;padding-bottom:10px">${row.orgName}</p>
          <p style="margin:0">总量:${row.bicycleNum}</p>
          <p style="margin:0">活跃率:${row.activeRate}</p>
        </div>
      </div>
    `
  }