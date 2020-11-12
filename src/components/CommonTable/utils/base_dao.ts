import request from '@/utils/request'
import { getDictEnum } from './index'
import { ApiResponse, PaginationType, TableColumn } from '../utils/types'
import { isMobile } from '@/utils'
import { formatJson, getPointValue, getDictEnumValueBySelf, getDictName } from '../utils'
import settings from '@/settings'

var fileDownload = require('js-file-download')
export default class BaseDao {
  url:string | undefined = ''
  constructor(url?:string) {
    this.url = url
  }
  public subItem:string = '子部门'
  public deepAssign = require('deep-assign');
  public columns:number = 12
  public dialogWidth:string = this.checkMobile ? '100%' : '50%'
  public layout:string = this.checkMobile ? 'v' : 'h'
  public labelWidth:String = '150px'
  public actionWidth:String = 'auto'
  public dialogTop:string = '15vh'
  public tableColumn:TableColumn[] = []
  public searchBar:boolean = true
  public actionBar:boolean = true
  public exportButton:boolean = false
  public importButton:boolean = false
  public deleteButton:boolean = true
  public editButton:boolean = true
  public addButton:boolean = true
  public formSchema:any = {}
  public formSchemaData:any = {}
  public dateRange:boolean = false
  public highLight!:string
  public defaultTableData!:Object
  public index:boolean = true

  public formatJson = formatJson
  public getPointValue = getPointValue
  public getDictEnumValueBySelf = getDictEnumValueBySelf
  public getDictName = getDictName

  public fetchList(pagination?:Object, query?:Object) {
    let q:any = pagination
    if (q) { Object.assign(q, query) } else { q = query }
    return request({
      url: this.url,
      method: 'get',
      params: q
    })
  }
  get checkMobile():boolean {
    return isMobile()
  }
  public downloadFile(e:any) {
    window.location.href = e
  }
  public checkID(ID:string) {
    if (typeof ID !== 'string') return '非法字符串'
    let city:any = { 11: '北京', 12: '天津', 13: '河北', 14: '山西', 15: '内蒙古', 21: '辽宁', 22: '吉林', 23: '黑龙江 ', 31: '上海', 32: '江苏', 33: '浙江', 34: '安徽', 35: '福建', 36: '江西', 37: '山东', 41: '河南', 42: '湖北 ', 43: '湖南', 44: '广东', 45: '广西', 46: '海南', 50: '重庆', 51: '四川', 52: '贵州', 53: '云南', 54: '西藏 ', 61: '陕西', 62: '甘肃', 63: '青海', 64: '宁夏', 65: '新疆', 71: '台湾', 81: '香港', 82: '澳门', 91: '国外' }
    let birthday = ID.substr(6, 4) + '/' + Number(ID.substr(10, 2)) + '/' + Number(ID.substr(12, 2))
    let d = new Date(birthday)
    let newBirthday = d.getFullYear() + '/' + Number(d.getMonth() + 1) + '/' + Number(d.getDate())
    let currentTime = new Date().getTime()
    let time = d.getTime()
    let arrInt = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
    let arrCh = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']
    let sum:number = 0; var i; var residue
    if (!/^\d{17}(\d|x)$/i.test(ID)) return '非法身份证'
    if (city[ID.substr(0, 2)] === undefined) return '非法地区'
    if (time >= currentTime || birthday !== newBirthday) return '非法生日'
    for (i = 0; i < 17; i++) {
      // @ts-ignore
      sum += ID.substr(i, 1) * arrInt[i]
    }
    residue = arrCh[sum % 11]
    if (residue !== ID.substr(17, 1)) return '非法身份证'
    // @ts-ignore
    return city[ID.substr(0, 2)] + ',' + birthday + ',' + (ID.substr(16, 1) % 2 ? ' 男' : '女')
  }

  public exportList(pagination?:PaginationType, query?:any) {
    const q:PaginationType | undefined = pagination
    if (q) { Object.assign(q, query) }
    // @ts-ignore
    request({
      url: settings.devUrl + `${this.url}`,
      method: 'export',
      responseType: 'blob',
      params: q
    }).then((response:any) => {
      var date = new Date()
      const filename = (query.keywords ? query.keywords : '') + (query.daterange ? query.daterange.start_date + '-' + query.daterange.start_date : '') + '列表-' + `${date.getFullYear()}${date.getMonth() < 9 ? '0' : ''}${date.getMonth() + 1}${date.getDate() < 10 ? '0' : ''}${date.getDate()}.xls`
      console.log('filename', filename)
      fileDownload(response.data, filename)
    })
  }

