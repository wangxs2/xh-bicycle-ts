import mathjs from 'mathjs'

/**
 * 格式化数字（每三位加逗号）
 * @param {Number,Str}
 * @return {Str}
 */
export const toThousands = (n: number | String): string => {
  let num: string = (n || 0).toString(),
    result: string = ''
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
export const arrGroup = (
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

/**
 * @method 精确计算
 * @param {string} 表达式
 * @param {number} 保留几位小数 负值不变
 * @return {number}
 */
export const refinedCal = (ex: string, round: number): any => {
  const precision: number = 14
  let ev: number = mathjs.eval(ex)
  let result

  if (round >= 0) {
    result = mathjs.round(ev, round)
  } else {
    result = mathjs.format(ev, precision)
  }

  return result
}

/**
 * @method 数据类型判断
 * @param {any} 数据
 * @return {string}
 */
export const judgeType: Function = (n: any): string => {
  const typeStr: any = Object.prototype.toString.call(n)
  let typeName: string = ''
  switch (typeStr) {
    case '[object String]':
      typeName = 'string'
      break
    case '[object Number]':
      typeName = 'number'
      break
    case '[object Boolean]':
      typeName = 'boolean'
      break
    case '[object Undefined]':
      typeName = 'undefined'
      break
    case '[object Object]':
      typeName = 'object'
      break
    case '[object Array]':
      typeName = 'array'
      break
    case '[object Null]':
      typeName = 'null'
      break
    case '[object RegExp]':
      typeName = 'RegExp'
      break
    case '[object Symbol]':
      typeName = 'symbol'
      break
    case '[object JSON]':
      typeName = 'json'
      break
    case '[object Math]':
      typeName = 'math'
      break
    default:
      typeName = 'object'
  }

  return typeName
}

/**
 * @method 拷贝
 * @param {any} 数据
 * @return {any}
 */
export const cloneObj: Function = (obj: any) => {
  let str: string
  let newobj: any = obj.constructor === Array ? [] : {}

  if (typeof obj !== 'object') {
    return obj
  } else if (JSON) {
    str = JSON.stringify(obj)
    newobj = JSON.parse(str)
  } else {
    for (let i in obj) {
      newobj[i] = typeof obj[i] === 'object' ? cloneObj(obj[i]) : obj[i]
    }
  }
  return newobj
}
