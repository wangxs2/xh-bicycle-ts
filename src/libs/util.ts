import mathjs from 'mathjs';

/**
 * 格式化数字（每三位加逗号）
 * @param {Number,Str}
 * @return {Str}
 */
export const toThousands = (n: number | string): string => {
  let num: string = (n || 0).toString();
  let result: string = '';
  while (num.length > 3) {
    result = ',' + num.slice(-3) + result;
    num = num.slice(0, num.length - 3);
  }
  if (num) {
    result = num + result;
  }
  return result;
};

/**
 * @method 数组等分
 * @param {Array} 原数组
 * @param {Number} 每份个数
 * @return {Array}
 */
export const arrGroup = (
  array: any[],
  subGroupLength: number,
): any[] => {
  let index: number = 0;
  const newArray: any[] = [];
  while (index < array.length) {
    newArray.push(array.slice(index, (index += subGroupLength)));
  }
  return newArray;
};

/**
 * @method 精确计算
 * @param {string} 表达式
 * @param {number} 保留几位小数 负值不变
 * @return {number}
 */
export const refinedCal = (ex: string, round: number): any => {
  const precision: number = 14;
  const ev: number = mathjs.eval(ex);
  let result;

  if (round >= 0) {
    result = mathjs.round(ev, round);
  } else {
    result = mathjs.format(ev, precision);
  }

  return result;
};

/**
 * @method 数据类型判断
 * @param {any} 数据
 * @return {string}
 */
export const judgeType = (n: any): string => {
  const typeStr: any = Object.prototype.toString.call(n);
  let typeName: string = '';
  switch (typeStr) {
    case '[object String]':
      typeName = 'string';
      break;
    case '[object Number]':
      typeName = 'number';
      break;
    case '[object Boolean]':
      typeName = 'boolean';
      break;
    case '[object Undefined]':
      typeName = 'undefined';
      break;
    case '[object Object]':
      typeName = 'object';
      break;
    case '[object Array]':
      typeName = 'array';
      break;
    case '[object Null]':
      typeName = 'null';
      break;
    case '[object RegExp]':
      typeName = 'RegExp';
      break;
    case '[object Symbol]':
      typeName = 'symbol';
      break;
    case '[object JSON]':
      typeName = 'json';
      break;
    case '[object Math]':
      typeName = 'math';
      break;
    default:
      typeName = 'object';
  }

  return typeName;
};

/**
 * @method 拷贝
 * @param {any} 数据
 * @return {any}
 */
export const cloneObj = (obj: any) => {
  let str: string;
  let newobj: any = obj.constructor === Array ? [] : {};

  if (typeof obj !== 'object') {
    return obj;
  } else if (JSON) {
    str = JSON.stringify(obj);
    newobj = JSON.parse(str);
  } else {
    for (const i of Object.keys(obj)) {
      newobj[i] = typeof obj[i] === 'object' ? cloneObj(obj[i]) : obj[i];
    }
  }
  return newobj;
};

/**
 * @method 事件委托
 * @param {any} 数据
 * @return {any}
 */
export const eventDelegate = (
  parentSelector: string,
  targetSelector: string,
  events: string,
  foo: any,
) => {
  // 触发执行的函数
  function triFunction(e: any): void {
    // 兼容性处理
    const event = e;

    // 获取到目标阶段指向的元素
    let target = event.target || event.srcElement;

    // 获取到代理事件的函数
    const currentTarget = event.currentTarget;

    // 处理 matches 的兼容性
    if (!Element.prototype.matches) {
      Element.prototype.matches =
        (Element as any).prototype.matchesSelector ||
        (Element as any).prototype.mozMatchesSelector ||
        (Element as any).prototype.msMatchesSelector ||
        (Element as any).prototype.oMatchesSelector ||
        (Element as any).prototype.webkitMatchesSelector;
    }

    // 遍历外层并且匹配
    while (target !== currentTarget) {
      // 判断是否匹配到我们所需要的元素上
      if (target.matches(targetSelector)) {
        const sTarget = target;
        // 执行绑定的函数，注意 this
        foo.call(sTarget, Array.prototype.slice.call(arguments));
      }

      target = target.parentNode;
    }
  }

  // 如果有多个事件的话需要全部一一绑定事件
  events.split('.').forEach((evt) => {
    // 多个父层元素的话也需要一一绑定
    Array.prototype.slice
      .call(document.querySelectorAll(parentSelector))
      .forEach(($p) => {
        $p.addEventListener(evt, triFunction);
      });
  });
};
