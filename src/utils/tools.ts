import { imgBaseUrl } from '@/settings'

const Base64 = require('js-base64').Base64
const key = 'SYSTEM_DICTIONARY'
// const IMG_BASE_URL = 'http://192.168.9.188:33306'
const BASE_URL = process.env.BASE_URL
const win:any = window.localStorage
export function getDict() {
  return JSON.parse(win.getItem(key))
}
export function setDepartment(department:any) {
  window.localStorage.setItem('Department', JSON.stringify(department))
}
export function setDict(key:any, dict:any) {
  return window.localStorage.setItem(key, JSON.stringify(dict))
}
export default {
  getDepartment() {
    return JSON.parse(win.getItem('Department'))
  },
  tofix2(val:any) {
    if (!val) return '0.00'
    if (String(val).indexOf('.') > 0) {
      val = val + '0000'
    } else {
      val = val + '.0000'
    }
    return String(val.toString().match(/^\d+(?:\.\d{0,2})?/))
  },
  base64encode(e:any) {
    return Base64.encode(e)
  },
  base64decode(e:any) {
    return Base64.decode(e)
  },
  getToken() {
    return window.localStorage.getItem('ADMIN_TOKEN')
  },
  getDict(name:any) {
    if (name) {
      return JSON.parse(win.getItem(key))[name]
    } else {
      return JSON.parse(win.getItem(key))
    }
  },
  isEmpty(val:any) {
    return (val === undefined || val === 0) || (val == null || val.length <= 0)
  },
  getImgUrl(url:String) {
    if (this.isEmpty(url)) {
      return require('../assets/img/woody.png')
    }
    if (url.substring(0, 4) === 'http') {
      return url
    }
    return imgBaseUrl + url
  },
  getDictName(value:any, dictKey:any) {
    if (!value) return
    const _dictionary = JSON.parse(win.getItem(key))[dictKey]
    if (dictKey === 'area.ts') { return this.getAreaName(value, _dictionary) }
    for (const i in _dictionary) {
      if (_dictionary[i].value === value) {
        return _dictionary[i].title
      }
    }
  },
  downloadFile(url:any) {
    window.open(url)
  },
  getAreaName(id:String, dict:any) {
    for (const i in dict) {
      if (dict[i].id === id) {
        return dict[i].title
      }
      if (dict[i].children) {
        const rr:any = this.getAreaName(id, dict[i].children)
        if (rr) { return dict[i].title + rr }
      }
    }
  },
  getDepartmentName(id:any, dict:any) {
    for (const i in dict) {
      if (dict[i].id === parseInt(id)) {
        return dict[i].label
      }
      if (dict[i].children) {
        const rr:any = this.getDepartmentName(id, dict[i].children)
        if (rr) { return dict[i].label + '/' + rr }
      }
    }
  },
  idCard(UUserCard:any, num:String) {
    const reg = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
    let birth = null
    if (!reg.test(UUserCard)) {
      return null
    }
    if (num === 'birth') {
    // 获取出生日期
      birth = UUserCard.substring(6, 10) + '-' + UUserCard.substring(10, 12) + '-' + UUserCard.substring(12, 14)
      return birth
    }
    if (num === 'sex') {
    // 获取性别
      if (parseInt(UUserCard.substr(16, 1)) % 2 === 1) {
      // 男
        return '男'
      } else {
      // 女
        return '女'
      }
    }
    if (num === 'age') {
    // 获取年龄
      var myDate = new Date()
      var month = myDate.getMonth() + 1
      var day = myDate.getDate()
      var age = myDate.getFullYear() - UUserCard.substring(6, 10) - 1
      if ((UUserCard.substring(10, 12) < month || UUserCard.substring(10, 12) === month) && UUserCard.substring(12, 14) <= day) {
        age++
      }
      if (age <= 0) {
        age = 1
      }
      return age
    }
  }
}