  public fetchObject(id:String, query?:any) {
    return request({
      url: `${this.url}/${id}`,
      method: 'get',
      params: query
    })
  }
  public commonRequest(url:string, op:string = 'GET', query?:any, data?:any) {
    // @ts-ignore
    return request({
      url: url,
      method: op,
      params: query,
      data: data
    })
  }

  public createObject(data:Object) {
    return request({
      url: this.url,
      method: 'post',
      data
    })
  }

  public updateObject(id:Number|String, data:Object) {
    return request({
      url: `${this.url}/${id}`,
      method: 'put',
      data
    })
  }

  public deleteObject(id:Number) {
    return request({
      url: `${this.url}/${id}`,
      method: 'delete'
    })
  }

  public line(title:String):object {
    return {
      'type': 'HTML',
      'value': `<div style="border-left: 4px solid orange;margin-top: 15px;margin-bottom: 15px;padding-left: 6px; color: orange">${title}</div>`
    }
  }

  public getFormSchema(tableColumn:TableColumn[] = this.tableColumn): Object {
    let properties:any = {}
    tableColumn.forEach((k, i) => {
      let _p:any = {
        'type': 'string',
        'ui': {
          'inVLayout': true,
          'label': k.name,
          'disabled': k.disabled ? k.disabled : false,
          'columns': k.columns ? k.columns : this.columns,
          'placeholder': `请填写${k.name}`,
          'help': {
            'show': !!k.help,
            'text': '?',
            'content': k.help
          }
        },
        'rules': {
          'required': {
            'value': k.required === true,
            'errMsg': '必填'
          }
        }
      }
      switch (k.type) {
        case 'line':
          _p = this.line(k.name)
          break
        case 'boolean':
          _p.type = 'boolean'
          break
        case 'str':
          _p.type = 'string'
          break
        case 'int':
          _p.type = 'integer'
          break
        case 'area':
          _p.type = 'integer'
          _p.ui.widget = 'area-cascader'
          break
        case 'ip':
          _p.rulescustomRule = [
            {
              'script': `dx: !{{$root.${_p.value}}>100`,
              'errMsg': 'IP地址格式不正确'
            }
          ]
          break
        case 'password':
          _p.type = 'password'
          break
        case 'img':
          _p.type = 'string'
          _p.ui.widget = 'wd-upload'
          _p.ui.widgetConfig = {
            'uploadUrl': 'api/v1/tools/upload',
            'listType': 'picture-card',
            'multiple': false,
            'autoUpload': true,
            'limit': 1,
            'accept': '.jpg,.jpeg,.png,.gif,.bmp,.JPG,.JPEG,.GIF,.BMP'
          }
          break
        case 'datetime':
          _p.ui.widget = 'date-picker'
          _p.ui.widgetConfig = {
            'placeholder': `请填写${k.name}`,
            'valueFormat': 'yyyy-MM-ddTHH:mm:ss',
            'type': 'datetime'
          }
          break
        case 'date':
          _p.ui.widget = 'date-picker'
          _p.ui.widgetConfig = {
            'placeholder': `请填写${k.name}`,
            'valueFormat': 'yyyy-MM-dd',
            'type': 'date'
          }
          break
        case 'select':
          _p.type = 'integer'
          _p.ui.widget = 'select'
          _p.ui.widgetConfig = {
            'placeholder': `请选择${k.name}`,
            'enumSource': k.enumName ? getDictEnum(k.enumName) : []
          }
          break
        case 'remoteselect':
          _p.type = 'number'
          _p.ui.widget = 'remote-select'
          _p.ui.widgetConfig = {
            'placeholder': `请选择${k.name}`
          }
          break
        case 'remotesascader':
          _p.type = 'number'
          _p.ui.widget = 'remote-sascader'
          _p.ui.widgetConfig = {
            'placeholder': `请选择${k.name}`
          }
          break
        case 'slot':
          _p.type = 'slot'
          break
        case 'bool':
          _p.type = 'boolean'
          break
      }
      if (_p.type !== 'slot') {
        if (k.ownSchema && typeof k.ownSchema === 'object') {
          _p = this.deepAssign(_p, k.ownSchema)
        }
        properties[k.value] = _p
      }
    })
    return {
      'type': 'object',
      'ui': {
        'widgetConfig': {
          'layout': this.layout,
          'labelWidth': this.labelWidth
        }
      },
      'properties': properties
    }
  }
}
