import request from '@/utils/request'
import { getToken, setAllDict } from '@/utils/auth'
import { area as areaData } from '../utils/area'
import { imgBaseUrl } from '@/settings'

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

export const formatJson = (filterKeys: any, jsonData: any) =>
  jsonData.map((data: any) => filterKeys.map((key: string) => {
    if (key === 'timestamp') {
      return parseTime(data[key])
    } else {
      return data[key]
    }
  }))

// @ts-ignore
export const getPointValue = (d:object, s:String, type?:string) => {
  if (d instanceof Array && d.length > 0) {
    d = d[0]
  }
  if (typeof s !== 'string') return ''
  if (s.indexOf('.') > -1) {
    let _ = s.split('.')
    // @ts-ignore
    let r = getPointValue(d[_[0]], _.slice(1).join('.'))
    return r
  } else {
    // @ts-ignore
    if (d && d[s] !== null) {
      // @ts-ignore
      return type === 'img' ? (imgBaseUrl + d[s]) : d[s]
    } else {
      return null
    }
  }
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

export const getDictName = (value:number, dictKey:string):string => {
  // @ts-ignore
  let d = getAllDict()
  if (!d) return ''
  // @ts-ignore
  const _dictionary = d[dictKey]
  if (dictKey === 'area') {
    return getAreaName(value, areaData) || ''
  }
  for (const i in _dictionary) {
    if (_dictionary[i].value === value) {
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
      if (rr && rr !== '') { return dict[i].title + rr }
    }
  }
  return ''
}

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
