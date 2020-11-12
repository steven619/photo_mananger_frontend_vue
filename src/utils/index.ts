// Parse the time to string
import { analyze } from 'tern'
import { ok } from 'assert'
import request from '@/utils/request'
import { getToken, setAllDict } from '@/utils/auth'
export const parseTime = (
  time?: object | string | number,
  cFormat?: string
): string | null => {
  if (time === undefined) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date: Date
  if (typeof time === 'object') {
    date = time as Date
  } else {
    if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
      time = parseInt(time)
    }
    if (typeof time === 'number' && time.toString().length === 10) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj: { [key: string]: number } = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const timeStr = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    if (result.length > 0 && value < 10) {
      return '0' + value
    }
    return String(value) || '0'
  })
  return timeStr
}

// Format and filter json data using filterKeys array
export const formatJson = (filterKeys: any, jsonData: any) =>
  jsonData.map((data: any) => filterKeys.map((key: string) => {
    if (key === 'timestamp') {
      return parseTime(data[key])
    } else {
      return getPointValue(data, key)
    }
  }))

// Check if an element has a class
export const hasClass = (ele: HTMLElement, className: string) => {
  return !!ele.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'))
}

// Add class to element
export const addClass = (ele: HTMLElement, className: string) => {
  if (!hasClass(ele, className)) ele.className += ' ' + className
}

// Remove class from element
export const removeClass = (ele: HTMLElement, className: string) => {
  if (hasClass(ele, className)) {
    const reg = new RegExp('(\\s|^)' + className + '(\\s|$)')
    ele.className = ele.className.replace(reg, ' ')
  }
}

// Toggle class for the selected element
export const toggleClass = (ele: HTMLElement, className: string) => {
  if (!ele || !className) {
    return
  }
  let classString = ele.className
  const nameIndex = classString.indexOf(className)
  if (nameIndex === -1) {
    classString += '' + className
  } else {
    classString =
      classString.substr(0, nameIndex) +
      classString.substr(nameIndex + className.length)
  }
  ele.className = classString
}
export const debounce = (func:any, wait:any, immediate:any) => {
  let timeout:any, args:any, context:any, timestamp:any, result:any
  const later = function() {
    // 据上一次触发时间间隔
    const last = +new Date() - timestamp
    // 上次被包装函数被调用时间间隔last小于设定时间间隔wait
    if (last < wait && last > 0) {
      timeout = setTimeout(later, wait - last)
    } else {
      timeout = null
      // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
      if (!immediate) {
        result = func.apply(context, args)
        if (!timeout) context = args = null
      }
    }
  }
  return function(...args:any) {
    // @ts-ignore
    context = this
    timestamp = +new Date()
    const callNow = immediate && !timeout
    // 如果延时不存在，重新设定延时
    if (!timeout) timeout = setTimeout(later, wait)
    if (callNow) {
      result = func.apply(context, args)
      context = args = null
    }
    return result
  }
}
export const formatSeconds = (value:any) => {
  var secondTime = parseInt(value)
  var minuteTime = 0
  var hourTime = 0
  var dayTime = 0
  if (secondTime > 60) {
    minuteTime = parseInt(secondTime / 60 + '')
    secondTime = parseInt(secondTime % 60 + '')
    if (minuteTime > 60) {
      minuteTime = parseInt(minuteTime % 60 + '')
      hourTime = parseInt(minuteTime / 60 % 60 + '')
      dayTime = parseInt(hourTime / 24 % 24 + '')
    }
  }
  var result = '' + parseInt(secondTime + '') + '秒'
  if (minuteTime > 0) {
    result = '' + parseInt(minuteTime + '') + '分' + result
  }
  if (hourTime > 0) {
    result = '' + parseInt(hourTime + '') + '小时' + result
  }
  if (dayTime > 0) {
    result = '' + parseInt(dayTime + '') + '天' + result
  }
  return result
}
export const getDictEnum = (keyValue:string|undefined) => {
  let _enum = getAllDict()
  if (!keyValue || !_enum) return
  // @ts-ignore
  let _ = _enum[keyValue]
  if (!_) return []
  let _out:Array<any> = []
  _.forEach((k:any, i:number) => {
    _out.push({ 'value': k.value, 'label': k.title, 'code': k.code })
  })
  return _out
}
export const getDictName = (value:number, dictKey:string):string => {
  // @ts-ignore
  let d = getAllDict()
  if (!d) return ''
  // @ts-ignore
  const _dictionary = d[dictKey]
  if (dictKey === 'area') {
    return getAreaName(value, _dictionary) || ''
  }
  for (const i in _dictionary) {
    if (_dictionary[i].id === value) {
      return _dictionary[i].title
    }
  }
  return ''
}
export const getAreaName = (id:number, dict:any[]) : string => {
  for (const i in dict) {
    if (dict[i].id === id) {
      return dict[i].title
    }
    if (dict[i].children) {
      const rr = getAreaName(id, dict[i].children)
      if (rr) { return dict[i].title + rr }
    }
  }
  return ''
}
export const getDictEnumValueBySelf = (keyValue:string|undefined, ikey:string, ivalue:any, okey:string) => {
  let _enum = getAllDict()
  if (!keyValue || !_enum) return
  // @ts-ignore
  let _ = _enum[keyValue]
  if (!_) return []
  if (!okey) {
    okey = ikey
  }
  let out = ''
  _.forEach((k:any, i:number) => {
    if (k[ikey] === ivalue) {
      out = k[okey]
    }
  })
  return out
}
// @ts-ignore
export const getPointValue = (d:object, s:String) => {
  if (s.indexOf('.') > -1) {
    let _ = s.split('.')
    // @ts-ignore
    let r = getPointValue(d[_[0]], _[1])
    return r
  } else {
    // @ts-ignore
    if (d[s] !== null) {
      // @ts-ignore
      return d[s]
    } else {
      return null
    }
  }
}
export const isWeixinBrowser = ():boolean => {
  return /micromessenger/.test(navigator.userAgent.toLowerCase())
}

export const getAllDict = () => {
  let allDict = window.localStorage.getItem('SYSTEM_DICTIONARY')
  if (allDict) {
    return JSON.parse(allDict)
  } else {
    request({
      url: '/tools/dictionary',
      headers: {
        'JWT': getToken()
      },
      method: 'get'
    }).then((d:any) => {
      setAllDict('SYSTEM_DICTIONARY', d.data)
      return d.data
    })
    return null
  }
}
export const isMobile = ():boolean => {
  return /micromessenger|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}
